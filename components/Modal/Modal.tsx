"use client";

import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface Modal {
  children: React.ReactNode;
  onClose: () => void;
}

export default function CreateModal({ children, onClose }: Modal) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
