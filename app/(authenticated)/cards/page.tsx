"use client";

import CreditCardList from "@/components/CreditCard/CreditCardList";
import { Button } from "@/components/ui/button";
import { getCreditCardFlag } from "@/utils/credit-card";
import { Info, PlusCircle } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Cards() {
	return (
		<div className="w-full">
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
		</div>
	);
}
