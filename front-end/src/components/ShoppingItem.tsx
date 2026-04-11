// Imports
import { type ChangeEvent } from 'react';
import { type ShoppingItem as ShoppingItemType } from '../types/shopping.types'; 

// Component props
interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggleBought: (id: string) => void; // Toggle bought status
  onDelete: (id: string) => void; // Delete product
  onPriorityChange?: (id: string, newPriority: ShoppingItemType['priority']) => void; // Change priority
  onEdit: (item: ShoppingItemType) => void;
  showPriority?: boolean;
}

// Component declaration
const ShoppingItem = ({ item, onToggleBought, onDelete, onPriorityChange, onEdit, showPriority = true }: ShoppingItemProps) => {

  // UI helper based on item priority
  const getPriorityBorderColor = (priority: ShoppingItemType['priority']) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const handlePrioritySelect = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!onPriorityChange) {
      return;
    }
    const nextPriority = event.target.value as ShoppingItemType['priority'];
    if (nextPriority !== item.priority) {
      onPriorityChange(item._id, nextPriority);
    }
  };

  // Render
  return (
    <div 
      className="shopping-item-card" 
      style={showPriority ? { borderInlineStart: `4px solid ${getPriorityBorderColor(item.priority)}` } : undefined}
    >
      <div className="item-header">
        <div className="item-title-wrap">
          {/* Product name with strike-through when bought */}
          <h3 style={{ textDecoration: item.bought ? 'line-through' : 'none' }}>
            {item.name}
          </h3>
          <p className="item-status">{item.bought ? 'נקנה' : 'ממתין לקנייה'}</p>
        </div>

        {showPriority && (
          <select
            className={`priority-badge priority-picker priority-${item.priority}`}
            value={item.priority}
            onChange={handlePrioritySelect}
            aria-label={`שינוי עדיפות עבור ${item.name}`}
          >
            <option value="low">נמוכה</option>
            <option value="medium">בינונית</option>
            <option value="high">גבוהה</option>
          </select>
        )}
      </div>

      {/* Show description only when present */}
      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      <div className="item-actions">
        <button
          className="icon-button edit-icon-button"
          onClick={() => onEdit(item)}
          aria-label="עריכת מוצר"
          title="עריכת מוצר"
        >
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
            <path d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className="icon-button move-button"
          onClick={() => onToggleBought(item._id)}
          aria-label={item.bought ? 'החזרה לרשימת ממתינים' : 'סימון מוצר כנקנה'}
          title={item.bought ? 'החזרה לרשימת ממתינים' : 'סימון מוצר כנקנה'}
        >
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
            <path d="M3 3h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H7.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="19" r="1.4" fill="currentColor"/>
            <circle cx="17" cy="19" r="1.4" fill="currentColor"/>
          </svg>
        </button>

        <button
          className="icon-button delete-icon-button"
          onClick={() => onDelete(item._id)}
          aria-label="מחיקת מוצר"
          title="מחיקת מוצר"
        >
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
            <path d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Export
export default ShoppingItem;