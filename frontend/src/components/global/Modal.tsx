"use client";

import { ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal content */}
      <div
        className={`relative z-10 transform transition-all duration-300
          ${open ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        {children}
      </div>
    </div>
  );
}
