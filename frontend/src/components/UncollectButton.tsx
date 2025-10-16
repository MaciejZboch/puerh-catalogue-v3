"use client";
import ISearchTea from "@/types/searchtea";

interface Props {
  tea: ISearchTea;
  onRemoved: (teaId: string) => void;
}

export default function UncollectButton({ tea, onRemoved }: Props) {
  async function handleUncollect() {
    try {
      const res = await fetch(
        `http://localhost:4000/api/teas/${tea._id}/add`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error(err.error);
        return;
      }

      onRemoved(tea._id);
    } catch (err) {
      console.error("Error updating collection:", err);
    }
  }

  return (
    <button
      onClick={handleUncollect}
      className="px-3 py-1 rounded bg-green-accent text-dark hover:bg-green-soft transition"
    >
      Remove
    </button>
  );
}
