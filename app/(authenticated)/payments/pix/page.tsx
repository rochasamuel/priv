import PixPaymentPage from "@/components/pages/PixPaymentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamento PIX",
};

export default function PixComponent() {
  return <PixPaymentPage />
}