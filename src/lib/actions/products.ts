"use server";

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

// Helper para garantir bucket existe e fazer upload de múltiplas imagens
const uploadImages = async (admin: ReturnType<typeof createAdminClient>, productId: string, formData: FormData) => {
  const files = formData.getAll("images") as File[];
  const validFiles = files.filter(f => f && f.size > 0);
  if (validFiles.length === 0) return;

  // Garante bucket
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.find(b => b.name === "images")) {
    await admin.storage.createBucket("images", { public: true });
  }

  // Conta quantas imagens já existem para definir display_order
  const { count } = await admin
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);
  let order = count ?? 0;

  for (const file of validFiles) {
    const ext = file.name.split(".").pop();
    const path = `products/${productId}-${Date.now()}-${order}.${ext}`;

    const { error: uploadErr } = await admin.storage.from("images").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (!uploadErr) {
      const { data: { publicUrl } } = admin.storage.from("images").getPublicUrl(path);
      await admin.from("product_images").insert([{
        product_id: productId,
        image_url: publicUrl,
        display_order: order,
      }]);
      order++;
    } else {
      console.error(`❌ Erro no upload da imagem ${file.name}:`, uploadErr.message);
    }
  }
};

// ── CREATE ──────────────────────────────────────
export async function createProduct(formData: FormData) {
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const slug = `${toSlug(name)}-${Date.now()}`;
  const objectiveId = formData.get("objective_id") as string | null;

  const { data: product, error } = await admin
    .from("products")
    .insert([buildProductPayload(formData, slug)])
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return { error: `Falha no banco: ${error.message}` };
  }

  // Upload de múltiplas imagens
  await uploadImages(admin, product.id, formData);

  // Objetivo
  if (objectiveId) {
    await admin.from("product_objectives").insert([{ product_id: product.id, objective_id: objectiveId }]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ── UPDATE ──────────────────────────────────────
export async function updateProduct(id: string, formData: FormData) {
  const admin = createAdminClient();
  const objectiveId = formData.get("objective_id") as string | null;

  const { error } = await admin
    .from("products")
    .update(buildProductPayload(formData))
    .eq("id", id);

  if (error) {
    console.error(error);
    return { error: `Falha ao atualizar: ${error.message}` };
  }

  // Upload de novas imagens (se enviadas)
  await uploadImages(admin, id, formData);

  // Atualiza objetivo
  await admin.from("product_objectives").delete().eq("product_id", id);
  if (objectiveId) {
    await admin.from("product_objectives").insert([{ product_id: id, objective_id: objectiveId }]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductImage(productId: string, imageUrl: string) {
  const admin = createAdminClient();

  // 1. Remove do banco
  const { error: dbError } = await admin
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .eq("image_url", imageUrl);

  if (dbError) {
    console.error("❌ Erro ao remover imagem do banco:", dbError.message);
    return { error: "Erro ao remover do banco de dados" };
  }

  // 2. Tenta extrair o path do Storage para remover o arquivo físico
  // Exemplo: .../storage/v1/object/public/images/products/xyz.jpg -> products/xyz.jpg
  try {
    const urlParts = imageUrl.split("/images/");
    if (urlParts.length > 1) {
      const storagePath = urlParts[1];
      const { error: storageError } = await admin.storage.from("images").remove([storagePath]);
      if (storageError) console.warn("⚠️ Falha ao remover arquivo do Storage:", storageError.message);
    }
  } catch (e) {
    console.warn("⚠️ Não foi possível determinar o path do storage para deletar arquivo físico.");
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/produtos");
  return { success: true };
}

// ── TOGGLE / DELETE ─────────────────────────────
export async function toggleVisibility(id: string, currentValue: boolean) {
  const admin = createAdminClient();
  await admin.from("products").update({ is_visible: !currentValue }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, currentValue: boolean) {
  const admin = createAdminClient();
  await admin.from("products").update({ is_featured: !currentValue }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  const admin = createAdminClient();
  await admin.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
}
