"use client";

import apiClient from "@/backend-sdk";
import PlanSettingsCard, {
  PlanSettingsCardSkeleton,
} from "@/components/Plan/PlanSettingsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Info, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";

enum PlanType {
  Monthly = "Mensal",
  Yearly = "Anual",
  Semiannual = "Semestral",
  Quarterly = "Trimestral",
}

const PlansSettings: FunctionComponent = () => {
  const { data: session } = useSession();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans", session?.user.userId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);
      return await api.plan.getProducerPlans(session?.user.userId!);
    },
    enabled: !!session?.user.email,
  });

  return (
    <div className="w-full">
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
};

export default PlansSettings;
