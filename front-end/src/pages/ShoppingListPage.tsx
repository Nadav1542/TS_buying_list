import ShoppingList from "../components/ShoppingList";
import ProductEditModal from "../components/ProductEditModal";
import ProductsAddingModal from "../components/ProductsAddingModal";
import {useEffect, useState} from "react";
import {addProducts, getShoppingList, updateProduct, deleteProduct, type CreateProductsDTO} from "../services/shoppingService";
import {type ShoppingItem} from "../types/shopping.types";

const ShoppingListPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const boughtCount = items.filter((item) => item.bought).length;
  const pendingCount = items.length - boughtCount;
  const remainingItems = items.filter((item) => !item.bought);
  const boughtItems = items.filter((item) => item.bought);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  useEffect(() => {
    
    fetchShoppingList();
  }, []);

  
  const fetchShoppingList = async () => {
    
    try {
      const data = await getShoppingList();
      setItems(data);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    }
  };
  
  // Handler for toggling the 'bought' status (Optimistic UI Approach)
  const handleToggleBought = async (id: string) : Promise<void> => {
    const itemToToggle = items.find(item => item._id === id);
    if (!itemToToggle) return;

    const newBoughtStatus = !itemToToggle.bought;

    // 1. Optimistic update: Update the UI immediately for a snappy feel
    setItems(prevItems => 
      prevItems.map(item => 
        item._id === id ? { ...item, bought: newBoughtStatus } : item
      )
    );

    try {
      // 2. Send the background request to the server
      await updateProduct(id, { bought: newBoughtStatus });
    } catch (error) {
      console.error("Failed to toggle status:", error);
      
      // 3. Rollback the UI if the server request fails
      setItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, bought: !newBoughtStatus } : item
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    const indexToDelete = items.findIndex((item) => item._id === id);
    if (indexToDelete < 0) return;

    const itemToDelete = items[indexToDelete];

    setItems((prevItems) => prevItems.filter((item) => item._id !== id));

    try {
      const deletedProduct = await deleteProduct(id);

      if (deletedProduct._id !== id) {
        console.error('Delete response mismatch. Requested id:', id, 'received id:', deletedProduct._id);
        fetchShoppingList();
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      // Roll back to the exact previous position if delete fails.
      setItems((prevItems) => {
        const alreadyExists = prevItems.some((item) => item._id === itemToDelete._id);
        if (alreadyExists) return prevItems;

        const nextItems = [...prevItems];
        const rollbackIndex = Math.max(0, Math.min(indexToDelete, nextItems.length));
        nextItems.splice(rollbackIndex, 0, itemToDelete);
        return nextItems;
      });
    }
  };

  const handlePriorityChange = async (id: string, newPriority: ShoppingItem['priority']) => {
    
    const itemToUpdate = items.find(item => item._id === id);
    if (!itemToUpdate) return;

    const oldPriorityStatus = itemToUpdate.priority;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item._id === id ? { ...item, priority: newPriority } : item
      )
    );

    try {
      await updateProduct(id, { priority: newPriority });
    } catch (error) {
      console.error("Error updating priority:", error);
      setItems(prevItems => 
        prevItems.map(item => 
          item._id === id ? { ...item, priority: oldPriorityStatus } : item
        )
      );
    }
  };  

  const handleOpenEdit = (item: ShoppingItem) => {
    setEditingItem(item);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = async (payload: { name: string; description: string }) => {
    if (!editingItem) return;

    setIsSavingEdit(true);

    try {
      const updatedProduct = await updateProduct(editingItem._id, {
        name: payload.name,
        description: payload.description
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === updatedProduct._id ? updatedProduct : item
        )
      );

      setEditingItem(null);
    } catch (error) {
      console.error("Error updating product details:", error);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleOpenAddingModal = () => {
    setIsAddingOpen(true);
  };

  const handleCloseAddingModal = () => {
    setIsAddingOpen(false);
  };

  const handleSaveProducts = async (payload: { products: CreateProductsDTO }) => {
    setIsSavingAdd(true);

    try {
      const result = await addProducts(payload.products);
      setItems((prevItems) => [...result.products, ...prevItems]);
      setIsAddingOpen(false);
      return result;
    } finally {
      setIsSavingAdd(false);
    }
  };



  return (
    <div className="shopping-list-page">
      <header className="page-header">
        <p className="eyebrow">רשימת קניות חכמה</p>
        <h1>רשימת הקניות שלי</h1>
        <p className="page-subtitle">מתכננים טוב יותר, קונים מהר יותר, ועוקבים אחרי מה שכבר נקנה.</p>
      </header>

      <section className="stats-grid" aria-label="Shopping summary">
        <article className="stat-card">
          <p className="stat-label">סה"כ פריטים</p>
          <p className="stat-value">{items.length}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">נקנו</p>
          <p className="stat-value">{boughtCount}</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">ממתינים</p>
          <p className="stat-value">{pendingCount}</p>
        </article>
      </section>

      <section className="lists-grid">
        <article className="list-block">
          <div className="list-title-row">
            <h2 className="list-title">מוצרים שנותרו לקנייה</h2>
            <button className="add-products-button" onClick={handleOpenAddingModal} aria-label="הוספת מוצרים" title="הוספת מוצרים">
              <span>+</span>
            </button>
          </div>
          <ShoppingList
            items={remainingItems}
            onToggleBought={handleToggleBought}
            onDelete={handleDelete}
            onPriorityChange={handlePriorityChange}
            onEdit={handleOpenEdit}
            ariaLabel="מוצרים שנותרו לקנייה"
            emptyMessage="אין מוצרים ממתינים כרגע."
            showPriority={false}
          />
        </article>

        <article className="list-block">
          <h2 className="list-title">מוצרים שנקנו</h2>
          <ShoppingList
            items={boughtItems}
            onToggleBought={handleToggleBought}
            onDelete={handleDelete}
            onPriorityChange={handlePriorityChange}
            onEdit={handleOpenEdit}
            ariaLabel="מוצרים שנקנו"
            emptyMessage="עדיין לא סומנו מוצרים כנקנו."
            showPriority={false}
          />
        </article>
      </section>

      <ProductEditModal
        isOpen={Boolean(editingItem)}
        isSaving={isSavingEdit}
        item={editingItem}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      <ProductsAddingModal
        isOpen={isAddingOpen}
        isSaving={isSavingAdd}
        onClose={handleCloseAddingModal}
        onSave={handleSaveProducts}
      />
    </div>
  );
};

export default ShoppingListPage;    