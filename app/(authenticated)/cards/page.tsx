import CardsPage from "@/components/pages/CardsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartões",
};

export default function Cards() {
  return <CardsPage />;
}
