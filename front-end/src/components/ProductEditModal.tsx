import { useEffect, useState } from 'react';
import { type ShoppingItem as ShoppingItemType } from '../types/shopping.types';

interface EditPayload {
  name: string;
  description: string;
}

interface ProductEditModalProps {
  isOpen: boolean;
  isSaving: boolean;
  item: ShoppingItemType | null;
  onClose: () => void;
  onSave: (payload: EditPayload) => Promise<void>;
}

const ProductEditModal = ({ isOpen, isSaving, item, onClose, onSave }: ProductEditModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!item) {
      setName('');
      setDescription('');
      setError('');
      return;
    }

    setName(item.name);
    setDescription(item.description ?? '');
    setError('');
  }, [item]);

  if (!isOpen || !item) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 3) {
      setError('שם המוצר חייב להכיל לפחות 3 תווים.');
      return;
    }

    setError('');
    await onSave({
      name: trimmedName,
      description: trimmedDescription
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-label="עריכת מוצר"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="edit-modal-header">
          <h3>עריכת מוצר</h3>
          <button className="icon-button close-modal-button" onClick={onClose} aria-label="סגירה" title="סגירה">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form className="edit-form" onSubmit={handleSubmit}>
          <label className="field-wrap">
            <span>שם מוצר</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              autoFocus
            />
          </label>

          <label className="field-wrap">
            <span>תיאור</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={400}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="edit-form-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? 'שומר...' : 'שמירה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
