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
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "react-query";
import apiClient from "@/backend-sdk";
import { toast, useToast } from "../ui/use-toast";
import { useState } from "react";

const consumerFormSchema = z.object({
  name: z.string({ required_error: "Campo obrigatório" }).min(4, {
    message: "O nome deve ter no mínimo 4 carcteres.",
  }),
  presentationName: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O nome de apresentação deve ter no mínimo 8 caracteres.",
  }),
  username: z.string({ required_error: "Campo obrigatório" }).min(4, {
    message: "O username deve ter no mínimo 4 caracteres.",
  }),
  email: z
    .string({ required_error: "Campo obrigatório" })
    .min(8, {
      message: "O email deve ter no mínimo 8 caracteres.",
    })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Campo obrigatório" })
    .min(8, {
      message: "A senha deve ter no mínimo 8 caracteres.",
    })
    .superRefine((password, ctx) => {
      const lowercaseRegex = /[a-z]/;
      if (!lowercaseRegex.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A senha deve conter pelo menos 1 letra minúscula",
        });
      }

      const uppercaseRegex = /[A-Z]/;
      if (!uppercaseRegex.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A senha deve conter pelo menos 1 letra maiúscula",
        });
      }

      const numberRegex = /[0-9]/;
      if (!numberRegex.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A senha deve conter pelo menos 1 número",
        });
      }

      const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
      if (!symbolRegex.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A senha deve conter pelo menos 1 caractere especial",
        });
      }

      return true;
    }),
});

export default function ConsumerRegister() {
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
          Criar sua conta de consumidor
        </CardTitle>
        <CardDescription>Preencha os dados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ConsumerForm />
      </CardContent>
    </Card>
  );
}

export const ConsumerForm = () => {
  const searchParams = useSearchParams();
  const [successfullRequest, setSuccessfullRequest] = useState(false);
  const router = useRouter();
  const [peekingPassword, setPeekingPassword] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof consumerFormSchema>) => {
      const api = apiClient();
      const referrer = searchParams.get("referrer") ?? "";
      const result = await api.auth.createAccount({ ...values, referrer });
      return result;
    },
    onError(error: any) {
      toast({
        variant: "destructive",
        title: "Ops.",
        description: error.response.data.message,
      });
    },
    onSuccess(data, variables) {
      localStorage.setItem("registerEmail", variables.email);
      localStorage.setItem("registerPassword", variables.password);
      setSuccessfullRequest(true);
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Conta criada com sucesso!",
      });

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("verify", "true");
      router.push(`consumer?${current.toString()}`);
    },
  });

  const form = useForm<z.infer<typeof consumerFormSchema>>({
    resolver: zodResolver(consumerFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleTogglePasswordPeek = () => {
    setPeekingPassword(!peekingPassword);
  }

  function onSubmit(values: z.infer<typeof consumerFormSchema>) {
    mutate(values);
    // const current = new URLSearchParams(Array.from(searchParams.entries()));
    // current.set("verify", "true");
    // router.push(`consumer?${current.toString()}`);
    console.log("register", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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

        <FormField
          control={form.control}
          name="presentationName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Nome de apresentação</FormLabel>
              <FormControl>
                <Input
                  id="presentationName"
                  placeholder="Como você quer ser chamado(a)?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Nome de usuário</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  placeholder="Crie seu @username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center gap-2">
                Senha{" "}
                <Button type="button" onClick={() => handleTogglePasswordPeek()} className="p-1 h-6" variant={"ghost"}>
                  {peekingPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type={peekingPassword ? "text" : "password"}
                  placeholder="Crie uma senha forte"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading || successfullRequest}
          className="w-full"
          type="submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Aguarde
            </>
          ) : (
            <>Criar minha conta</>
          )}
        </Button>
      </form>
    </Form>
  );
};

// export PasswordValidator
