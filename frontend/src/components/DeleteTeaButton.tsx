"use client";
import { deleteTea } from "@/lib/api";

export default function DeleteTeaButton ({teaId}: {teaId: string}) {
    function handleDelete() {
        deleteTea(teaId)
    }
    return <button onClick={() => handleDelete()} className="text-green-accent rounded-xl py-2 px-4 mx-4">Delete</button>
}