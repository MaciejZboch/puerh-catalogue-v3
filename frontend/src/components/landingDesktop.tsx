import ScrollIndicator from "@/components/ScrollIndicator";
import Image from "next/image";
import Link from "next/link";


export default function LandingHero() {
return (
<section className="pb-40 relative w-full min-h-[calc(100vh-73.3333px)] bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(104,171,124,1)_0%,rgba(32,34,65,1)_82%,rgba(29,37,41,1)_100%,rgba(0,212,255,1)_100%)] text-white ">
  <div className="flex items-center justify-center px-8 h-full">
{/* Decorative shapes (optional, simplified) */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
<div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
<div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
</div>


<div className="relative max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center
translate-y-32">
{/* Left Content */}
<div className="space-y-6">
<h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
The Pu-Erh <br /> Catalogue
</h1>


<p className="text-lg text-purple-200 max-w-md">
The best place to rate, review, search and see last known prices of Pu-Erh tea.
</p>


<Link href="/register" className="nohover bg-orange-500 hover:bg-orange-muted transition-all text-white font-semibold px-6 py-3 rounded-full shadow-lg">
Start steeping!
</Link>
</div>


{/* Right Illustration */}
<div className="flex justify-center">
<Image
src="/images/teapot_transparent.png"
alt="Pu-erh Illustration"
width={380}
height={380}
className="drop-shadow-2xl"
/>
</div>
</div>


{/* Scroll indicator */}
<div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 z-30">
  <ScrollIndicator />
</div>


{/* Wave divider */}
<div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
  <svg
    className="block w-full h-[160px]"
    viewBox="0 0 1200 160"
    preserveAspectRatio="none"
  >
    <path
      d="
        M0,70

        C200,70 260,90 360,120
        C460,150 520,160 600,160
        C680,160 740,150 840,120
        C940,90 1000,70 1200,70

        V160
        H0
        Z
      "
      fill="#1D2529"
    />
  </svg>
</div>


</div>
</section>
);
}