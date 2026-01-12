import { getAllTeasForSitemap } from "@/lib/api";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const teas: { _id: string; updatedAt?: string }[] =
    await getAllTeasForSitemap();

  // Map teas to sitemap URLs
  const teaUrls = teas.map((tea) => ({
    url: `${FRONTEND_URL}/tea/${tea._id}`,
    lastModified: tea.updatedAt ? new Date(tea.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${FRONTEND_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...teaUrls,
  ];
}
