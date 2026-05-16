import { createAdminClient } from "@/lib/supabase/admin";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const admin = createAdminClient();

  const [{ data: categories }, { data: brands }, { data: objectives }] = await Promise.all([
    admin.from("categories").select("id, name").order("name"),
    admin.from("brands").select("id, name").order("name"),
    admin.from("objectives").select("id, name").order("name"),
  ]);

  return (
    <ProductForm
      categories={categories ?? []}
      brands={brands ?? []}
      objectives={objectives ?? []}
    />
  );
}
