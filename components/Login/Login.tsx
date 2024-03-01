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

import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchemaLogin = z.object({
  username: z.string({ required_error: "Campo obrigatório" }).min(3, {
    message: "O nome de usuário deve ter no mínimo 3 carcteres.",
  }).max(100, {
    message: "O nome de usuário deve ter no máximo 100 carcteres.",
  }),
  password: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }).max(100, {
    message: "A senha deve ter no máximo 100 carcteres.",
  }),
});

export default function Login() {
  return (
    <Card className="w-full lg:w-1/3 max-w-[90dvw] backdrop-blur bg-black/60">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Faça seu login ou registre-se para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <LoginForm />
      </CardContent>
    </Card>
  );
}

export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Aguarde
    </Button>
  );
}

export const LoginForm = () => {
  const router = useRouter();
  const [isSendindRequest, setIsSendingRequest] = useState(false);
  const [peekingPassword, setPeekingPassword] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    mode: "onChange",
    resolver: zodResolver(formSchemaLogin),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    try {
      setIsSendingRequest(true);
      const callBackUrl = searchParams.get("callbackUrl")
      const response = await signIn("credentials", {
        email: values.username,
        password: values.password,
        redirect: false,
      });

      if (!response?.error) {
        if(callBackUrl) {
          router.replace(callBackUrl);
        } else {
          router.replace("/");
        }
      } else {
        setIsSendingRequest(false);
        toast({
          variant: "destructive",
          title: "Ops.",
          description:
            "Algo deu errado com seu login. Verifique os dados e tente novamente",
        });
      }
    } catch (error) {
      setIsSendingRequest(false);
      toast({
        variant: "destructive",
        title: "Ops.",
        description:
          "Algo deu errado com seu login. Verifique os dados e tente novamente",
      });
      console.log("[LOGIN_ERROR]: ", error);
    }
  }
  
  const handleTogglePasswordPeek = () => {
    setPeekingPassword(!peekingPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Usuário ou email</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu usuário ou email"
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
                  placeholder="Sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <Button variant="link" className="font-semibold text-white" type="button">
            Esqueceu sua senha?
          </Button>
        </div>
        <Button disabled={isSendindRequest} className="w-full" type="submit">
          {isSendindRequest ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Aguarde
            </>
          ) : (
            <>Entrar</>
          )}
        </Button>
        <div className="text-sm w-full flex justify-center items-center">
          Não tem uma conta? <Link href="/auth/register/type" className="ml-1 underline">Crie agora</Link>
        </div>
      </form>
    </Form>
  );
};