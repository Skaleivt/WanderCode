
'use client';
import React from 'react';
import styles from './Modal.module.css';

export type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
  confirmText = 'OK',
  cancelText = 'Скасувати',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal>
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onConfirm}>{confirmText}</button>
          <button className={styles.ghost} onClick={onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}