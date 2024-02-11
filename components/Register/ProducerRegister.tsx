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
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProducerRegister() {
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
          EM DESNVOLVIMENTO
        </CardTitle>
        <CardDescription>
          <div className="w-full">

          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProducerForm />
      </CardContent>
    </Card>
  );
}

const producerFormSchema = z.object({
  name: z.string({ required_error: "Campo obrigatório" }).min(4, {
    message: "O nome deve ter no mínimo 4 carcteres.",
  }),
  presentationName: z.string({ required_error: "Campo obrigatório" }).min(2, {
    message: "O nome de apresentação deve ter no mínimo 8 caracteres.",
  }),
  username: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "O username deve ter no mínimo 8 caracteres.",
  }),
  email: z
    .string({ required_error: "Campo obrigatório" })
    .min(4, {
      message: "O email deve ter no mínimo 4 caracteres.",
    })
    .email({ message: "Email inválido" }),
  password: z.string({ required_error: "Campo obrigatório" }).min(8, {
    message: "A senha deve ter no mínimo 8 caracteres.",
  }),
});

export const ProducerForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof producerFormSchema>>({
    resolver: zodResolver(producerFormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof producerFormSchema>) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("verify", "true");
    router.push(`consumer?${current.toString()}`);
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha forte"
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
