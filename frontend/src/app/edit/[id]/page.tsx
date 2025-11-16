"use client"

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getEditTeaForm } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ITea } from "@/types/tea";
import { IVendor } from "@/types/vendor";
import { IProducer } from "@/types/producer";


export default function Edit() {

  const params = useParams();
  const teaId = params?.id as string;
  const searchParams = useSearchParams()
  const userId = searchParams.get("user")
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [producers, setProducers] = useState<IProducer[]>([]);
  const router = useRouter();

  const emptyTea: ITea = {
  _id: "",
  name: "",
  description: "",
  images: [],
  type: "Raw / Sheng",
  year: new Date().getFullYear(),
  region: "",
  village: "",
  ageing_location: "",
  ageing_conditions: "Dry",
  shape: "Cake",
  producer: null,
  vendor: null,
  author: "unknown",
  owners: [],
  sizeInGrams: 0,
  price: 0,
  pricePerGram: 0
};

const [t, setT] = useState<ITea>(emptyTea);

  useEffect(() => {
    async function fetchFormData() {
      try {
        const data = await getEditTeaForm(teaId, userId);
        setVendors(data.vendors || []);
        setProducers(data.producers || []);
        reset({
        ...data.t,
        vendor: data.t.vendor?._id || "",   // use id as key and value
        producer: data.t.producer?._id || "",
      });

      }
      catch (err) {
        console.error("failed to fetch tea form data", err);
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
    .integer()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .nullable(),
  vendor: yup.string().required("Vendor is required"),
  producer: yup
  .string()
  .notRequired()
  .nullable()
  .transform((v) => (v === "" ? null : v)),
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
    price: yup.number().notRequired().nullable().transform((curr, orig) => (orig === "" ? null : curr)),
      sizeInGrams: yup.number().notRequired().nullable().transform((curr, orig) => (orig === "" ? null : curr))
});


type TeaFormInputs = yup.InferType<typeof schema>;

const {
  register,
  handleSubmit,
  formState: { errors },
  reset
} = useForm<TeaFormInputs>({
  resolver: yupResolver(schema) as any,
  defaultValues: {
    name: "",
    type: "Raw / Sheng",
    vendor: vendors[0]?.name || "",
    producer: producers[0]?.name || null,
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
if (data.producer) {
  formData.append("producer", data.producer);
}

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

if (data.price) {
  formData.append("price", String(data.price));
}

if (data.sizeInGrams) {
  formData.append("sizeInGrams", String(data.sizeInGrams));
}

  // Add files
  if (data.images && data.images.length > 0) {
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${API_URL}/api/teas/${teaId}`,
      { method: "PUT", body: formData, credentials: "include"});

    if (!res.ok) throw new Error("Failed to add new tea!");
    const data = await res.json();

    //redirect to the edited tea page
    router.push(`/tea/${data.tea._id}`);
  } catch (err) {
    console.error(err);
    alert("Error editing tea. Please try again.");
  }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-dark text-light">
      <div className="max-w-5xl mx-auto px-6 py-10 bg-dark">
        <h1 className="text-center text-3xl font-bold text-light mb-8">Add a New Tea</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 bg-charcoal shadow-md rounded-lg p-8"
        >
          {/* ===== BASIC INFO ===== */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-accent">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Name
                </label>
                <input
                  {...register("name")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                  type="text"
                  placeholder="Loading..."
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Type
                </label>
                <select
                  {...register("type")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                >
                  <option value="Raw / Sheng">Raw / Sheng</option>
                  <option value="Ripe / Shou">Ripe / Shou</option>
                </select>
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Vendor
                </label>
                <select
                  {...register("vendor")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                >
                  <option value="" disabled>
                    -- select an option --
                  </option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Year
                </label>
                <input
                  {...register("year")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                  type="number"
                  placeholder="e.g. 2020"
                  min="1900"
                  max={currentYear}
                />
              </div>
            </div>
          </div>

          {/* ===== ORIGIN & PRODUCTION ===== */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-accent">
              Origin & Production
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Region
                </label>
                <input
                  {...register("region")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                  placeholder="e.g. Yunnan"
                />
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Village
                </label>
                <input
                  {...register("village")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                  placeholder="e.g. Lao Banzhang"
                />
              </div>

              {/* Producer */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Producer
                </label>
                <select
                  {...register("producer")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                >
                  <option value="">Unknown</option>
                  {producers.map((producer) => (
                    <option key={producer._id} value={producer._id}>
                      {producer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ===== AGEING DETAILS ===== */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-accent">
              Ageing Details
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Ageing Location
                </label>
                <input
                  {...register("ageing_location")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                  placeholder="e.g. Hong Kong"
                />
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Ageing Conditions
                </label>
                <select
                  {...register("ageing_conditions")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Dry">Dry</option>
                  <option value="Natural">Natural</option>
                  <option value="Wet">Wet</option>
                  <option value="Hong-Kong Traditional">
                    Hong-Kong Traditional
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== PRICING & WEIGHT ===== */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-accent">
              Pricing & Weight
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Last Known Price (USD)
                </label>
                <input
                  {...register("price")}
                  type="number"
                  placeholder="e.g. 45"
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Weight (grams)
                </label>
                <input
                  {...register("sizeInGrams")}
                  type="number"
                  placeholder="e.g. 400"
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                />
              </div>
            </div>
          </div>

          {/* ===== SHAPE & APPEARANCE ===== */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-accent">
              Shape & Appearance
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Shape */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Shape
                </label>
                <select
                  {...register("shape")}
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                >
                  <option value="Cake">Cake</option>
                  <option value="Loose">Loose</option>
                  <option value="Tuo">Tuo</option>
                  <option value="Brick">Brick</option>
                  <option value="Mushroom">Mushroom</option>
                  <option value="Dragon ball">Dragon ball</option>
                  <option value="Tube">Tube</option>
                  <option value="Melon">Melon</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-light">
                  Images
                </label>
                <input
                  {...register("images")}
                  type="file"
                  multiple
                  className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
                />
              </div>
            </div>
          </div>

          {/* ===== ADDITIONAL NOTES ===== */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-accent">
              Additional Notes
            </h2>
            <textarea
              {...register("description")}
              className="w-full p-2 border-b border-green-accent rounded-md bg-dark"
              rows={3}
              placeholder="Short notes about this tea..."
            />
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