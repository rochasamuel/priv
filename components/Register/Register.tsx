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
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

export default function Register() {
  return (
    <Card className="w-96 max-w-[90dvw] backdrop-blur bg-black/60">
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
