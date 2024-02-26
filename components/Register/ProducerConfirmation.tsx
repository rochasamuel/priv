"use client";
import { Button } from "@/components/ui/button";
import { isValidNumber } from "@/utils/phone";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  CornerRightDown,
  ImageIcon,
  Smartphone,
  VenetianMask,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import Selfie from "../../public/selfie.svg";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProducerConfirmation() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleRedirect = async () => {
    await updateSession({ user: { activeProducer: true } });
    router.replace("/");
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
          Criar sua conta de produtor(a)
        </CardTitle>
        <div>
          <div className="text-lg text-secondary mt-4 font-medium">
            Validação de cadastro
          </div>
          <div className="w-full flex gap-7 mt-2">
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <img className="mx-auto" src="/privatus-mask.svg" alt="simple logo" />
        <div className="font-medium text-center w-full">
          Prontinho! Seu cadastro está em análise e em breve você vai receber um email de confirmação.
        </div>

        <Button onClick={handleRedirect} className="mt-4">
          Ok, entendi
        </Button>
      </CardContent>
    </Card>
  );
}
