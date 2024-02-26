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
import { ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import MaskedInput from "../Input/MaskedInput";
import { isValidNumber } from "@/utils/phone";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import useBackendClient from "@/hooks/useBackendClient";
import { toast } from "../ui/use-toast";

export default function ProducerAddress() {
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
          <div className="text-lg text-secondary mt-4 font-medium">Endereço</div>
          <div className="w-full flex gap-7 mt-2">
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300 opacity-50" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300 opacity-50" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300 opacity-50" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProducerAddressForm />
      </CardContent>
    </Card>
  );
}

export const producerAddressFormSchema = z.object({
  addressZipcode: z.string({ required_error: "Campo obrigatório" }).length(8, {
    message: "O CEP deve ter 8 caracteres.",
  }),
  addressCity: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "A cidade deve ter no mínimo 2 caracteres.",
  }),
  addressUf: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O estado deve ter no mínino 2 caracteres.",
  }),
  address: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O endereço deve ter no mínimo 2 caracteres.",
  }),
  addressDistrict: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O bairro deve ter no mínimo 2 caracteres.",
  }),
  number: z.coerce
    .number({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo obrigatório",
    })
    .min(1, {
      message: "O número deve ter pelo menos um dígito.",
    }),
  complement: z.string().optional(),
  phone: z
    .string({ required_error: "Campo obrigatório" })
    .min(10, "O telefone deve ter no mínimo 10 dígitos")
    .refine((phone: string) => {
      return isValidNumber(phone);
    }, "O telefone informado é inválido."),
});

export const ProducerAddressForm = () => {
  const { api } = useBackendClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof producerAddressFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(producerAddressFormSchema),
  });

  const { mutate: sendAddressData, isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof producerAddressFormSchema>) => {
      const cpf = localStorage.getItem("cpf")!;
      const birthDate = localStorage.getItem("birthDate")!;
      const fullName = localStorage.getItem("fullName")!;
      return await api.producer.sendProducersData({...data, cpf, birthDate, fullName});
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Seus dados de endereço foram cadastrados!",
      });
      router.push("/auth/register/producer/documents");
    },
    onError(error: any, variables, context) {
      toast({
        variant: "destructive",
        title: "Ops.",
        description: error.response.data.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof producerAddressFormSchema>) {
    sendAddressData(values);
  }

  const fetchCepData = async (cep: string) => {
    if (cep.length === 8) {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
      form.setValue("addressCity", data.localidade);
      form.setValue("addressUf", data.uf);
      form.setValue("address", data.logradouro);
      form.setValue("addressDistrict", data.bairro);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="addressZipcode"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>CEP</FormLabel>
              <FormControl
                onBlur={async (e) => {
                  await fetchCepData(field.value);
                }}
              >
                <MaskedInput
                  id="addressZipcode"
                  mask="99999-999"
                  placeholder="CEP"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="addressCity"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input id="addressCity" placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressUf"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input id="addressUf" placeholder="Estado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input id="address" placeholder="Endereço" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressDistrict"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input id="addressDistrict" placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Numero</FormLabel>
                <FormControl>
                  <Input
                    id="number"
                    type="number"
                    placeholder="00000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input id="complement" placeholder="Opcional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Celular</FormLabel>
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

        <div>
          <Button disabled={isLoading} className="w-full mt-4" type="submit">
            {isLoading ? (
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
