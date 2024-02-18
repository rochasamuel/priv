"use client"
import apiClient from "@/backend-sdk";
import { Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import PlanSettingsCard, { PlanSettingsCardSkeleton } from "../Plan/PlanSettingsCard";
import { Alert, AlertDescription } from "../ui/alert";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";

enum PlanType {
  Monthly = "Mensal",
  Yearly = "Anual",
  Semiannual = "Semestral",
  Quarterly = "Trimestral",
}

export default function PlansPage() {
  const { data: session } = useSession();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Meus Planos");
	}, [])

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans", session?.user.userId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);
      return await api.plan.getProducerPlans(session?.user.userId!);
    },
    enabled: !!session?.user.email,
  });

  return (
    <div className="w-full overflow-auto">
      <Alert className="mb-4 max-w-xl">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Ao alterar o valor de um plano existente, todos os seus assinantes que
          possuem esse plano ativo e <b>faltam 10 dias</b> para renovação <b>não terão o
          valor reajustado.</b>
          <br />
          E para aqueles assinantes que faltam <b>mais de 10 dias </b> 
          para renovação <b>serão notificados para aceitarem o novo valor do plano</b>, se o valor for maior que o plano atual.
        </AlertDescription>
      </Alert>
      {!plans ? (
        <PlanSettingsCardSkeleton />
      ) : (
        Object.values(PlanType).map((planType) => {
          const plan = plans?.find((plan) => plan.planType === planType);

          if (plan) {
            return (
              <div className="mb-4" key={plan.planId}>
                <PlanSettingsCard plan={plan} />
              </div>
            );
          }
          return (
            <div className="mb-4" key={planType}>
              <PlanSettingsCard
                plan={{
                  planType,
                  price: 0,
                  finalPrice: 0,
                  discountPercentage: 0,
                  planId: "",
                  producerId: session?.user.userId!,
                  registrationDate: "",
                  isSubscripted: false,
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}