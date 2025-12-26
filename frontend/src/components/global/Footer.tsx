import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-6 bg-dark text-center text-sm text-ash">
      <span>© {new Date().getFullYear()} The Pu-Erh Catalogue</span>
      <span className="mx-2">•</span>
      <Link href="/privacy" className="text-ash">
        Privacy Policy
      </Link>
    </footer>
  );
}
