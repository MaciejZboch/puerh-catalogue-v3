"use client";
import { useAuthModal } from "../global/AuthModalProvider";

export default function RegisterButton({ className }: { className?: string }) {
  const { openLogin } = useAuthModal();

  return (
    <>
      <button className={className} onClick={openLogin}>
        Login
      </button>
    </>
  );
}
