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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"

const formSchemaLogin = z.object({
  username: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O nome de usuário deve ter no mínimo 2 carcteres.",
  }),
  password: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
});

const formSchemaRegister = z.object({
  name: z.string({ required_error: "Campo obrigatório" }).min(3, {
    message: "O nome de usuário deve ter no mínimo 2 carcteres.",
  }),
  email: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
  password: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
});

export default function Login() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Login</TabsTrigger>
        <TabsTrigger value="password">Registrar</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
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
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Crie sua conta</CardTitle>
            <CardDescription>
              Crie sua conta e começe a desfrutar dos prazeres da Privatus.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <RegisterForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    try {
      setIsSendingRequest(true);
      const response = await signIn("credentials", {
        email: values.username,
        password: values.password,
        redirect: false,
      });

      console.log("[LOGIN_RESPONSE]: ", response);

      if (!response?.error) {
        router.replace("/");
      } else {
        setIsSendingRequest(false);
        toast({
          variant: "destructive",
          title: "Ops.",
          description: "Algo deu errado com seu login. Verifique os dados e tente novamente",
        })
      }
    } catch (error) {
      setIsSendingRequest(false);
      toast({
        variant: "destructive",
        title: "Ops.",
        description: "Algo deu errado com seu login. Verifique os dados e tente novamente",
      })
      console.log("[LOGIN_ERROR]: ", error);
    }
  }

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
                  type="email"
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <Button variant="link" type="button">Esqueceu sua senha?</Button>
        </div>
        <Button disabled={isSendindRequest} className="w-full" type="submit">
          {isSendindRequest ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aguarde
            </>
          ) : (
            <>Entrar</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export const RegisterForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchemaRegister>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="email"
                  placeholder="Seu nome"
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
                  id="username"
                  type="email"
                  placeholder="Seu email"
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Criar minha conta
        </Button>
      </form>
    </Form>
  );
};
