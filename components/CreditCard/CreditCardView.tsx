import { CreditCard, CreditCardFlag } from "@/types/credit-card";
import { Space_Mono } from "next/font/google";
import { FunctionComponent, useState } from "react";
import { cardLayoutConfig } from "@/utils/credit-card";
import { Loader2, Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import apiClient from "@/backend-sdk";
import { useMutation } from "react-query";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

interface CreditCardProps {
	creditCardData: CreditCard;
}

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

const getCardColor = (flag: CreditCardFlag): string => {
	switch (flag) {
		case CreditCardFlag.AmericanExpress:
			return "bg-gradient-to-r from-fuchsia-600 to-pink-600";
		case CreditCardFlag.DinersClub:
			return "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 text-black";
		case CreditCardFlag.HiperCard:
			return "bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900";
		case CreditCardFlag.Visa:
			return "bg-gradient-to-r from-gray-100 to-gray-300 text-black";
		case CreditCardFlag.Unknown:
			return "bg-gradient-to-r from-red-500 to-pink-500";
		case CreditCardFlag.Elo:
			return "bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-500 to-blue-600 text-white";
		case CreditCardFlag.MasterCard:
			return "bg-gradient-to-r from-violet-300 to-violet-400 text-black";
		default:
			return "bg-gradient-to-r from-red-500 to-pink-500";
	}
};

const CreditCardView: FunctionComponent<CreditCardProps> = ({
	creditCardData,
}) => {
	const { toast } = useToast();
	const { data: session } = useSession();
	const [openDialog, setOpenDialog] = useState(false);

	const { mutate: deleteCreditCard, isLoading } = useMutation({
		mutationFn: async () => {
			const api = apiClient(session?.user.accessToken!);
			const result = await api.creditCard.deleteCreditCard(
				creditCardData.cardId,
			);

			return result;
		},
		onSuccess: () => {
			setOpenDialog(false);
			toast({
				title: "Cartão excluído com sucesso",
			});
		},
		onError: () => {
			setOpenDialog(false);
			toast({
				variant: "destructive",
				title: "Erro ao excluir cartão",
				description: "Tente novamente mais tarde",
			});
		},
	});

	return (
		<div
			className={`${
				spaceMono.className
			} w-full md:w-80 h-48 rounded-sm border ${getCardColor(
				creditCardData.brand,
			)}`}
		>
			<div className="w-full h-full flex flex-col justify-between items-center p-4">
				<div className="w-full flex items-start justify-between">
					<img
						src={cardLayoutConfig[creditCardData.brand].iconSrc}
						alt="me"
						className="w-16 object-contain"
					/>
					<AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
						<AlertDialogTrigger asChild>
							<Trash size={18} className="cursor-pointer" />
						</AlertDialogTrigger>
						<AlertDialogContent className="max-w-[96vw] lg:max-w-lg">
							<AlertDialogHeader>
								<AlertDialogTitle>Tem certeza?</AlertDialogTitle>
								<AlertDialogDescription>
									Ao remover seu cartão de crédito com final{" "}
									{creditCardData.lastDigits} não será possível mais utilizá-lo
									para nenhum pagamento na plataforma.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<Button onClick={() => deleteCreditCard()}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Aguarde
										</>
									) : (
										<>Tenho certeza</>
									)}
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				<div className="w-full text-2xl font-semibold">
					**** **** **** {creditCardData.lastDigits}
				</div>
				<div className="w-full flex items-center justify-between">
					<div className="text-lg font-normal">{creditCardData.holderName}</div>
					<div className="text-lg font-normal">
						{creditCardData.expiryMonth}/{creditCardData.expiryYear}
					</div>
				</div>
			</div>{" "}
		</div>
	);
};

export const CreditCardSkeleton: FunctionComponent = () => {
	return (
		<div className={"w-full md:w-80 h-48 rounded-sm border"}>
			<div className="w-full h-full flex flex-col justify-between items-center p-4">
				<div className="w-full flex items-start justify-between">
					<Skeleton className="w-20 h-10" />
					<Skeleton className="w-6 h-6" />
				</div>
				<Skeleton className="w-full h-10" />
				<div className="w-full flex items-center justify-between">
					<Skeleton className="w-40 h-8" />
					<Skeleton className="w-10 h-7" />
				</div>
			</div>{" "}
		</div>
	);
};

export default CreditCardView;
