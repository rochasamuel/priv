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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RegisterForm } from "./Register";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "./OTPInput";

interface OTPVerifyParams {
  email?: string;
}

export default function OTPVerify({ email }: OTPVerifyParams) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Card className="w-full sm:max-w-[30rem] lg:w-1/3 max-w-[90dvw] backdrop-blur bg-black/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Button
            className="px-0 w-8 h-8"
            variant={"ghost"}
            onClick={handleBack}
          >
            <ChevronLeft />
          </Button>{" "}
          Confirmar cadastro
        </CardTitle>
        <CardDescription>
          Enviamos um código para seu e-mail {email}. Confira sua Caixa
          de entrada e sua Caixa de spam. Às vezes isso pode levar alguns
          minutos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <OTPInput />
        <Button className="flex m-auto" variant={'link'}>Reenviar código</Button>
      </CardContent>
      <CardFooter className="flex flex-col w-full">
        <Button type="submit" form="register-form" className="w-full">
          Verificar
        </Button>
      </CardFooter>
    </Card>
  );
}
