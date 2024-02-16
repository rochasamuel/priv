"use client"
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";
import Balance from "../Dashboard/Balance";
import Charts from "../Dashboard/Charts";
import StatementTable from "../Dashboard/Statement/StatementTable";

export default function DashboardPage() {
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Dashboard");
	}, [])
  
  return <div className="w-full">
    <div className="text-lg font-bold hidden lg:block">Dashboard</div>
    <Balance />
    <Charts />
    <StatementTable />
  </div>;
}