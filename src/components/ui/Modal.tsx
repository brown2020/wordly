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
    <div className="fixed inset-0 bg-gray-800/75 z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
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
