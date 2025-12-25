"use client";

import { createContext, useContext, useState } from "react";
import Modal from "@/components/global/Modal";
import RegisterForm from "@/components/global/RegisterForm";
import LoginForm from "@/components/global/LoginForm";

type AuthMode = "login" | "register" | null;

type AuthModalContextType = {
  openLogin: () => void;
  openRegister: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AuthMode>(null);

  const close = () => setMode(null);

  return (
    <AuthModalContext.Provider
      value={{
        openLogin: () => setMode("login"),
        openRegister: () => setMode("register"),
      }}
    >
      {children}

      <Modal open={mode !== null} onClose={close}>
        {mode === "register" && <RegisterForm onSuccess={close} />}

        {mode === "login" && <LoginForm onSuccess={close} />}
      </Modal>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }
  return ctx;
}
