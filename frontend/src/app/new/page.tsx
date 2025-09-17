"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getNewTeaForm } from "@/lib/api";
import { useEffect, useState } from "react";


export default function New() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [producers, setProducers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFormData() {
      try {
        const data = await getNewTeaForm();
        setVendors(data.vendors || []);
        setProducers(data.producers || []);
      }
      catch {
        console.error("failed to fetch tea form data");
      }
    }
    fetchFormData();
  }, [])

const currentYear = new Date().getFullYear();

const schema = yup.object({
  name: yup.string().required("Name is required").min(3).max(20),
  type: yup.string().required("Type is required"),
  year: yup
    .number()
    .notRequired()
    .typeError("Year must be a number")
    .min(1900, "Year cannot be earlier than 1900")
    .max(currentYear, `Year cannot be later than ${currentYear}`)
    .integer(),
  vendor: yup.string().required("Vendor is required"),
  producer: yup.string().required("Producer is required"),
  region: yup.string().min(3).max(20).notRequired().nullable().transform((v) => (v === "" ? null : v)),
  village: yup.string().min(3).max(20).notRequired().nullable().transform((v) => (v === "" ? null : v)),
  ageing_location: yup.string().min(3).max(20).notRequired().nullable().transform((v) => (v === "" ? null : v)),
  ageing_conditions: yup.string().notRequired().nullable().transform((v) => (v === "" ? null : v)),
  description: yup.string().min(3).max(200).notRequired().nullable().transform((v) => (v === "" ? null : v)),
  shape: yup.string().required("Shape is required"),
  images: yup
    .mixed<FileList>()
    .test("fileType", "Only image files are allowed", (files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      );
    })
    .notRequired(),
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
    type: "Raw / Sheng",
    vendor: vendors[0]?.name || "",
    producer: producers[0]?.name || "Unknown",
    ageing_conditions: "Unknown",
    shape: "Cake",
  },
});

  const onSubmit: SubmitHandler<TeaFormInputs> = async (data) => {
    const formData = new FormData();
    
formData.append("name", data.name);
formData.append("type", data.type);

if (data.year) {
  formData.append("year", String(data.year));
}

formData.append("vendor", data.vendor);
formData.append("producer", data.producer);

if (data.region) {
  formData.append("region", data.region);
}

if (data.village) {
  formData.append("village", data.village);
}

if (data.ageing_location) {
  formData.append("ageing_location", data.ageing_location);
}

if (data.ageing_conditions) {
  formData.append("ageing_conditions", data.ageing_conditions);
}

if (data.description) {
  formData.append("description", data.description);
}

if (data.shape) {
  formData.append("shape", data.shape);
}


  // Add files
  if (data.images && data.images.length > 0) {
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });
  }
    const res = await fetch(`http://localhost:4000/api/teas/`, { method: "POST", body: formData, credentials: "include"});
    if (!res.ok) {throw new Error("Failed to add new tea!");}
  return res.json();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">
    <div className="max-w-3xl mx-auto px-6 py-10 bg-dark">
      <h1 className="text-3xl font-bold text-light">Add a New Tea</h1>

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
            placeholder="e.g. Yiwu Gushu"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-light">Type</label>
          <select
            {...register("type")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          >
            <option value="Raw / Sheng">Raw / Sheng</option>
            <option value="Ripe / Shou">Ripe / Shou</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-light">Year</label>
          <input
            {...register("year")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="number"
            placeholder="e.g. 2020"
          />
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-light">Vendor</label>
          <select
            {...register("vendor")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          >
            {vendors.map((vendor: any) => (
              <option key={vendor._id} value={vendor.name}>
                {vendor.name}
              </option>
            ))}
          </select>
          {errors.vendor && <p className="text-red-500 text-sm mt-1">{errors.vendor.message}</p>}
        </div>

        {/* Producer */}
        <div>
          <label className="block text-sm font-medium text-light">Producer</label>
          <select
            {...register("producer")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
          >
            {producers.map((producer: any) => (
              <option key={producer.name} value={producer.name}>
                {producer.name}
              </option>
            ))}
          </select>
          {errors.producer && <p className="text-red-500 text-sm mt-1">{errors.producer.message}</p>}
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-light">Region</label>
          <input
            {...register("region")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="text"
            placeholder="e.g. Yunnan"
          />
          {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-medium text-light">Village</label>
          <input
            {...register("village")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="text"
            placeholder="e.g. Lao Banzhang"
          />
          {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>}
        </div>

        {/* Ageing Location */}
        <div>
          <label className="block text-sm font-medium text-light">Ageing Location</label>
          <input
            {...register("ageing_location")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="text"
            placeholder="e.g. Hong Kong"
          />
          {errors.ageing_location && (
            <p className="text-red-500 text-sm mt-1">{errors.ageing_location.message}</p>
          )}
        </div>

        {/* Ageing Conditions */}
        <div>
          <label className="block text-sm font-medium text-light">Ageing Conditions</label>
          <input
            {...register("ageing_conditions")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="text"
            placeholder="e.g. Dry storage"
          />
          {errors.ageing_conditions && (
            <p className="text-red-500 text-sm mt-1">{errors.ageing_conditions.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-light">Description</label>
          <textarea
            {...register("description")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            rows={3}
            placeholder="Short notes about this tea..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Shape */}
        <div>
          <label className="block text-sm font-medium text-light">Shape</label>
          <input
            {...register("shape")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="text"
            placeholder="e.g. Cake"
          />
          {errors.shape && <p className="text-red-500 text-sm mt-1">{errors.shape.message}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-light">Images</label>
          <input
            {...register("images")}
            className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            type="file"
            multiple
          />
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-accent text-dark py-2 rounded-md hover:bg-green-soft transition"
        >
          Add Tea
        </button>
      </form>
    </div>
    </div>
  );
}