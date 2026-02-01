"use client";

import { FC, useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: FC<ToastProps> = ({
  message,
  isVisible,
  onHide,
  duration = 1500,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, duration]);

  if (!isVisible || !message) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
      <div className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 px-4 py-3 rounded font-bold text-sm shadow-lg">
        {message}
      </div>
    </div>
  );
};
