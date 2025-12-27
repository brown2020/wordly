"use client";

import { FC, ReactNode } from "react";
import { CloseIcon } from "./icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 p-4">
      <div
        className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full overflow-hidden`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-500"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

