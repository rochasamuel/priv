"use client"
import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import AccountForm, { AccountFormSkeleton } from "../Account/AccountForm";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";

export default function AccountPage() {
  const { data: session } = useSession();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Meu Perfil");
	}, [])

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", session?.user?.userId],
    enabled: !!session?.user?.userId,
    queryFn: async () => {
      const api = apiClient(session?.user?.accessToken);

      return await api.account.getUserAccountData();
    },
  });

  return ( <div className="w-full">
    <div className="text-lg font-bold mb-4">
      Informações da conta
    </div>
    {user ? <AccountForm user={user} /> : <AccountFormSkeleton />}
  </div> );
}