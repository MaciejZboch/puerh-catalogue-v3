import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Hero / Intro */}
      <header className="px-6 py-12 bg-gradient-to-r from-blue-50 to-indigo-100 border-b">
        <h1 className="text-4xl font-bold mb-4">Welcome to The Pu-Erh Catalogue</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Discover, rate, and catalog teas from around the world. 
          Join the community and keep track of your favorite teas.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Latest Teas */}
        <section className="col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Latest Teas</h2>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((id) => (
              <div
                key={id}
                className="p-4 bg-white shadow rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold">Tea Name {id}</h3>
                  <p className="text-gray-500">2023 · Yunnan · Sheng Pu’er</p>
                </div>
                <button className="text-blue-600 hover:underline">Rate</button>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar / Charts */}
        <aside>
          <h2 className="text-2xl font-semibold mb-4">Latest Reviews</h2>
          <ul className="space-y-3">
            {[1, 2, 3, 4, 5].map((id) => (
              <li key={id} className="flex justify-between">
                <span>Popular Tea {id}</span>
                <span className="font-bold">⭐ {4.5 - id * 0.2}</span>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 bg-white border-t text-center text-sm text-gray-500">
        © {new Date().getFullYear()} The Pu-Erh Catalogue.
      </footer>
    </div>
  );
}