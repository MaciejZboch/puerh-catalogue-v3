import ScrollIndicator from "@/components/ScrollIndicator";
import Image from "next/image";
import Link from "next/link";


export default function LandingHero() {
return (
<section className="relative w-full h-[calc(100vh-73.3333px)] bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(104,171,124,1)_0%,rgba(32,34,65,1)_82%,rgba(29,37,41,1)_100%,rgba(0,212,255,1)_100%)] text-white flex items-center justify-center px-8">
{/* Decorative shapes (optional, simplified) */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
<div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
<div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
</div>


<div className="relative max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
{/* Left Content */}
<div className="space-y-6">
<h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
The Pu-Erh <br /> Catalogue
</h1>


<p className="text-lg text-purple-200 max-w-md">
The best place to rate, review, search and see last known prices of Pu-Erh tea.
</p>


<Link href="/register" className="nohover bg-cyan-800 hover:bg-cyan-600 transition-all text-white font-semibold px-6 py-3 rounded-full shadow-lg">
Start steeping!
</Link>
</div>


{/* Right Illustration */}
<div className="flex justify-center">
<Image
src="/images/abstract_tea.png"
alt="Pu-erh Illustration"
width={380}
height={380}
className="drop-shadow-2xl"
/>
</div>
</div>


{/* Scroll indicator */}
<ScrollIndicator/>
</section>
);
}