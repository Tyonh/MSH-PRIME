import { redirect } from "next/navigation";

// /admin → redireciona para o painel de produtos
export default function AdminRootPage() {
  redirect("/admin/products");
}
