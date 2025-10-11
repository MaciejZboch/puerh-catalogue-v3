"use client";
import { deleteTea } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DeleteTeaButton ({teaId}: {teaId: string}) {
    const router = useRouter();

    function handleDelete() {
        try {
            deleteTea(teaId)
            router.push("/");  
        } catch (err) {
            console.error(err);
            alert("Failed to delete this tea.")
        }
    }
    return <button onClick={() => handleDelete()} className="text-green-accent rounded-xl py-2 px-4 mx-4">Delete</button>
}