import TeaPageClient from "@/components/TeaPageClient";
import { getTea } from "@/lib/api";

export default async function TeaPage({
  params,
}: {
  params: any;
}) {
  const { id } = await params;
  const data = await getTea(id);
  const tea = data.tea;
  const reviews = data.reviews;

  return (
    <TeaPageClient tea={tea} reviews={reviews} id={id} />
  );
}