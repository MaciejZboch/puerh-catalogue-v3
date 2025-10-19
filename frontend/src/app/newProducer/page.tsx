"use client"

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { getNewProducerForm } from "@/lib/api";
import { IProducer } from "@/types/producer";


export default function Vendor() {
  const [producers, setProducers] = useState<IProducer[]>([]);
  const router = useRouter();

  useEffect(() => {
      async function fetchFormData() {
        try {
          const data = await getNewProducerForm();
          setProducers(data.producers || []);
        }
        catch {
          console.error("failed to fetch tea form data");
        }
      }
      fetchFormData();
    }, [])
  
  const schema = yup.object({
    name: yup.string().required("Name is required").min(3).max(20),
  });
  
  
  type TeaFormInputs = yup.InferType<typeof schema>;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeaFormInputs>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
    },
  });
  
    const onSubmit: SubmitHandler<TeaFormInputs> = async (data) => {
    const formData = new FormData();
  
    formData.append("name", data.name);
  
    try {
      const res = await fetch(`http://localhost:4000/api/teas/newProducer`, {
        method: "POST",
              headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Failed to add new tea!");
  
      await res.json();
  
      //redirect to the main page
      router.push(`/`);
    } catch (err) {
      console.error(err);
      alert("Error creating tea. Please try again.");
    }
  };
  
  return  (<div className="min-h-screen flex flex-col bg-dark text-light">
    <div className="max-w-3xl mx-auto px-6 py-10 bg-dark">
      <h1 className="text-3xl font-bold text-light">Add a New Producer</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-charcoal shadow-md rounded-lg p-8"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-light">Name</label>
          <input
            {...register("name")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="text"
            placeholder="e.g. Xiaguan"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  <button
          type="submit"
          className="w-full bg-green-accent text-dark py-2 rounded-md hover:bg-green-soft transition"
        >
          Add Producer
        </button>
        </div>
       </form>
      </div>
     </div>
        )
}