"use client"

import { useEffect, useState } from "react";

export default function Moderate() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [producers, setProducers] = useState<any[]>([]);

    useEffect(() => {
        try {
            async function getAdmin() {
            const res = await fetch (`http://localhost:4000/api/moderate`, { method: "GET", credentials: "include"});
            if (!res.ok) {throw new Error("No tea with that id!");}
            const data = await res.json();

            setVendors(data.vendors)
            console.log(data.vendors)
        }
        getAdmin();
        } catch {
            console.error("failed to fetch admin page")
        }
        }, [])

    return (
        <ul>
            <li>{vendors[0].name}</li>
        </ul>
    )
}