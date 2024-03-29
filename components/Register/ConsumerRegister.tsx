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
import { ChevronLeft, Eye, EyeOff, HelpCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "react-query";
import apiClient from "@/backend-sdk";
import { toast, useToast } from "../ui/use-toast";
import { useState } from "react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const consumerFormSchema = z.object({
  name: z.string({ required_error: "Campo obrigatório" }).min(4, {
    message: "O nome deve ter no mínimo 4 caracteres.",
  }),
  username: z.string({ required_error: "Campo obrigatório" }).min(3, {
    message: "O username deve ter no mínimo 3 caracteres.",
  }).superRefine((username, ctx) => {
    const usernameRegex = /^[\w\d\-_\.]*$/;
    if (!usernameRegex.test(username)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O username deve conter apenas letras, números e os caracteres: - (traço), _ (underline), e . (ponto)",
      });
      return false;
    }
    return true;
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
    router.replace("/auth/register/type");
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
      const result = await api.auth.createUserAccount({ ...values, referrer });
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
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const handleTogglePasswordPeek = () => {
    setPeekingPassword(!peekingPassword);
  };

  function onSubmit(values: z.infer<typeof consumerFormSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center gap-2">
                Nome de apresentação
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle className="h-6" size={16} />
                  </PopoverTrigger>
                  <PopoverContent className="text-xs">
                    O nome de apresentação é como os outros usuários veem seu
                    nome. Pode ser seu nome real ou um não.
                  </PopoverContent>
                </Popover>
              </FormLabel>
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
                <Button
                  type="button"
                  onClick={() => handleTogglePasswordPeek()}
                  className="p-1 h-6"
                  variant={"ghost"}
                >
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

        <div className="text-xs w-full pt-4">
          Ao criar minha conta declaro que li e concordo com os{" "}
          <Link href="/terms" className="underline opacity-75">
            Termos de Uso
          </Link>
          ,{" "}
          <Link href="/privacy" className="underline opacity-75">
            Política de Privacidade
          </Link>{" "}
          e{" "}
          <Link href="/cookies" className="underline opacity-75">
            Política de Cookies
          </Link>
          . E confirmo ter pelo menos 18 anos.
        </div>

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
              <>Criar minha conta</>
            )}
          </Button>
        </div>

        <div className="flex items-center w-full justify-center">
          <Link href="/auth/login" className="underline">
            <Button variant="link" className="p-0 h-min font-semibold text-white" type="button">
              Já tem uma conta? Faça login.
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
};

// export PasswordValidator
