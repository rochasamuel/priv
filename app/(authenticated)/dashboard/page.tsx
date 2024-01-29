import Balance from "@/components/Dashboard/Balance";
import Charts from "@/components/Dashboard/Charts";
import StatementTable from "@/components/Dashboard/Statement/StatementTable";

export default function Dashboard() {
	return <div className="w-full">
		<div className="text-lg font-bold">Dashboard</div>
		<Balance />
		<Charts />
		<StatementTable	/>
	</div>;
}
