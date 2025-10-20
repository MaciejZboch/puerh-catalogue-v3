"use client"

import { IProducer } from "@/types/producer";
import { IVendor } from "@/types/vendor";
import { useEffect, useState } from "react";

export default function Moderate() {
    const [vendors, setVendors] = useState<IVendor[]>();
    const [producers, setProducers] = useState<IProducer[]>([]);

    async function changeVendorStatus(vendorId: string, status: "approved" | "rejected") {
        const res = await fetch (`http://localhost:4000/api/moderate/vendor/${vendorId}?status=${status}`, { method: "PUT", credentials: "include"});
            if (!res.ok) {throw new Error("No tea with that id!");}
        const data = await res.json();
    }

     async function changeProducerStatus(producerId: string, status: "approved" | "rejected") {
        const res = await fetch (`http://localhost:4000/api/moderate/producer/${producerId}?status=${status}`, { method: "PUT", credentials: "include"});
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
  {vendors?.map((vendor) => (
    <li key={vendor._id || vendor.name} style={{ marginBottom: "10px" }}>
      {vendor.name}
      <button className="bg-green-accent ml-10" onClick={() => changeVendorStatus(vendor._id, "approved")}>Approve</button>
      <button className="bg-green-accent ml-10" onClick={() => changeVendorStatus(vendor._id, "rejected")}>Reject</button>
    </li>
  ))}
</ul>

<h2>Producers</h2>
<ul>
  {producers?.map((producer) => (
    <li key={producer._id || producer.name} style={{ marginBottom: "10px" }}>
      {producer.name}
      <button className="bg-green-accent ml-10" onClick={() => changeProducerStatus(producer._id, "approved")}>Approve</button>
      <button className="bg-green-accent ml-10" onClick={() => changeProducerStatus(producer._id, "rejected")}>Reject</button>
    </li>
  ))}
  </ul>
    </> )
}