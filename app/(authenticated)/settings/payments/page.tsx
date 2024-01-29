"use client"

import { DataTable } from "@/components/DataTable/Datatable";
import { FunctionComponent } from "react";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import apiClient from "@/backend-sdk";

const Payments: FunctionComponent = () => {
  const { data: session } = useSession();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", session?.user.userId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken);

      return await api.transaction.getTransactionsHistory({ period: 99 })
    },
    enabled: !!session?.user.userId
  })

  return <div className="w-full">
    <div className="text-lg font-bold mb-4">
      Pagamentos
    </div>

    {transactions && <DataTable columns={columns} data={transactions} />}
  </div>;
};

export default Payments;
