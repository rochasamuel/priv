import { FunctionComponent } from "react";
import { Metadata } from "next";
import BankPage from "@/components/pages/BankPage";

export const metadata: Metadata = {
  title: "Dados Bancários",
};

const BankSettings: FunctionComponent = () => {
  return <BankPage />;
};

export default BankSettings;
