"use server";

import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase.from("categories").insert([{ name, slug: toSlug(name) }]);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}

// ── BRANDS ──────────────────────────────────────
export async function createBrand(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase.from("brands").insert([{ name, slug: toSlug(name) }]);
  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  await supabase.from("brands").delete().eq("id", id);
  revalidatePath("/admin/brands");
}

// ── OBJECTIVES ──────────────────────────────────
export async function createObjective(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase.from("objectives").insert([{ name, slug: toSlug(name) }]);
  if (error) return { error: error.message };
  revalidatePath("/admin/objectives");
}

export async function deleteObjective(id: string) {
  const supabase = await createClient();
  await supabase.from("objectives").delete().eq("id", id);
  revalidatePath("/admin/objectives");
}
