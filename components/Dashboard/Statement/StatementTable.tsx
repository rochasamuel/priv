"use client"

import apiClient from "@/backend-sdk";
import { DataTable } from "@/components/DataTable/Datatable";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { columns } from "./columns";

const StatementTable: FunctionComponent = () => {
  const { data: session } = useSession();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["user-transactions", session?.user.userId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken);

      return await api.metrics.getTransactionHistory(15)
    },
    enabled: !!session?.user.userId
  })

  return <div className="w-full mt-10">
    <div className="text-lg font-bold mb-4">
      Extrato Detalhado
    </div>

    {transactions && <DataTable columns={columns} data={transactions} />}
  </div>;
}
 
export default StatementTable;