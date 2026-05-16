"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const toSlug = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// ── CATEGORIES ──────────────────────────────────
export async function createCategory(formData: FormData) {
  const admin = createAdminClient();
  const name = formData.get("name") as string;
  if (!name || !name.trim()) return { error: "Nome é obrigatório" };

  const { error } = await admin.from("categories").insert([{ name: name.trim(), slug: toSlug(name) }]);
  if (error) {
    console.error("❌ Erro ao criar categoria:", error.message);
    return { error: error.message };
  }
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const admin = createAdminClient();
  await admin.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}

// ── BRANDS ──────────────────────────────────────
export async function createBrand(formData: FormData) {
  const admin = createAdminClient();
  const name = formData.get("name") as string;
  if (!name || !name.trim()) return { error: "Nome é obrigatório" };

  const { error } = await admin.from("brands").insert([{ name: name.trim(), slug: toSlug(name) }]);
  if (error) {
    console.error("❌ Erro ao criar marca:", error.message);
    return { error: error.message };
  }
  revalidatePath("/admin/brands");
}

export async function deleteBrand(id: string) {
  const admin = createAdminClient();
  await admin.from("brands").delete().eq("id", id);
  revalidatePath("/admin/brands");
}

// ── OBJECTIVES ──────────────────────────────────
export async function createObjective(formData: FormData) {
  const admin = createAdminClient();
  const name = formData.get("name") as string;
  if (!name || !name.trim()) return { error: "Nome é obrigatório" };

  const { error } = await admin.from("objectives").insert([{ name: name.trim(), slug: toSlug(name) }]);
  if (error) {
    console.error("❌ Erro ao criar objetivo:", error.message);
    return { error: error.message };
  }
  revalidatePath("/admin/objectives");
}

export async function deleteObjective(id: string) {
  const admin = createAdminClient();
  await admin.from("objectives").delete().eq("id", id);
  revalidatePath("/admin/objectives");
}
