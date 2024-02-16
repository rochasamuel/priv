import PlansPage from "@/components/pages/PlansPage";
import { FunctionComponent } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos",
};

const PlansSettings: FunctionComponent = () => {
  return <PlansPage />;
};

export default PlansSettings;
