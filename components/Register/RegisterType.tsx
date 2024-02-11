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
import { ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function RegisterType() {
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
          Criar sua conta
        </CardTitle>
        <CardDescription>O que você prefere?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <RegisterForm />
      </CardContent>
    </Card>
  );
}

export const RegisterForm = () => {
  const [selectedOption, setSelectedOption] = useState("consumer");
  const router = useRouter();

  const handleRedirect = () => {
    if (selectedOption === "consumer") {
      return router.push("consumer");
    }
    return router.push("producer");
  };

  return (
    <div className="flex flex-col gap-8">
      <RadioGroup
        value={selectedOption}
        onValueChange={setSelectedOption}
        className="gap-4"
      >
        <Label
          className={`flex items-center p-4 gap-4 border rounded-sm text-base font-medium ${
            selectedOption === "consumer" ? "border-[#E250E6]" : ""
          }`}
          htmlFor="consumer"
        >
          <RadioGroupItem
            className="aria-checked:border-[#E250E6]"
            value="consumer"
            id="consumer"
          />
          Quero consumir conteúdo
        </Label>
        <Label
          className={`flex items-center p-4 gap-4 border rounded-sm text-base font-medium ${
            selectedOption === "producer" ? "border-[#E250E6]" : ""
          }`}
          htmlFor="producer"
        >
          <RadioGroupItem
            className="aria-checked:border-[#E250E6]"
            value="producer"
            id="producer"
          />
          Quero produzir conteúdo
        </Label>
      </RadioGroup>

      <Button className="w-full" type="submit" onClick={handleRedirect}>
        Avançar <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
};
