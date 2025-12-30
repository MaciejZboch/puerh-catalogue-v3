"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { IVendor } from "@/types/vendor";
import { getNewVendorForm } from "@/lib/api";

export default function NewVendor() {
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchFormData() {
      try {
        const data = await getNewVendorForm();
        setVendors(data.vendors || []);
      } catch {
        console.error("failed to fetch tea form data");
      }
    }
    fetchFormData();
  }, []);

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
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${API_URL}/api/teas/newVendor`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to add new tea!");

      //redirect to the main page
      router.push(`/`);
    } catch (err) {
      console.error(err);
      alert("Error creating tea. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">
      <div className="max-w-3xl mx-auto px-6 py-10 bg-dark">
        <h1 className="text-3xl font-bold text-light">Add a New Vendor</h1>

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
              placeholder="e.g. white2tea"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-accent text-dark py-2 rounded-md"
            >
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
