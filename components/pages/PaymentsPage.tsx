"use client"
import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { DataTable } from "../DataTable/Datatable";
import { columns } from "@/app/(authenticated)/settings/payments/columns";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";
import useBackendClient from "@/hooks/useBackendClient";

export default function PaymentsPage() {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Pagamentos");
	}, [])

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", session?.user.userId],
    queryFn: async () => {
      return await api.transaction.getTransactionsHistory({ period: 99 })
    },
    enabled: readyToFetch,
  })

  return <div className="w-full">
    <div className="text-lg font-bold mb-4 hidden lg:block">
      Pagamentos
    </div>

    {transactions && <DataTable columns={columns} data={transactions} />}
  </div>;
} 