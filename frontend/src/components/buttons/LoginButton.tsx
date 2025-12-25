"use client";
import { useAuthModal } from "../global/AuthModalProvider";

export default function RegisterButton() {
  const { openLogin } = useAuthModal();

  return (
    <>
      <button onClick={openLogin}>Login</button>
    </>
  );
}
