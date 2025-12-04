"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import Image from "next/image";
import { ITea } from "@/types/tea";
import { IPopulatedReview } from "@/types/review";
import { IUser } from "@/types/user";
import ReviewSection from "./ReviewSection";
import EditTeaButton from "./EditTeaButton";
import DeleteTeaButton from "./DeleteTeaButton";

export default function TeaPageClient({
  tea,
  reviews,
  id,
  average,
  numberOfRatings
}: {
  tea: ITea;
  reviews: IPopulatedReview[];
  id: string;
  average: number;
  numberOfRatings: number;
}) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        setCurrentUser(currentUser);
      } catch {
        setCurrentUser(null);
      }
    })();
  }, []);

  const isOwner = currentUser && tea.owners.includes(currentUser._id);
  const isMod = currentUser?.moderator === true;

  return (
<main className="flex-1 w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-dark text-light">
  {/* Left column – tea card */}
  <div className="lg:col-span-1 bg-charcoal rounded-xl border border-green-accent/40 p-6 flex flex-col items-center shadow-md">

  {/* Tea Image */}
  <div className="w-full flex justify-center">
    <Image
      src={
        tea.images?.[1]?.url ||
        "https://res.cloudinary.com/dlem22ukx/image/upload/w_500,ar_1:1,c_fill,g_auto/v1734459128/chinese-pu-erh-tea-with-two-cups-and-pot_xemcbr.jpg"
      }
      alt={`${tea.name} cake`}
      width={400}
      height={400}
      className="rounded-2xl w-full max-w-[340px] shadow-lg"
      sizes="(max-width: 768px) 90vw, 340px"
    />
  </div>

  {/* Title + Producer */}
  <div className="mt-6 text-center space-y-1">
    <h1 className="text-3xl font-bold tracking-tight">
      {tea.year} {tea.name}
    </h1>

    <p className="text-lg text-mist">
      {tea.producer ? tea.producer.name : tea.vendor.name}
    </p>

    <p className="text-sm text-gray-400">
      Vendor: {tea.vendor.name}
    </p>
  </div>

  {/* Divider */}
  <div className="w-full h-px bg-green-accent/30 my-6" />
  {/* Rating */}
  <div className="text-center">
    <p className="text-4xl font-extrabold text-green-accent">
      {average ? average.toFixed(2) : "0.00"}
    </p>
    <p className="text-sm text-gray-400">
      from {numberOfRatings ? numberOfRatings : 0} ratings
    </p>
  </div>
</div>


      {/* Right column */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Tea info</h3>

          {currentUser && (isOwner || isMod) && (
            <div className="flex gap-2">
              <EditTeaButton teaId={id} userId={currentUser._id} />
              <DeleteTeaButton teaId={id} />
            </div>
          )}
        </div>

        {/* Tea details */}
        <ul className="space-y-1">
          {tea.region && (
            <li>
              <span className="text-mist">Region:</span> {tea.region}
            </li>
          )}
          {tea.village && (
            <li>
              <span className="text-mist">Village:</span> {tea.village}
            </li>
          )}
          {tea.ageing_location && (
            <li>
              <span className="text-mist">Ageing location:</span>{" "}
              {tea.ageing_location}
            </li>
          )}
          {tea.ageing_conditions && (
            <li>
              <span className="text-mist">Ageing conditions:</span>{" "}
              {tea.ageing_conditions}
            </li>
          )}
          {tea.sizeInGrams && (
            <li>
              <span className="text-mist">Size in grams:</span>{" "}
              {tea.sizeInGrams}
            </li>
          )}
          {tea.price && (
            <li>
              <span className="text-mist">Last known price:</span> $
              {tea.price}
            </li>
          )}
          {tea.price && tea.sizeInGrams && (
            <li>
              <span className="text-mist">Price per gram:</span>{" "}
              {tea.pricePerGram} USD / gram
            </li>
          )}
        </ul>

        <section>
          <p className="text-mist">
            {tea.description || "This tea has no description yet."}
          </p>
        </section>

        <ReviewSection teaId={id} reviews={reviews} currentUser={currentUser} />
      </div>
    </main>
  );
}
