import PrivateHotAreaPage from "@/components/pages/PrivateHotAreaPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Área HOT",
};

export default function HotArea() {
  return <PrivateHotAreaPage />
}
