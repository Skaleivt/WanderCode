
'use client';
import React, { useEffect, useRef } from 'react';
import styles from './ConfirmModal.module.css';

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
   confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
 
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'Зареєструватися',
  cancelText = 'Увійти',
}: ConfirmModalProps) {
const confirmBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Фокус на primary-кнопку коли модалка відкрилась
  useEffect(() => {
    if (isOpen) confirmBtnRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

 
  return (
    <div className={styles.backdrop} role="dialog" aria-modal onClick={onClose}>
      <div className={styles.card}
      onClick={(e) => e.stopPropagation()}>
        <h3  className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}

        <div className={styles.actions}>
          <button 
          ref={confirmBtnRef} className={styles.primary} onClick={onConfirm}>{confirmText}</button>
          <button className={styles.ghost} onClick={onCancel ? onCancel : onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}
  