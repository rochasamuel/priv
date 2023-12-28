import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import CreditCardView, { CreditCardSkeleton } from "./CreditCardView";
import { CreditCard, CreditCardFlag } from "@/types/credit-card";

const mock: CreditCard[] = [
	{
		brand: CreditCardFlag.AmericanExpress,
		cardId: "1",
		expiryMonth: "12",
		expiryYear: "2025",
		holderName: "John Doe",
		lastDigits: "1234",
	},
	{
		brand: CreditCardFlag.DinersClub,
		cardId: "2",
		expiryMonth: "11",
		expiryYear: "2024",
		holderName: "Jane Doe",
		lastDigits: "5678",
	},
	{
		brand: CreditCardFlag.Elo,
		cardId: "3",
		expiryMonth: "10",
		expiryYear: "2023",
		holderName: "Bob Johnson",
		lastDigits: "9012",
	},
	{
		brand: CreditCardFlag.HiperCard,
		cardId: "4",
		expiryMonth: "09",
		expiryYear: "2022",
		holderName: "Alice Johnson",
		lastDigits: "3456",
	},
	{
		brand: CreditCardFlag.MasterCard,
		cardId: "5",
		expiryMonth: "08",
		expiryYear: "2021",
		holderName: "Charlie Smith",
		lastDigits: "7890",
	},
	{
		brand: CreditCardFlag.Visa,
		cardId: "6",
		expiryMonth: "07",
		expiryYear: "2020",
		holderName: "David Smith",
		lastDigits: "2345",
	},
];

const CreditCardList: FunctionComponent = () => {
	const { data: session } = useSession();

	const { data: creditCards, isLoading } = useQuery({
		queryKey: "creditCards",
		queryFn: () => {
			const api = apiClient(session?.user.accessToken);
			return api.creditCard.getCreditCards();
		},
		enabled: !!session?.user.accessToken,
	});

	return (
		<div className="w-full flex flex-col gap-4 flex-wrap sm:flex-row">
			{creditCards?.map((creditCard) => (
				<CreditCardView
					key={creditCard.cardId}
					creditCardData={creditCard}
				/>
			))}
			{isLoading && [1, 2, 3].map((_) => <CreditCardSkeleton />)}
		</div>
	);
};

export default CreditCardList;
