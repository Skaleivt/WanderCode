
'use client';
import React, { useEffect, useRef } from 'react';
import styles from './ConfirmModal.module.css';


type Variant = 'confirm' | 'error' | 'success';

export type ConfirmModalProps = {
  isOpen: boolean;
  variant?: Variant; 
  title: string;
  description?: string;
   confirmText?: string;
   onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  onClose: () => void;
   closeOnBackdrop?: boolean;  
 showClose?: boolean; 
};

export default function ConfirmModal({
  isOpen,
  variant = 'confirm',
  title,
  description,
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'Зареєструватися',
  cancelText  = 'Увійти',
   closeOnBackdrop = true,
  showClose = true,
}: ConfirmModalProps) {
const confirmBtnRef = useRef<HTMLButtonElement | null>(null);
const titleId = 'modal-title';
  const descId = description ? 'modal-desc' : undefined;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

// Фокус на кнопку підтвердження при відкритті
  useEffect(() => {
    if (isOpen) confirmBtnRef.current?.focus();
  }, [isOpen]);


   // блокуємо скрол фону
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className={styles.backdrop} 
    role="dialog" 
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId} 
    onClick={ closeOnBackdrop ? onClose : undefined}>

      <div  className={`${styles.card} ${styles[variant] || ''}`}
      onClick={(e) => e.stopPropagation()}>
        {showClose && (
          <button
            className={styles.close}
            type="button"
            aria-label="Закрити"
            onClick={onClose}
          >
            ×
          </button>
        )}

        <h3 id={titleId} className={styles.title}>{title}</h3>
        {description && <p id={descId} className={styles.desc}>{description}</p>}

        <div className={styles.actions}>
          <button 
          ref={confirmBtnRef} className={styles.primary} onClick={onConfirm}>{confirmText}</button>
          <button className={styles.ghost} onClick={onCancel ? onCancel : onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}
  