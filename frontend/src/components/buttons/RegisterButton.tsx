"use client";
import { useAuthModal } from "../global/AuthModalProvider";

export default function RegisterButton({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) {
  const { openRegister } = useAuthModal();

  return (
    <>
      <button onClick={openRegister} className={className}>
        {text}
      </button>
    </>
  );
}
