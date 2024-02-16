"use client"

import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import CreditCardList from "../CreditCard/CreditCardList";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";

export default function CardsPage() {
	const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Cartões");
	}, [])
	
  return (<div className="w-full">
			<Alert className="mb-4 max-w-xl">
				<Info className="h-4 w-4" />
				<AlertTitle>Atenção!</AlertTitle>
				<AlertDescription>
					O pagamento com cartões está temporáriamente desativado. Por isso, não é possível adicionar novos cartões no momento.
				</AlertDescription>
			</Alert>

			{/* <Button variant={"outline"} className="w-full mb-4">
				Adicionar cartão <PlusCircle className="ml-2" size={18} />
			</Button> */}

			<CreditCardList />
		</div>);
}