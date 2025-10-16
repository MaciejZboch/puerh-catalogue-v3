"use client";
import ITableTea from "@/types/tabletea";

interface Props {
  tea: ITableTea;
  onCollected: (teaId: string) => void;
}

export default function CollectButton({ tea, onCollected }: Props) {
  async function handleCollect() {
    try {
      const res = await fetch(
        `http://localhost:4000/api/teas/${tea._id}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error(err.error);
        return;
      }

       const updatedTea = await fetch(
      `http://localhost:4000/api/teas/${tea._id}`
      ).then((r) => r.json());

      onCollected(updatedTea); // pass full updated object
    } catch (err) {
    console.error("Error updating collection:", err);
    }
  }

  return (
    <button
      onClick={handleCollect}
      className="px-3 py-1 rounded bg-green-accent text-dark hover:bg-green-soft transition"
    >
      Collect
    </button>
  );
}
