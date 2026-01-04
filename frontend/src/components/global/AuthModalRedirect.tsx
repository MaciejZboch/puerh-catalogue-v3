"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthModal } from "@/components/global/AuthModalProvider";
import { useRouter } from "next/navigation";

export function AuthRedirectListener() {
  const params = useSearchParams();
  const router = useRouter();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (params.get("login") === "1") {
      openLogin();

      //delete redirect query string so that the modal can close
      const newParams = new URLSearchParams(params.toString());
      newParams.delete("login");

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [params, openLogin]);

  return null;
}
