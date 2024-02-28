import useBackendClient from "@/hooks/useBackendClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import * as z from "zod";
import { toast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AccountType, Bank, PixKeyType } from "@/types/domain";
import MaskedInput from "../Input/MaskedInput";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Save } from "lucide-react";

export const bankSettingsFormSchema = z.object({
  bankId: z.coerce.number({ required_error: "Campo obrigatório" }),
  accountTypeId: z.coerce.number({ required_error: "Campo obrigatório" }),
  agencyNumber: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O número da agência deve ter no mínino 2 caracteres.",
  }),
  accountNumber: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, {
      message: "O número da conta deve ter no mínimo 4 caracteres.",
    })
    .max(11, {
      message: "O número da conta deve ter no máximo 11 caracteres.",
    }),
  accountDigit: z
    .string({ required_error: "Campo obrigatório" })
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

export default function BankSettingsForm() {
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
      mutationFn: async (values: z.infer<typeof bankSettingsFormSchema>) => {
        return await api.producer.sendBankInformation(values);
      },
      onSuccess: async (data) => {
        toast({
          variant: "default",
          title: "Sucesso!",
          description: "Os seus dados bancários foram atualizados!",
        });
      },
      onError(error: any, variables, context) {
        toast({
          variant: "destructive",
          title: "Ops.",
          description: "Erro ao enviar dados bancários",
        });
      },
    });

  const form = useForm<z.infer<typeof bankSettingsFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(bankSettingsFormSchema),
  });

  function onSubmit(values: z.infer<typeof bankSettingsFormSchema>) {
    sendBankInformation(values);
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
                Salvar <Save className="ml-2" size={18} />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
