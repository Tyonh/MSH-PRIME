import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: brands }, { data: objectives }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("brands").select("id, name").order("name"),
    supabase.from("objectives").select("id, name").order("name"),
  ]);

  return (
    <ProductForm
      categories={categories ?? []}
      brands={brands ?? []}
      objectives={objectives ?? []}
    />
  );
}
