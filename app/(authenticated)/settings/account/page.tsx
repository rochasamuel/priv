import AccountPage from "@/components/pages/AccountPage";
import { FunctionComponent } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Conta",
};

const Acount: FunctionComponent = () => {
  return <AccountPage />
}
 
export default Acount;