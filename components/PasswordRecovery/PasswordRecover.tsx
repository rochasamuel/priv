"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast, useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import useBackendClient from "@/hooks/useBackendClient";
import { useMutation } from "react-query";

export default function PasswordRecover() {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/auth/login");
  };

  return (
    <Card className="w-full lg:w-1/3 max-w-[90dvw] backdrop-blur bg-black/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Redefina sua senha
        </CardTitle>
        <CardDescription>Defina sua nova senha</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <RegisterTypeForm />
      </CardContent>
    </Card>
  );
}

export const passwordRecoverForm = z
  .object({
    password: z
      .string({ required_error: "Campo obrigatório" })
      .min(8, {
        message: "A senha deve ter no mínimo 8 caracteres.",
      })
      .max(100, { message: "A senha deve ter no máximo 100 caracteres." })
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
    confirmPassword: z
      .string({ required_error: "Campo obrigatório" })
      .min(8, {
        message: "A senha deve ter no mínimo 8 caracteres.",
      })
      .max(100, { message: "A senha deve ter no máximo 100 caracteres." }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }

    return true;
  });

export const RegisterTypeForm = () => {
  const [peekingPassword, setPeekingPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { api } = useBackendClient();

  const { mutate: changePassword, isLoading } = useMutation({
    mutationFn: async (values: z.infer<typeof passwordRecoverForm>) => {
      const code = searchParams.get("code");
      const { password } = values;

      const response = await api.auth.changePassword(password, code as string);
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: "Senha redefinida com sucesso.",
      });
      router.replace("/auth/login");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha!",
        description: error.response.data.message,
      });
    },
  });

  const form = useForm<z.infer<typeof passwordRecoverForm>>({
    resolver: zodResolver(passwordRecoverForm),
    mode: "onChange",
  });

  const handleTogglePasswordPeek = () => {
    setPeekingPassword(!peekingPassword);
  };

  function onSubmit(values: z.infer<typeof passwordRecoverForm>) {
    const code = searchParams.get("code");

    if(!code) {
      toast({
        variant: "destructive",
        title: "Código de recuperação não encontrado!",
        description: "Tente usar o link de recuperação novamente, ou solicite um novo link.",
      });
      return;
    }

    changePassword(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="flex items-center gap-2">
                Repita a senha{" "}
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
                  placeholder="Repita a senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center gap-3">
          <Button
            disabled={isLoading}
            className="w-full mt-4"
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Aguarde
              </>
            ) : (
              <>Trocar minha senha</>
            )}
          </Button>
          <Link className="underline text-sm" href="/auth/login">Fazer login</Link>
        </div>
      </form>
    </Form>
  );
};
