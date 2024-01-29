"use client"

import apiClient from "@/backend-sdk";
import AccountForm, { AccountFormSkeleton } from "@/components/Account/AccountForm";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";

const Acount: FunctionComponent = () => {
  const { data: session } = useSession();

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
 
export default Acount;