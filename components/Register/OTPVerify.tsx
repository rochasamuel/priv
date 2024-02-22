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
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, ClipboardEvent, useEffect } from "react";
import { toast } from "../ui/use-toast";
import apiClient from "@/backend-sdk";
import { useMutation } from "react-query";
import { signIn } from "next-auth/react";

const TIME_TO_RESEND = 60;

export default function OTPVerify() {
  const router = useRouter();
  const [otp, setOTP] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(TIME_TO_RESEND); // Initial countdown time in seconds
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false);

  const userEmail = (typeof window !== 'undefined' && localStorage.getItem("registerEmail")) || "";

  const { mutate, isLoading } = useMutation({
    mutationFn: async (values: { userEmail: string; otpCode: string }) => {
      setError(false);
      const api = apiClient();
      const result = await api.auth.confirmEmail({
        code: values.otpCode,
        email: values.userEmail,
      });
      return result;
    },
    onError(error: any) {
      setError(true);
      toast({
        variant: "destructive",
        title: "Ops.",
        description: error.response.data.message,
      });
    },
    async onSuccess(data) {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "Email confirmado!",
      });

      try {
        const response = await signIn("credentials", {
          email: userEmail,
          password: localStorage.getItem("registerPassword") ?? "",
          redirect: false,
        });

        if (!response?.error) {
          router.replace("/");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ops.",
          description:
            "Algo deu errado com seu login. Verifique os dados e tente novamente",
        });
      }
    },
  });

  const { mutate: resendEmail, isLoading: loadingResendEmail } = useMutation({
    mutationFn: async (values: string) => {
      const api = apiClient();
      const result = await api.auth.resendEmail(values);
      return result;
    },
    onError(error: any) {
      toast({
        variant: "destructive",
        title: "Ops.",
        description: error.response.data.message,
      });
    },
    onSuccess(data) {
      setCanResend(false);
      setSeconds(TIME_TO_RESEND);
      toast({
        variant: "default",
        title: "Sucesso!",
        description: `Um novo email de confirmação foi enviado para ${userEmail}!`,
      });
    },
  });

  const assignRef = (el: HTMLInputElement | null, index: number) => {
    inputRefs.current[index] = el;
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if ((e.key === "Backspace" || (e.keyCode || e.which) === 8) && index >= 0) {
      e.preventDefault(); // Prevent the default behavior of Backspace in some browsers
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);
      inputRefs.current[index - 1]?.focus();
    } else if (/^\d$/.test(e.key) && index < otp.length) {
      e.preventDefault();
      const newOTP = [...otp];
      newOTP[index] = e.key;
      setOTP(newOTP);

      if (index < otp.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      e.preventDefault();
      setOTP([...otp]);
      return;
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text/plain");
    const pastedOTP = clipboardData.slice(0, 6).replace(/[^\d]/g, "").split("");

    const newOTP = [...otp];

    for (const [index, digit] of pastedOTP.entries()) {
      if (newOTP[index] !== undefined) {
        newOTP[index] = digit;
      }
    }

    setOTP(newOTP);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setCanResend(true);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, canResend]);

  const handleResend = () => {
    resendEmail(userEmail);
  };

  const handleVerify = () => {
    const otpCode = otp.join("") ?? "";
    if (otpCode.length !== 6) {
      setError(true);
      toast({
        variant: "destructive",
        title: "Ops.",
        description:
          "O código de verificação deve ter 6 dígitos. Verifique e tente novamente.",
      });
      return;
    }

    mutate({ userEmail, otpCode });
  };

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
          Enviamos um código para seu e-mail <strong>{userEmail}</strong>.
          Confira sua Caixa de entrada e sua Caixa de spam. Às vezes isso pode
          levar alguns minutos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full flex gap-2 items-center justify-between">
          {otp.map((digit, index) => (
            <Input
              className={`w-14 h-14 text-center text-lg font-medium ${
                error ? "border-red-800" : ""
              }`}
              key={index + 1}
              type="number"
              value={digit}
              onKeyUp={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              maxLength={1}
              ref={(el) => assignRef(el, index)}
            />
          ))}
        </div>
        <Button
          disabled={seconds > 0 || !canResend || loadingResendEmail}
          onClick={() => handleResend()}
          className="flex m-auto"
          variant={"link"}
        >
          Reenviar código {seconds > 0 && `(${seconds})`}{" "}
          {loadingResendEmail && (
            <Loader2 className="ml-1 size-4 animate-spin" />
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col w-full">
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={() => handleVerify()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Aguarde
            </>
          ) : (
            <>Verificar</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
