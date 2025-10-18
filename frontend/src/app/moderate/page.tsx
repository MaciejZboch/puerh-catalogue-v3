"use client"

import { IProducer } from "@/types/producer";
import { IVendor } from "@/types/vendor";
import { useEffect, useState } from "react";

export default function Moderate() {
    const [vendors, setVendors] = useState<IVendor[]>();
    const [producers, setProducers] = useState<IProducer[]>([]);

    async function approveVendor(vendorId: string) {
        const res = await fetch (`http://localhost:4000/api/moderate/vendor/${vendorId}`, { method: "GET", credentials: "include"});
            if (!res.ok) {throw new Error("No tea with that id!");}
        const data = await res.json();
    }

    useEffect(() => {
        try {
            async function getAdmin() {
            const res = await fetch (`http://localhost:4000/api/moderate`, { method: "GET", credentials: "include"});
            if (!res.ok) {throw new Error("No tea with that id!");}
            const data = await res.json();

            setProducers(data.producers)
            setVendors(data.vendors)
        }
        getAdmin();
        } catch {
            console.error("failed to fetch admin page")
        }
        }, [])

    return ( <>
        <h2>Vendors</h2>
        <ul>
            <li>{vendors && vendors[0].name}</li> <button>Approve</button> <button>Reject</button>
        </ul>
        <h2>Producers</h2>
        <ul>
            <li></li> <button>Approve</button> <button>Reject</button>
        </ul>
    </> )
}