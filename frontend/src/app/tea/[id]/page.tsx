import Image from "next/image";
import { getTea } from "@/lib/api";

export default async function TeaPage({ params }: { params: { id: string } }) {
  //const tea2 = await getTea(params.id);


  const tea = {
    id: "1",
    name: "2007 Menghai Dayi 7542",
    producer: "Menghai Tea Factory",
    vendor: "Yunnan Sourcing",
    year: 2007,
    region: "Menghai, Yunnan, China",
    type: "Sheng (Raw) Pu-erh",
    cover: "/placeholder-tea.jpg", // replace with your image path
    rating: 4.25,
    ratingsCount: 312,
    description:
      "A classic recipe Sheng Pu-erh from Menghai Tea Factory, known for strong bitterness in youth that transforms into sweet, camphor-like complexity with age.",
    reviews: [
      {
        user: "puerhfan",
        rating: 4.5,
        content:
          "One of the best 7542s I've had. Clean storage, excellent transformation. Strong qi!",
      },
      {
        user: "shenglover",
        rating: 4.0,
        content:
          "Still has some sharp edges, but aging beautifully. Sweet aftertaste lingers.",
      },
    ],
  };

  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Tea Cake + Metadata */}
      <div className="lg:col-span-1 flex flex-col items-center">
        <Image
          src={tea.cover}
          alt={`${tea.name} cake`}
          width={400}
          height={400}
          className="rounded-2xl shadow-md"
        />
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold">{tea.name}</h1>
          <h2 className="text-lg text-gray-600">{tea.producer}</h2>
          <p className="text-sm text-gray-500">{tea.year}</p>
          <p className="mt-2 text-sm text-gray-700">
            {tea.type} • {tea.region}
          </p>
          <p className="mt-1 text-sm text-gray-500">Vendor: {tea.vendor}</p>
        </div>

        <div className="mt-6 w-full bg-gray-50 rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold">{tea.rating.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            from {tea.ratingsCount.toLocaleString()} ratings
          </p>
          <button className="mt-3 w-full bg-green-700 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition">
            Rate This Tea
          </button>
        </div>
      </div>

      {/* Center Column: Tasting Notes + Description + Reviews */}
      <div className="lg:col-span-2 space-y-8">


        <section>
          
          <p className="text-gray-700">{tea.description ? tea.description : "This tea has no description yet."}</p>
        </section>

        <section>
          
          <p className="text-gray-700">Aged in {tea.ageing_conditions ? tea.ageing_conditions : "unspecified"} conditions in {tea.ageing_location ? tea.ageing_location : "an unknown location"}.</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="space-y-4">
            {tea.reviews.map((review, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.user}</span>
                  <span className="text-sm text-gray-500">
                    {review.rating.toFixed(1)} ★
                  </span>
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
