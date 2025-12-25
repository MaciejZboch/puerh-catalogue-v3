"use client";
import { useAuthModal } from "../global/AuthModalProvider";

export default function RegisterButton() {
  const { openRegister } = useAuthModal();

  return (
    <>
      <button
        onClick={openRegister}
        className="nohover bg-orange-500 hover:bg-orange-muted transition-all text-white font-semibold px-6 py-3 rounded-full shadow-lg"
      >
        Start steeping!
      </button>
    </>
  );
}
