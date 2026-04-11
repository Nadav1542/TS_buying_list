import { useEffect, useState, type FormEvent } from 'react';
import {
  type CreateProductsDTO,
  type CreateProductsResponseDTO
} from '../services/shoppingService';



interface AddingPayload {
  products: CreateProductsDTO;
}

interface ProductsAddingModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: AddingPayload) => Promise<CreateProductsResponseDTO>;
}

const ProductsAddingModal = ({ isOpen, isSaving, onClose, onSave }: ProductsAddingModalProps) => {
  const [productsText, setProductsText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setProductsText('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const mapTextToProducts = (rawText: string): CreateProductsDTO => {
    const lines = rawText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((name) => ({ name }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const products = mapTextToProducts(productsText);
    if (products.length === 0) {
      setError('יש להזין לפחות מוצר אחד.');
      return;
    }

    setError('');

    try {
      await onSave({ products });
      setProductsText('');
      onClose();
    } catch {
      setError('שמירת הרשימה נכשלה. נסו שוב.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-label="הוספת רשימת מוצרים"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="edit-modal-header">
          <h3>הוספת רשימת מוצרים</h3>
          <button className="icon-button close-modal-button" onClick={onClose} aria-label="סגירה" title="סגירה">
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form className="edit-form" onSubmit={handleSubmit}>
          <label className="field-wrap">
            <span>הכנס מוצרים ברשימה, בין מוצר למוצר הפרד באמצעות ירידת שורה</span>
            <textarea
              value={productsText}
              onChange={(event) => setProductsText(event.target.value)}
              rows={8}
              maxLength={2000}
              placeholder={'חלב\nלחם\nביצים'}
              autoFocus
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="edit-form-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? 'שומר...' : 'הוספת מוצרים'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export type { AddingPayload, ProductsAddingModalProps };
export default ProductsAddingModal;