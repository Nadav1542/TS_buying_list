// Imports
import { type ShoppingItem as ShoppingItemType } from '../types/shopping.types'; 
import ShoppingItem from './ShoppingItem'; 

// Component props
interface ShoppingListProps {
  items: ShoppingItemType[];
  onToggleBought: (id: string) => void; // Toggle bought status
  onDelete: (id: string) => void; // Delete product
  onEdit: (item: ShoppingItemType) => void;
  ariaLabel: string;
  emptyMessage: string;
}

// Component declaration
const ShoppingList = ({ items, onToggleBought, onDelete, onEdit, ariaLabel, emptyMessage }: ShoppingListProps) => {
  // Render
  return (
    <section className="shopping-list" aria-label={ariaLabel}>
      {items.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        items.map(item => (
          <ShoppingItem 
            key={item._id} 
            item={item} 
            onToggleBought={onToggleBought} 
            onDelete={onDelete} 
            onEdit={onEdit}
          />
        ))
      )}
    </section>
  );
};

// Export
export default ShoppingList;

