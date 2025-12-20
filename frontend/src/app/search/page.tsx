"use client";
import Search from "@/components/search/Search";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback="Loading...">
      <Search />
    </Suspense>
  );
}
