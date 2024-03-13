"use client";

import { useMenuStore } from "@/store/useMenuStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { isValidNumber } from "@/utils/phone";
import { isValidCpf } from "@/utils/cpf";
import MaskedInput from "../Input/MaskedInput";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useBackendClient from "@/hooks/useBackendClient";
import { toast } from "../ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function BecomeProducerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle("Quer ser produtor");
  }, []);

  const shouldResumeRegister = useMemo(() => {
    if (session?.user.activeProducer && !session?.user.approved) {
      return !session.user.hasDocuments || !session.user.hasAddress;
    }

    return false;
  }, [session]);

  const redirectToRegister = useCallback(() => {
    if (session) {
      if (!session.user.hasAddress) {
        router.push("auth/register/producer/address");
      } else if (!session.user.hasDocuments) {
        router.push("auth/register/producer/documents");
      }
    }
  }, [router, session]);

  return (
    <div className="w-full">
      <div className="hidden text-lg font-bold lg:block mb-4">
        Quero ser produtor
      </div>
      {session?.user.hasPendingDocument && (
        <Alert className="max-w-[96vw] mx-auto mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Seu cadastro está pendente!</AlertTitle>
          <AlertDescription>
            Você já fez uma solicitação para tornar-se produtor. Agora só precisa aguardar a aprovação do seu cadastro.
          </AlertDescription>
        </Alert>
      )}
      {shouldResumeRegister && (
        <Alert className="max-w-[96vw] mx-auto mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Você não terminou o seu cadastro de produtor!</AlertTitle>
          <AlertDescription>
            Clique no botão abaixo para completar o cadastro de onde você parou.
            <br />
            <Button onClick={redirectToRegister} className="mt-2">
              Voltar ao cadastro
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {session && !session.user.activeProducer && <BecomeProducerForm />}
    </div>
  );
}

export const becomeProducerFormSchema = z.object({
  fullName: z.string({ required_error: "Campo obrigatório" }).min(4, {
    message: "O nome deve ter no mínimo 4 caracteres.",
  }),
  cpf: z.string().refine((cpf: string) => {
    return isValidCpf(cpf);
  }, "O CPF informado é inválido."),
  birthDate: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "A data de nascimento deve ter no mínimo 8 caracteres.",
  }),
  phone: z
    .string({ required_error: "Campo obrigatório" })
    .min(10, "O telefone deve ter no mínimo 10 dígitos")
    .refine((phone: string) => {
      return isValidNumber(phone);
    }, "O telefone informado é inválido."),
});

export const BecomeProducerForm = () => {
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [successfullRequest, setSuccessfullRequest] = useState(false);
  const { api } = useBackendClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof becomeProducerFormSchema>) => {
      return await api.producer.becomeProducer(values);
    },
    onError(error: any) {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: error.response.data.message,
      });
    },
    onSuccess(data, variables) {
      updateSession({ user: { activeProducer: true } })
      setSuccessfullRequest(true);
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Seus dados foram cadastrados",
      });

      router.push("/auth/register/producer/address");
    },
  });

  const form = useForm<z.infer<typeof becomeProducerFormSchema>>({
    resolver: zodResolver(becomeProducerFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      cpf: "",
      birthDate: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof becomeProducerFormSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
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
            name="cpf"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <MaskedInput
                    id="cpf"
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <MaskedInput
                    id="birthDate"
                    mask="99/99/9999"
                    placeholder="00/00/0000"
                    {...field}
                  />
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
          <Button
            disabled={isLoading || successfullRequest}
            className="w-full mt-4"
            type="submit"
          >
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
