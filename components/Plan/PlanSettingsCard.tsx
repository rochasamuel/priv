import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useBackendClient from "@/hooks/useBackendClient";
import { Plan } from "@/types/plan";
import { toCurrency } from "@/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as z from "zod";
import MoneyInput from "../Input/MoneyInput";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";

interface PlanSettingsCardProps {
  plan: Plan;
}

export interface PlanSettingsPayload {
  insertList: {
    planTypeId: number;
    price: number;
    discountPercentage: number;
  }[];
  deleteList: string[];
  formValues?: any;
}

const PlanSettingsCard: FunctionComponent<PlanSettingsCardProps> = ({
  plan,
}) => {
  const { api, readyToFetch } = useBackendClient();
  const { toast } = useToast();

  const planTypeId: { [key: string]: number } = {
    Mensal: 1,
    Trimestral: 2,
    Semestral: 3,
    Anual: 4,
  };

  const { mutate, isLoading: isSendindRequest } = useMutation({
    mutationFn: async (payload: PlanSettingsPayload) => {
      const result = await api.plan.savePlans(payload);
      form.reset(payload.formValues);
      return result;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "As configurações do plano foram atualizadas",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Houve um erro ao atualizar as configurações do plano",
      });
    },
  });

  const planSchema = z.object({
    activePlan: z.boolean(),
    planType: z.string(),
    shouldUseDiscount: z.boolean().optional(),
    discountPercentage: z
      .union([
        z
          .number()
          .int()
          .min(0, "O desconto deve ser maior que 0")
          .max(50, "O desconto não pode ultrapassar 50%"),
        z.nan(),
      ])
      .optional(),
    price: z.number().min(20, "O preço mínimo é de R$20,00"),
    finalPrice: z.number().optional(),
  });

  const form = useForm<z.infer<typeof planSchema>>({
    mode: "onChange",
    resolver: zodResolver(planSchema),
    defaultValues: {
      activePlan: !!plan?.planId,
      planType: plan?.planType,
      discountPercentage: plan?.discountPercentage ?? "",
      shouldUseDiscount: (plan?.discountPercentage ?? 0) > 0,
      price: plan?.price,
      finalPrice: plan?.finalPrice,
    },
  });

  const watchShouldUseDiscount = form.watch("shouldUseDiscount");
  const watchActivePlan = form.watch("activePlan");

  const watchPrice = form.watch("price");
  const watchDiscountPercentage = form.watch("discountPercentage");

  function onSubmit(values: z.infer<typeof planSchema>) {
    const payload: PlanSettingsPayload = {
      insertList: [],
      deleteList: [],
    };

    if (values.activePlan) {
      if (watchPrice <= 0) return;
      payload.insertList.push({
        planTypeId: planTypeId[values.planType],
        price: values.price,
        discountPercentage: values.discountPercentage ?? 0,
      });
    } else {
      if (!plan.planId) return;
      payload.deleteList.push(plan.planId);
    }

    payload.formValues = values;

    mutate(payload);
  }

  const handleSwitchChange = (value: boolean) => {
    if (value === false) {
      form.setValue("activePlan", value, { shouldDirty: false });
      onSubmit(form.getValues());
      return;
    }

    form.setValue("activePlan", value, { shouldDirty: true });
    onSubmit(form.getValues());
  };

  const isEmpty = (value: string | null | undefined | number) => {
    if (typeof value === "number") return false;
    return value == null || value.trim() === "";
  };

  return (
    <div className="border w-full rounded-md p-4 sm:w-96">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <h1 className="font-extrabold">Plano {plan?.planType}</h1>
            {plan.planType === "Mensal" && (
              <div className="text-[10px]">ATIVO</div>
            )}
            {plan.planType !== "Mensal" && (
              <div className="flex items-center gap-2">
                {" "}
                <div className="text-[10px]">
                  {watchActivePlan ? "ATIVO" : "INATIVO"}
                </div>
                <FormField
                  control={form.control}
                  name="activePlan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={handleSwitchChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          {plan.planType === "Mensal" && (
            <div className="text-xs opacity-70 italic">O plano Mensal é obrigatório, por isso não é possível desativá-lo</div>
          )}
          {watchActivePlan && (
            <>
              <MoneyInput
                form={form}
                label="Preço"
                name="price"
                placeholder="Preço do plano"
              />

              <FormField
                control={form.control}
                name="shouldUseDiscount"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Incluir desconto</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchShouldUseDiscount && (
                <>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Desconto"
                            {...form.register("discountPercentage", {
                              valueAsNumber: !isEmpty(field.value),
                            })}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="finalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço com desconto</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            value={toCurrency(
                              watchPrice -
                                watchPrice * (watchDiscountPercentage! / 100)
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </>
          )}
          {form.formState.isDirty && watchActivePlan && (
            <Button type="submit" className="w-full">
              {isSendindRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde
                </>
              ) : (
                <>
                  Salvar alterações
                  <Save className="ml-2" size={18} />
                </>
              )}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export const PlanSettingsCardSkeleton = () => {
  return (
    <div className="border w-full rounded-md p-4 sm:w-96">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-extrabold">
          <Skeleton className="w-20 h-8" />
        </h1>
        <Skeleton className="w-9 h-4" />
      </div>
      <div className="flex flex-col space-y-4">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-1/2 h-6" />
      </div>
    </div>
  );
};

export default PlanSettingsCard;
