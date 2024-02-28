"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight, ChevronLeft, Loader2, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import MaskedInput from "../Input/MaskedInput";
import { isValidNumber } from "@/utils/phone";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery } from "react-query";
import { toast } from "../ui/use-toast";
import useBackendClient from "@/hooks/useBackendClient";
import { AccountType, Bank, PixKeyType } from "@/types/domain";

export default function ProducerBankDetails() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Card className="w-full lg:w-1/3 max-w-[90dvw] backdrop-blur bg-black/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Button
            className="px-0 w-8 h-8"
            variant={"ghost"}
            onClick={handleBack}
          >
            <ChevronLeft />
          </Button>{" "}
          Criar sua conta de produtor(a)
        </CardTitle>
        <div>
          <div className="text-lg text-secondary mt-4 font-medium">
            Dados bancários (opcional)
          </div>
          <div className="w-full flex gap-7 mt-2">
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProducerBankForm />
      </CardContent>
    </Card>
  );
}

export const producerBankDetailFormSchema = z.object({
  bankId: z.coerce.number({ required_error: "Campo obrigatório" }).optional(),
  accountTypeId: z.coerce.number({ required_error: "Campo obrigatório" }).optional(),
  agencyNumber: z.coerce
    .number({ required_error: "Campo obrigatório" })
    .min(2, {
      message: "O número da agência deve ter no mínino 2 caracteres.",
    })
    .optional(),
  accountNumber: z.coerce
    .string({ required_error: "Campo obrigatório" })
    .min(4, {
      message: "O número da conta deve ter no mínimo 4 caracteres.",
    })
    .max(11, {
      message: "O número da conta deve ter no máximo 11 caracteres.",
    })
    .optional(),
  accountDigit: z.string({ required_error: "Campo obrigatório" })
    .length(1, { message: "O dígito da conta deve ter somente 1 caractere." })
    .optional(),
  pixKeyTypeId: z.coerce
    .number({ required_error: "Campo obrigatório" })
    .optional(),
  pixKey: z
    .string()
    .min(9, {
      message: "A chave PIX deve ter pelo menos 9 dígitos.",
    })
    .optional(),
});

export const ProducerBankForm = () => {
  const router = useRouter();
  const { api, readyToFetch } = useBackendClient();

  const { data: bankDomains } = useQuery({
    queryKey: "bankDomains",
    queryFn: async () => {
      return await api.misc.getBankDomains();
    },
    enabled: readyToFetch,
  });

  const { mutate: sendBankInformation, isLoading: bankRequestLoading } =
    useMutation({
      mutationFn: async (
        values: z.infer<typeof producerBankDetailFormSchema>
      ) => {
        return await api.producer.sendBankInformation(values);
      },
      onSuccess: async (data) => {
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Os seus dados bancários foram atualizados!",
        });

        router.push("/auth/register/producer/confirmation");
      },
      onError(error: any, variables, context) {
        toast({
          variant: "destructive",
          title: "Ops.",
          description: "Erro ao enviar dados bancários",
        });
      },
    });

  const form = useForm<z.infer<typeof producerBankDetailFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(producerBankDetailFormSchema),
  });

  function onSubmit(values: z.infer<typeof producerBankDetailFormSchema>) {
    if (form.formState.isDirty) {
      sendBankInformation(values);
    } else {
      router.push("/auth/register/producer/confirmation");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="bankId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Banco</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="space-y-0">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankDomains?.banks.map((bank: Bank) => (
                      <SelectItem
                        key={bank.bankCode}
                        value={bank.bankId.toString()}
                      >
                        [{bank.bankCode}] {bank.bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountTypeId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Tipo de conta</FormLabel>
                <Select
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="space-y-0">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankDomains?.accountTypes.map(
                      (accountType: AccountType) => (
                        <SelectItem
                          key={accountType.accountTypeName}
                          value={accountType.accountTypeId.toString()}
                        >
                          {accountType.accountTypeName}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="agencyNumber"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Agência</FormLabel>
                <FormControl>
                  <MaskedInput
                    id="agencyNumber"
                    mask="9999"
                    placeholder="0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Número da conta</FormLabel>
                  <FormControl>
                    <Input id="accountNumber" placeholder="000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountDigit"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Dígito</FormLabel>
                  <FormControl>
                    <Input
                      id="accountDigit"
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="pixKeyTypeId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Tipo de chave PIX</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="space-y-0">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bankDomains?.pixKeyTypes.map((pixKey: PixKeyType) => (
                    <SelectItem
                      key={pixKey.pixKeyTypeId}
                      value={pixKey.pixKeyTypeId.toString()}
                    >
                      {pixKey.pixKeyTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pixKey"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Chave PIX</FormLabel>
              <FormControl>
                <Input
                  id="pixKey"
                  placeholder="Digite a chave PIX"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            disabled={bankRequestLoading}
            className="w-full mt-4"
            type="submit"
          >
            {bankRequestLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Aguarde
              </>
            ) : (
              <div className="flex items-center justify-center">
                Avançar <ArrowRight className="ml-2" size={18} />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
