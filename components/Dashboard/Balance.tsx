"use client";

import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { FunctionComponent, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { DateTime } from "luxon";
import { Button } from "../ui/button";
import {
  Banknote,
  DollarSign,
  Eye,
  EyeOff,
  FileSignature,
  HandCoins,
  Info,
  Loader2,
  Lock,
  Save,
} from "lucide-react";
import { toCurrency } from "@/utils/currency";
import useBackendClient from "@/hooks/useBackendClient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import MoneyInput from "../Input/MoneyInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";

const Balance: FunctionComponent = () => {
  const [shouldHideMoney, setShouldHideMoney] = useState(false);
  const { api, readyToFetch } = useBackendClient();

  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const { data: session } = useSession();

  const { data: producerData } = useQuery({
    queryKey: ["producerData", session?.user?.userId],
    queryFn: async () => {
      const activeSubscribersCount =
        await api.producer.getProducerActiveSubscribersCount();
      const balance = await api.producer.getProducerBalance();

      return {
        activeSubscribersCount,
        ...balance,
      };
    },
    enabled: readyToFetch,
  });

  const handleCloseWithdrawDialog = () => {
    setOpenWithdrawDialog(false);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 gap-3">
      <div className="text-xs">
        {DateTime.now().toFormat("dd 'de' LLL 'de' yyyy | HH:mm", {
          locale: "pt-br",
        })}
      </div>
      <Button className="" onClick={() => setOpenWithdrawDialog(true)}>
        Sacar saldo desbloqueado
      </Button>
      {openWithdrawDialog && (
        <WithdrawDialog
          handleCloseWithdrawDialog={handleCloseWithdrawDialog}
          producerData={producerData}
        />
      )}
      <div className="w-min flex flex-col md:flex-row md:justify-center gap-3 mx-auto">
        <div className="w-64 md:w-auto flex border rounded-sm p-3 gap-5">
          <div className="my-auto items-center min-w-[20px]">
            <FileSignature size={20} />
          </div>
          <div className="w-full self-start items-start whitespace-nowrap">
            <p className="font-bold">Assinaturas ativas</p>
            <p className="">
              {producerData?.activeSubscribersCount ?? (
                <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
              )}
            </p>
          </div>
        </div>

        <div className="w-64 md:w-auto flex border rounded-sm p-3 gap-5">
          <div className="my-auto items-center min-w-[20px]">
            <Lock size={20} />
          </div>
          <div className="w-full self-start items-start whitespace-nowrap">
            <div className="flex items-center gap-2 font-bold">
              Saldo bloqueado {/* <Info size={14} />*/}
            </div>
            <div className="flex items-center gap-2">
              {producerData ? (
                <>
                  {!shouldHideMoney ? (
                    toCurrency(producerData?.lockedBalance)
                  ) : (
                    <div className="w-28 h-5 bg-gray-500 rounded-sm" />
                  )}
                </>
              ) : (
                <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
              )}
              <Button
                className="p-1 h-min"
                onClick={() => setShouldHideMoney(!shouldHideMoney)}
                variant={"ghost"}
              >
                {shouldHideMoney ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-64 md:w-auto flex border rounded-sm p-3 gap-5">
          <div className="my-auto items-center min-w-[20px]">
            <Banknote size={20} />
          </div>
          <div className="w-full self-start items-start whitespace-nowrap">
            <div className="flex items-center gap-2 font-bold">
              Saldo desbloqueado {/* <Info size={14} /> */}
            </div>
            <div className="flex items-center gap-2">
              {producerData ? (
                <>
                  {!shouldHideMoney ? (
                    toCurrency(producerData?.unlockedBalance)
                  ) : (
                    <div className="w-28 h-5 bg-gray-500 rounded-sm" />
                  )}
                </>
              ) : (
                <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
              )}
              <Button
                className="p-1 h-min"
                onClick={() => setShouldHideMoney(!shouldHideMoney)}
                variant={"ghost"}
              >
                {shouldHideMoney ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const withdrawSchema = z.object({
  value: z
    .number({ required_error: "É necessário definir um valor de saque" })
    .min(10, "O valor mínimo é de R$10,00"),
  finalValue: z.number().optional(),
});
interface WithdrawDialogProps {
  handleCloseWithdrawDialog: () => void;
  producerData: any;
}

const WithdrawDialog: FunctionComponent<WithdrawDialogProps> = ({
  handleCloseWithdrawDialog,
  producerData,
}) => {
  const [shouldHideMoney, setShouldHideMoney] = useState(false);
  const { api } = useBackendClient();

  const { mutate: requestWithdraw, isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof withdrawSchema>) => {
      const response = await api.producer.requestWithdraw(data.value);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Saque solicitado",
        description: "Seu saque foi solicitado com sucesso",
      });
      handleCloseWithdrawDialog();
    },
    onError(error: any, variables, context) {
      toast({
        variant: "destructive",
        title: "Ops.",
        description: error.response.data.message,
      });
    },
  })

  const form = useForm<z.infer<typeof withdrawSchema>>({
    mode: "onChange",
    resolver: zodResolver(withdrawSchema),
  });

  function onSubmit(values: z.infer<typeof withdrawSchema>) {
    requestWithdraw(values);
  }

  const watchPrice = form.watch("value");

  const calculatePriceWithTax = (
    initialPrice: number,
    withdrawalTaxPercentage: number
  ): number => {
    const withdrawalTaxRate = withdrawalTaxPercentage / 100;
    const withdrawalTax = initialPrice * withdrawalTaxRate;
    const priceWithTax = initialPrice - withdrawalTax;
    return priceWithTax;
  };

  return (
    <Dialog defaultOpen onOpenChange={handleCloseWithdrawDialog}>
      <DialogContent className="max-w-screen-md h-full flex flex-col px-4 md:max-w-[50vw] md:h-auto md:max-h-[90dvh] lg:max-w-[45vw]">
        <DialogHeader>
          <DialogTitle>Realizar saque</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full flex flex-col justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="w-64 mx-auto flex border rounded-sm p-3 gap-5">
                <div className="my-auto items-center min-w-[20px]">
                  <Banknote size={20} />
                </div>
                <div className="w-full self-start items-start whitespace-nowrap">
                  <div className="flex items-center gap-2 font-bold">
                    Saldo disponível {/* <Info size={14} /> */}
                  </div>
                  <div className="flex items-center gap-2">
                    {producerData ? (
                      <>
                        {!shouldHideMoney ? (
                          toCurrency(producerData?.unlockedBalance)
                        ) : (
                          <div className="w-28 h-5 bg-gray-500 rounded-sm" />
                        )}
                      </>
                    ) : (
                      <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
                    )}
                    <Button
                      className="p-1 h-min"
                      onClick={() => setShouldHideMoney(!shouldHideMoney)}
                      variant={"ghost"}
                    >
                      {shouldHideMoney ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full text-center">
                Taxa de saque:{" "}
                <span className="font-bold">
                  {producerData?.currentWithdrawTax ?? 0}%
                </span>
              </div>

              <div className="text-sm text-center mt-4">
                Para realizar um saque é mecessário preencher o valor desejado
                no campo abaixo:
              </div>

              <MoneyInput
                form={form}
                label="Valor a retirar"
                name="value"
                placeholder="R$ 0,00"
              />

              <FormField
                control={form.control}
                name="finalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor a receber</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        value={toCurrency(
                          calculatePriceWithTax(
                            watchPrice,
                            producerData?.currentWithdrawTax ?? 0
                          )
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isLoading} type="submit" className="w-full md:mt-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde
                </>
              ) : (
                <>
                  Solicitar saque
                  <HandCoins className="ml-2" size={18} />
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Balance;
