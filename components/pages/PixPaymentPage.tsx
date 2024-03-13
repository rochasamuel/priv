"use client";

import { useMenuStore } from "@/store/useMenuStore";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  Copy,
  Loader2,
  QrCode,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "react-query";
import apiClient from "@/backend-sdk";
import { toast } from "../ui/use-toast";
import { toCurrency } from "@/utils/currency";
import { BillingType, PaymentPayload, PaymentResponse } from "@/types/payment";
import Image from "next/image";
import { DateTime, Duration } from "luxon";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import useBackendClient from "@/hooks/useBackendClient";
import QRCode from "qrcode";
import MaskedInput from "../Input/MaskedInput";
import { isValidCpf } from "@/utils/cpf";
import { isValidNumber } from "@/utils/phone";

export default function PixPaymentPage() {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const searchParams = useSearchParams();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);
  const [qrCodeData, setQrCodeData] = useState<{
    qrCode: string;
    expiration: string;
    url: string;
  }>();
  const [confirmedPayment, setConfirmedPayment] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [codeExpired, setCodeExpired] = useState(false);

  const planId = searchParams.get("planId");
  const producerId = searchParams.get("producerId");

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans", producerId],
    queryFn: async () => {
      return await api.plan.getProducerPlans(producerId!);
    },
    enabled: !!producerId && readyToFetch,
  });

  const { mutate: generateQrCode, isLoading: loadingQrCode } = useMutation({
    mutationFn: async (payload: PaymentPayload) => {
      const api = apiClient(session?.user.accessToken!);
      const result = await api.payment.sign(payload);
      return result;
    },
    onSuccess: async (data: PaymentResponse) => {
      const url = await QRCode.toDataURL(data.pix.qrCode);
      setQrCodeData({ ...data.pix, url });
      setSeconds(
        DateTime.fromISO(data.pix.expiration).diff(DateTime.now()).as("seconds")
      );
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: error.response.data.message,
      });
    },
  });

  const selectedPlan = useMemo(() => {
    return plans?.find((plan) => plan.planId === planId);
  }, [plans, planId]);

  const formSchema = z.object({
    name: z
      .string()
      .min(4, "O nome deve ter no mínimo 4 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),
    cpfCnpj: z.string().refine((cpf: string) => {
      return isValidCpf(cpf);
    }, "O CPF informado é inválido."),
    phoneNumber: z
      .string()
      .min(10, "O telefone deve ter no mínimo 10 dígitos")
      .refine((phone: string) => {
        return isValidNumber(phone);
      }, "O telefone informado é inválido."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    generateQrCode({
      billingType: BillingType.PIX,
      paymentData: {
        ...values,
      },
      productId: planId!,
    });
  }

  const handleClipboardCopy = async () => {
    await navigator.clipboard.writeText(qrCodeData?.qrCode!);
    toast({
      title: "Link copiado!",
      description: "O código PIX foi copiado para sua área de transferência.",
    });
  };

  useEffect(() => {
    setPageTitle("Pagamento PIX");
  }, []);

  useEffect(() => {
    if (!qrCodeData) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setCodeExpired(true);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, qrCodeData, codeExpired]);

  return (
    <div className="w-full overflowy-auto">
      <div className="text-lg font-bold mb-8 hidden lg:block">
        Pagamento PIX
      </div>

      {!confirmedPayment && (
        <div className="flex flex-wrap gap-6">
          <div className="flex justify-center flex-col items-center m-auto">
            <div className="border rounded-sm w-72 min-w-dvw aspect-square flex justify-center items-center p-2 text-center m-auto">
              {!qrCodeData && !loadingQrCode && (
                <div className="w-full h-full flex justify-center items-center bg-[#181818]">
                  <img
                    src="/privatus-mask.svg"
                    alt="QR Code"
                    className="w-32 h-full object-contain"
                  />
                </div>
              )}
              {!qrCodeData && loadingQrCode && (
                <div className="w-full h-full flex justify-center items-center bg-[#181818]">
                  <div className="opacity-50 flex gap-2 items-center justify-center">
                    Carregando dados{" "}
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              {qrCodeData && (
                <Image
                  className="w-full"
                  width={400}
                  height={400}
                  src={qrCodeData.url}
                  alt="QR Code"
                />
              )}
            </div>
            {qrCodeData && (
              <Button
                onClick={handleClipboardCopy}
                className="w-max p-4 mt-4"
                size={"icon"}
                variant={"outline"}
              >
                Copiar código <Copy className="ml-2" size={16} />
              </Button>
            )}
            <div className="border p-4 rounded-sm mt-4 w-max">
              <div className="font-normal">
                Você está assinando:{" "}
                <span className="font-bold">
                  Plano {selectedPlan?.planType}
                </span>
              </div>
              <div>
                {(selectedPlan?.discountPercentage ?? 0) > 0 ? (
                  <div className="flex items-end gap-1">
                    <div className="opacity-50">
                      De{" "}
                      <span className="line-through">
                        {toCurrency(selectedPlan?.price)}
                      </span>
                    </div>
                    <span>
                      por{" "}
                      <span className="text-lg font-bold">
                        {toCurrency(selectedPlan?.finalPrice)}
                      </span>
                    </span>
                  </div>
                ) : (
                  <span>
                    por{" "}
                    <span className="text-lg font-bold">
                      {toCurrency(selectedPlan?.price)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 lg:mr-8">
            {!qrCodeData ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpfCnpj"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>CPF *</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="999.999.999-99"
                            placeholder="Ex: 999.999.999-99"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <MaskedInput
                            {...field}
                            mask="(99) 9 9999-9999"
                            placeholder="Ex: (99) 9 9999-9999"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full" type="submit">
                    {loadingQrCode ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        Aguarde
                      </>
                    ) : (
                      <>
                        Gerar QR Code <QrCode size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="w-full">
                {!codeExpired && (
                  <div className="font-bold text-lg mb-4">
                    Seu código expira em:{" "}
                    {Duration.fromMillis(seconds * 1000).toFormat("mm:ss")}
                  </div>
                )}
                {codeExpired && (
                  <Alert className="mb-4" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Seu QR Code expirou!</AlertTitle>
                    <AlertDescription>
                      Caso já tenha efetuado o pagamento, aperte o botão{" "}
                      <strong>{`"Já fiz o
                    meu pagamento"`}</strong>
                      . Caso contrátrio, refaça o processo de assinatura.
                    </AlertDescription>
                  </Alert>
                )}

                <ul className="list-inside list-decimal">
                  <li className="mb-2">
                    Abra seu aplicativo da sua instituição financeira.
                  </li>
                  <li className="mb-2">
                    Faça um PIX lendo o QR Code ou clique em copiar e cole para
                    fazer pagamento.
                  </li>
                  <li className="mb-2">
                    Após o pagamento você receberá por e-mail os dados de acesso
                    à sua compra.
                  </li>
                </ul>
                <Button
                  className="w-full mt-2"
                  type="button"
                  onClick={() => setConfirmedPayment(true)}
                >
                  Já fiz meu pagamento <Check className="ml-2" size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmedPayment && <ConfirmationComponent />}
    </div>
  );
}

const ConfirmationComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-4">
      <div className="w-24 h-24 bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 rounded-full flex items-center justify-center">
        <CheckCircle className="h-12 w-12" />
      </div>
      <div className="font-bold text-xl text-center mt-4">
        Pedido realizado com sucesso. Obrigada!
      </div>
      <div className="text-center mt-2">
        Seu pagamento está sendo processado e você receberá um e-mail de
        confirmação que será enviado para <strong>{session?.user.email}</strong>{" "}
        com todos os detalhes do seu pedido. Caso não encontre o e-mail,
        verifique sua caixa de spam.
      </div>

      <Button
        className="mt-8 w-max"
        type="button"
        onClick={() => router.back()}
      >
        Voltar de onde parei <ArrowLeft className="ml-2" size={16} />
      </Button>
    </div>
  );
};
