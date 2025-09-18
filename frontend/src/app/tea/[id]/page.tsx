import Image from "next/image";
import { getTea } from "@/lib/api";

export default async function TeaPage({ params }: { params: { id: string } }) {
  const data = await getTea(params.id);
  const tea = data.tea;
  const reviews = data.reviews;
console.log(tea)
  const tea2 = {
    id: "1",
    name: "7542",
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
      {/* Left Column */}
      <div className="lg:col-span-1 flex flex-col items-center">
        <Image
          src={tea.images && tea.images.url ? tea.images[1].url : "https://res.cloudinary.com/dlem22ukx/image/upload/w_500,ar_1:1,c_fill,g_auto/v1734459128/chinese-pu-erh-tea-with-two-cups-and-pot_xemcbr.jpg"}
          alt={`${tea.name} cake`}
          width={400}
          height={400}
          className="rounded-2xl shadow-md"
        />
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold">{tea.year} {tea.name}</h1>
          <h2 className="text-lg text-gray-600">{tea.producer ? tea.producer.name : tea.vendor.name}</h2>
          <p className="mt-1 text-sm text-gray-500">Vendor: {tea.vendor.name}</p>
        </div>

        <div className="mt-6 w-full bg-gray-50 rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold">{tea.rating? tea.rating.toFixed(2) : 0}</p>
          <p className="text-sm text-gray-500">
            from 2137 ratings
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
        <h3>Write a review</h3>
        <form action="">
            <textarea className="w-full mb-3 p-2 border-b border-green-accent rounded-md bg-dark"
            rows={3}
            placeholder="Short notes about this tea..." name="" id=""></textarea>
        </form>
        </section>


        <section>
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review: any, i: any) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.user.username}</span>
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
