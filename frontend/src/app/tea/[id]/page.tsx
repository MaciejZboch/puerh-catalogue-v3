import TeaPageClient from "@/components/tea/TeaPageClient";
import { getTea } from "@/lib/api";
import type { Metadata } from "next";
import { cache } from "react";

//cache fetch to use one fetch both in metadata and page
const getTeaCached = cache(getTea);

type Props = {
  params: { id: string };
};

//dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getTeaCached(params.id);

  if (!data?.tea) {
    return {
      title: "Tea not found",
      description: "This pu-erh tea could not be found.",
    };
  }

  const tea = data.tea;

  return {
    title: `${tea.name}${tea.year ? ` (${tea.year})` : ""}`,
    description:
      tea.description?.slice(0, 155) ??
      "Detailed information, reviews, and ratings for this pu-erh tea.",
  };
}

export default async function TeaPage({ params }: Props) {
  const data = await getTeaCached(params.id);
  const { tea, reviews, numberOfRatings, average } = data;

  return (
    <TeaPageClient
      tea={tea}
      reviews={reviews}
      id={params.id}
      average={average}
      numberOfRatings={numberOfRatings}
    />
  );
}
