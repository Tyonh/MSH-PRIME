"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const toSlug = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// ── HELPERS ─────────────────────────────────────
const parseOptionalFloat = (v: FormDataEntryValue | null) => {
  const n = parseFloat(v as string);
  return isNaN(n) ? null : n;
};

const buildProductPayload = (formData: FormData, slug?: string) => ({
  name:            formData.get("name") as string,
  ...(slug ? { slug } : {}),
  description:     formData.get("description") as string,
  price:           parseFloat(formData.get("price") as string),
  price_pix:       parseOptionalFloat(formData.get("price_pix")),
  price_card:      parseOptionalFloat(formData.get("price_card")),
  discount_label:  (formData.get("discount_label") as string) || null,
  stock_quantity:  parseInt(formData.get("stock") as string),
  category_id:     (formData.get("category_id") as string) || null,
  brand_id:        (formData.get("brand_id") as string) || null,
  is_visible:      formData.get("is_visible") === "on",
  is_featured:     formData.get("is_featured") === "on",
});

// ── CREATE ──────────────────────────────────────
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name      = formData.get("name") as string;
  const slug      = `${toSlug(name)}-${Date.now()}`;
  const imageFile = formData.get("image") as File;
  const objectiveId = formData.get("objective_id") as string | null;

  const { data: product, error } = await supabase
    .from("products")
    .insert([buildProductPayload(formData, slug)])
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return { error: `Falha no banco: ${error.message}` };
  }

  // Upload de imagem — usa service role para bypassar RLS do Storage
  if (imageFile && imageFile.size > 0) {
    const admin = createAdminClient();
    const ext   = imageFile.name.split(".").pop();
    const path  = `products/${product.id}-${Date.now()}.${ext}`;

    // Garante que o bucket 'images' existe
    const { data: buckets } = await admin.storage.listBuckets();
    if (!buckets?.find(b => b.name === 'images')) {
      await admin.storage.createBucket('images', { public: true });
    }

    const { error: uploadErr } = await admin.storage.from("images").upload(path, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

    if (uploadErr) {
      console.error("❌ Erro no upload:", uploadErr.message);
      return { error: `Produto criado, mas falha na imagem: ${uploadErr.message}` };
    }

    const { data: { publicUrl } } = admin.storage.from("images").getPublicUrl(path);
    await admin.from("product_images").insert([{ product_id: product.id, image_url: publicUrl, display_order: 0 }]);
  }

  // Objetivo
  if (objectiveId) {
    await supabase.from("product_objectives").insert([{ product_id: product.id, objective_id: objectiveId }]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ── UPDATE ──────────────────────────────────────
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const imageFile = formData.get("image") as File;
  const objectiveId = formData.get("objective_id") as string | null;

  const { error } = await supabase
    .from("products")
    .update(buildProductPayload(formData))
    .eq("id", id);

  if (error) {
    console.error(error);
    return { error: `Falha ao atualizar: ${error.message}` };
  }

  // Nova imagem (se enviada)
  if (imageFile && imageFile.size > 0) {
    const admin = createAdminClient();
    const ext   = imageFile.name.split(".").pop();
    const path  = `products/${id}-${Date.now()}.${ext}`;
    
    // Garante que o bucket 'images' existe
    const { data: buckets } = await admin.storage.listBuckets();
    if (!buckets?.find(b => b.name === 'images')) {
      await admin.storage.createBucket('images', { public: true });
    }

    const { error: uploadErr } = await admin.storage.from("images").upload(path, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

    if (!uploadErr) {
      const { data: { publicUrl } } = admin.storage.from("images").getPublicUrl(path);
      await admin.from("product_images").insert([{ product_id: id, image_url: publicUrl, display_order: 0 }]);
    } else {
      console.error("❌ Erro no upload (update):", uploadErr.message);
    }
  }

  // Atualiza objetivo (remove antigo e insere novo)
  await supabase.from("product_objectives").delete().eq("product_id", id);
  if (objectiveId) {
    await supabase.from("product_objectives").insert([{ product_id: id, objective_id: objectiveId }]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ── TOGGLE / DELETE ─────────────────────────────
export async function toggleVisibility(id: string, currentValue: boolean) {
  const supabase = await createClient();
  await supabase.from("products").update({ is_visible: !currentValue }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, currentValue: boolean) {
  const supabase = await createClient();
  await supabase.from("products").update({ is_featured: !currentValue }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}
