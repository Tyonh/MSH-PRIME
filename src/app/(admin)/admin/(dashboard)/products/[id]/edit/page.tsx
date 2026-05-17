import { createAdminClient } from "@/lib/supabase/admin";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Busca produto + imagem principal + objetivo atual 1
  const [
    { data: product },
    { data: categories },
    { data: brands },
    { data: objectives },
    { data: productImages },
    { data: productObjectives },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, description, price, price_pix, price_card, discount_label, stock_quantity, is_visible, is_featured, category_id, brand_id")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("brands").select("id, name").order("name"),
    supabase.from("objectives").select("id, name").order("name"),
    supabase.from("product_images").select("image_url, display_order").eq("product_id", id).order("display_order"),
    supabase.from("product_objectives").select("objective_id").eq("product_id", id).limit(1),
  ]);

  if (!product) return notFound();

  const mainImage = productImages?.[0]?.image_url ?? null;
  const currentObjectiveId = productObjectives?.[0]?.objective_id ?? null;

  return (
    <ProductForm
      categories={categories ?? []}
      brands={brands ?? []}
      objectives={objectives ?? []}
      product={{
        id:                    product.id,
        name:                  product.name,
        description:           product.description,
        price:                 product.price,
        price_pix:             product.price_pix,
        price_card:            product.price_card,
        discount_label:        product.discount_label,
        stock_quantity:        product.stock_quantity,
        is_visible:            product.is_visible,
        is_featured:           product.is_featured,
        category_id:           product.category_id,
        brand_id:              product.brand_id,
        current_image_url:     mainImage,
        current_objective_id:  currentObjectiveId,
        images:                productImages ?? [],
      }}
    />
  );
}
