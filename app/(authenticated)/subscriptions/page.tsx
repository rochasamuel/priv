import SubscriptionsPage from "@/components/pages/SubscriptionsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assinaturas",
};

export default function Subscriptions() {
	return <SubscriptionsPage />;
}
