import ConsumerRegister from "@/components/Register/ConsumerRegister";
import OTPVerify from "@/components/Register/OTPVerify";
import RecoverPasswordPage from "@/components/pages/RecoverPasswordPage";
import { Metadata } from "next";
import { useSearchParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Recuperação de senha",
};

const RecoverPassword = () => {
  return <RecoverPasswordPage />;
};

export default RecoverPassword;
