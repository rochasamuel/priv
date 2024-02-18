import { FunctionComponent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import apiClient from "@/backend-sdk";
import { Plan } from "@/types/plan";
import { toCurrency } from "@/utils/currency";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

interface PlansDialogProps {
  user: User;
  closePlansDialog: () => void;
}

const PlansDialog: FunctionComponent<PlansDialogProps> = ({
  user,
  closePlansDialog,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans", user.producerId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.plan.getProducerPlans(user.producerId);
    },
    enabled: !!session?.user.email,
  });

  const handleSubscribe = () => {
    router.push(`/payments/pix?producerId=${user.producerId}&planId=${selectedPlanId}`);
  }

  return (
    <Dialog defaultOpen onOpenChange={closePlansDialog}>
      <DialogContent className="max-w-screen-md h-full flex flex-col px-4 md:max-w-[50vw] md:h-auto md:max-h-[90dvh] lg:max-w-[45vw]">
        <DialogHeader>
          <DialogTitle>Seja um assinante</DialogTitle>
          <p className="text-sm">
            Para ter acesso a conteúdos exclusivos de{" "}
            <span className="font-bold">{user.presentationName}</span> escolha
            um plano:
          </p>
        </DialogHeader>
        <div className="h-full my-4">
          <RadioGroup className="h-full flex flex-col gap-4" onValueChange={(value) => setSelectedPlanId(value)}>
            {isLoading ? <PlansSkeleton /> : plans?.map((plan: Plan) => (
              <div key={plan.planId} className="flex items-center px-3 space-x-2 border w-full rounded-md cursor-pointer">
                <RadioGroupItem value={plan.planId} id={plan.planId} />
                <Label htmlFor={plan.planId} className="w-full h-full py-3">
                  <div className="ml-2 flex flex-col gap-1 w-full cursor-pointer font-medium">
                    <p className="flex items-center gap-2">Plano {plan.planType} {plan.discountPercentage > 0 && <Badge className="h-4 p-2">{plan.discountPercentage}%</Badge>}</p>
                    <p>
                      {plan.discountPercentage > 0 && (
                        <span className="font-light opacity-50 line-through">de {toCurrency(plan.price)}</span>
                      )}
                      <span className="font-light"> por</span>{" "}
                      {toCurrency(plan.finalPrice)}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={handleSubscribe}>Assinar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const PlansSkeleton = () => {
	return (
		<div className="flex gap-3 p-3 border w-full rounded-md cursor-pointer">
			<Skeleton className="w-5 h-5 rounded-full my-auto" />
			<div className="flex flex-col items-start gap-2">
				<Skeleton className="h-5 w-40" />
				<Skeleton className="h-5 w-60" />
			</div>
		</div>
	)
}

export default PlansDialog;
