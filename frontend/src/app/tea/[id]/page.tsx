import Image from "next/image";
import { getTea } from "@/lib/api";
import { cookies } from "next/headers";
import ReviewSection from "@/components/ReviewSection";
import EditTeaButton from "@/components/EditTeaButton";
import DeleteTeaButton from "@/components/DeleteTeaButton";
import { getCurrentUser } from "@/lib/api";

export default async function TeaPage({
  params,
}: {
  params: any;
}) {
  const resolvedParams = await params; // works in dev + production
  const { id } = resolvedParams;

  const data = await getTea(id);
  const tea = data.tea;
  const reviews = data.reviews;

  const currentUser = await getCurrentUser();
  return (
    <main className="max-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-dark text-light">
      
      {/* Left Column - tea card */}
      <div className="pb-3 lg:col-span-1 max-h-145 flex flex-col items-center bg-charcoal rounded-md border-b border-green-accent">
<Image
  src={
    tea.images?.[1]?.url ||
    "https://res.cloudinary.com/dlem22ukx/image/upload/w_500,ar_1:1,c_fill,g_auto/v1734459128/chinese-pu-erh-tea-with-two-cups-and-pot_xemcbr.jpg"
  }
  alt={`${tea.name} cake`}
  width={400}
  height={400}
  className="rounded-2xl shadow-md"
/>
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold">{tea.year} {tea.name}</h1>
          <h2 className="text-lg text-mist">{tea.producer ? tea.producer.name : tea.vendor.name}</h2>
          <p className="mt-1 text-sm text-mist">Vendor: {tea.vendor.name}</p>
        </div>

        <div className="mt-6 w-full rounded-xl text-center">
          <p className="text-3xl font-bold">{tea.rating? tea.rating.toFixed(2) : 0}</p>
          <p className="text-sm text-gray-500">
            from 2137 ratings
          </p>
        </div>
      </div>

      {/* Center Column: Tasting Notes + Description + Reviews */}
      <div className="lg:col-span-2 space-y-8">
<h3 className="inline text-xl font-semibold mb-4">Tea info</h3>
  {currentUser && tea.owners.includes(currentUser._id) || currentUser  && currentUser.moderator === true && <><EditTeaButton teaId={params.id} userId={currentUser._id}/> <DeleteTeaButton teaId={params.id}/></>}
  

<ul>
  {(tea.region) ? <li><span className="text-mist">Region:</span> {tea.region}</li> : null}
  {(tea.village) ? <li><span className="text-mist">Village:</span> {tea.village}</li> : null}
  {(tea.ageing_location) ? <li><span className="text-mist">Ageing location:</span> {tea.ageing_location}</li> : null}
  {(tea.ageing_conditions) ? <li><span className="text-mist">Ageing conditions:</span> {tea.ageing_conditions}</li> : null}
  {(tea.sizeInGrams) ? <li><span className="text-mist">Size in grams:</span> {tea.sizeInGrams}</li> : null}
  {(tea.price) ? <li><span className="text-mist">Last known price:</span> {tea.price} USD</li> : null}
  {(tea.price && tea.sizeInGrams) ? <li><span className="text-mist">Price per gram:</span> {tea.pricePerGram} USD / gram</li> : null}
</ul>

        <section>
          <p className="text-mist">{tea.description ? tea.description : "This tea has no description yet."}</p>
        </section>

<ReviewSection teaId={params.id} reviews={reviews} currentUser={currentUser}/>
      </div>
    </main>
  );
}
