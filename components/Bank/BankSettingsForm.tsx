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
import { AccountType, Bank, PixKeyType, PixKeyTypeId } from "@/types/domain";
import MaskedInput from "../Input/MaskedInput";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Save } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import { isValidCNPJ, isValidCpf } from "@/utils/cpf";
import { isValidNumber } from "@/utils/phone";

const isValidEmail = (value: string) =>
  z.string().email().safeParse(value).success;

export const bankSettingsFormSchema = z
  .object({
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
      .transform((value) => value.replaceAll('-', ""))
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pixKey) {
      if (data.pixKeyTypeId === PixKeyTypeId.CPFCNPJ) {
        if (data.pixKey.length < 12) {
          if (!isValidCpf(data.pixKey)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "CPF inválido",
              path: ["pixKey"],
            });
            return false;
          }
        } else if (data.pixKey.length > 11) {
          console.log(data.pixKey)
          if (!isValidCNPJ(data.pixKey)) {
            console.log( 'invalido')
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "CNPJ inválido",
              path: ["pixKey"],
            });
            return false;
          }
        }
      }

      if (data.pixKeyTypeId === PixKeyTypeId.Email) {
        if (!isValidEmail(data.pixKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email inválido",
            path: ["pixKey"],
          });
          return false;
        }
      }

      if (data.pixKeyTypeId === PixKeyTypeId.Celular) {
        if (!isValidNumber(data.pixKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Telefone inválido",
            path: ["pixKey"],
          });
          return false;
        }
      }

      if (data.pixKeyTypeId === PixKeyTypeId.ChaveAleatoria) {
        const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
        if (!regex.test(data.pixKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A chave aleatória está incorreta.",
            path: ["pixKey"],
          });
          return false;
        }
      }
    }

    return true;
  });

export default function BankSettingsForm() {
  const { api, readyToFetch } = useBackendClient();
  const [currentPixMask, setCurrentPixMask] = useState<string | string[]>("");

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

  const maskForPix = (pixType: string) => {
    if (Number(pixType) === 1) {
      return setCurrentPixMask(["999.999.999-99", "99.999.999/9999-99"]);
    }
    if (Number(pixType) === 2) {
      return setCurrentPixMask(
        "*{1,50}[.*{1,50}][.*{1,50}][+*{1,40}]@*{1,50}[.*{1,100}][.*{1,3}][.*{1,2}]"
      );
    }
    if (Number(pixType) === 3) {
      return setCurrentPixMask("(99) 9 9999-9999");
    }

    return setCurrentPixMask("*{8}-*{4}-*{4}-*{12}");
  };

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
            disabled={!bankDomains}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Banco</FormLabel>
                <ComboBoxResponsive form={form} list={bankDomains?.banks!} />
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
                <Select onValueChange={field.onChange}>
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

          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem className="space-y-1 col-span-2">
                  <FormLabel>Número</FormLabel>
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
                    <MaskedInput
                      id="accountDigit"
                      type="text"
                      mask="9"
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
              <Select
                onValueChange={(event) => {
                  maskForPix(event);
                  field.onChange(event);
                }}
              >
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
                <MaskedInput
                  mask={currentPixMask}
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

export function ComboBoxResponsive({
  list,
  form,
}: {
  field?: any;
  list: any[];
  form?: any;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const handleSelectBank = (bank: Bank | null) => {
    setSelectedBank(bank);
    if (bank) {
      form.setValue("bankId", bank.bankId);
    }
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              disabled={!list}
              variant="outline"
              type="button"
              className="w-full justify-start"
            >
              <div className="w-full text-left text-nowrap text-ellipsis overflow-hidden">
                {list ? (
                  selectedBank ? (
                    selectedBank.bankName
                  ) : (
                    "Selecione"
                  )
                ) : (
                  <div className="opacity-70 flex items-center italic">
                    Buscando bancos{" "}
                    <Loader2 className="ml-2 size-4 animate-spin" />
                  </div>
                )}
              </div>
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <BankList
            setOpen={setOpen}
            banks={list}
            setSelectedBank={handleSelectBank}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <FormControl>
          <Button
            disabled={!list}
            variant="outline"
            type="button"
            className="w-full justify-start"
          >
            <div className="w-full text-left text-nowrap text-ellipsis overflow-hidden">
              {list ? (
                selectedBank ? (
                  selectedBank.bankName
                ) : (
                  "Selecione"
                )
              ) : (
                <div className="opacity-70 flex items-center italic">
                  Buscando bancos{" "}
                  <Loader2 className="ml-2 size-4 animate-spin" />
                </div>
              )}
            </div>
          </Button>
        </FormControl>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <BankList
            setOpen={setOpen}
            banks={list}
            setSelectedBank={handleSelectBank}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function BankList({
  setOpen,
  setSelectedBank,
  banks,
}: {
  setOpen: (open: boolean) => void;
  setSelectedBank: (status: Bank | null) => void;
  banks: Bank[];
}) {
  return (
    <Command>
      <CommandInput placeholder="Selecionar banco" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {banks.map((bank) => (
            <CommandItem
              key={bank.bankName}
              value={bank.bankName}
              onSelect={(value) => {
                setSelectedBank(
                  banks.find((bank) => bank.bankName.toLowerCase() === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {bank.bankName}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
