import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CartProvider } from "@/context/CartContext";
import { FloatingCart } from "@/components/store/FloatingCart";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCart />
      </div>
    </CartProvider>
  );
}
