"use client";

import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";
import BankSettingsForm from "../Bank/BankSettingsForm";

export default function BankPage() {
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

  useEffect(() => {
		setPageTitle("Novos dados bancários");
	}, [])

  return <div className="w-full">
    <div className="hidden text-lg font-bold lg:block mb-4">Novos dados bancários</div>
    <BankSettingsForm />
  </div>;
}
