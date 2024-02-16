import PaymentsPage from "@/components/pages/PaymentsPage";
import { FunctionComponent } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamentos",
};

const Payments: FunctionComponent = () => {
  return <PaymentsPage />
};

export default Payments;
