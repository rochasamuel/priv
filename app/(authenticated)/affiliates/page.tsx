"use client";

import apiClient from "@/backend-sdk";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toCurrency } from "@/utils/currency";
import { Copy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "react-query";

export default function Affiliates() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const { data: referrerMetrics, isLoading } = useQuery({
    queryKey: ["referrerMetrics", session?.user.referrerCode],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken);
      const result = await api.referrer.getMetrics();

      console.log(result.metrics);
      return result;
    },
    enabled: status === "authenticated",
  });

  const handleClipboardCopy = async () => {
    await navigator.clipboard.writeText(
      `https://privatus.vip/?referrer=${session?.user.referrerCode}`
    );
    toast({
      title: "Link copiado!",
      description: "O link de afiliado foi copiado para sua área de transferência.",
    });
  }

  return (
    <div className="w-full flex items-center flex-col p-0">
      <div className="text-2xl w-full text-center">
        Indique e <span className="font-bold">ganhe</span>!
      </div>

      <p className="text-center mt-4 text-sm">
        Gere seu link de afiliado, envie para seu amigo criador de conteúdo e
        começe a ganhar o mais rápido possível. Durante seis meses você fica com
        5% do valor bruto que seu afiliado produzir. O crédito aparecerá na aba
        <Link className="text-purple-500" href={"/dashboard"}>
          {" "}
          Dashboard
        </Link>{" "}
        após trinta dias da venda realizada pelo criador de conteúdo.
      </p>

      <div className="flex flex-col justify-center mt-8 gap-3 items-center lg:flex-row">
        <div className="flex flex-col items-center justify-center lg:w-[33%]">
          <div className="font-bold flex justify-center items-center text-2xl rounded-full bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 w-12 h-12 p-4">
            1
          </div>
          <p className="text-center mt-2 text-sm">
            Mande o link de convite para seu amigo criador de conteúdo e diga o
            quão legal é a plataforma.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center lg:w-[33%]">
          <div className="font-bold flex justify-center items-center text-2xl rounded-full bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 w-12 h-12 p-4">
            2
          </div>
          <p className="text-center mt-2 text-sm">
            Seu amigo criador de conteúdo se cadastra na plataforma com seu link
            de afiliado.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center lg:w-[33%]">
          <div className="font-bold flex justify-center items-center text-2xl rounded-full bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 w-12 h-12 p-4">
            3
          </div>
          <p className="text-center mt-2 text-sm">
            Ele começa a vender e você começa a ganhar.
          </p>
        </div>
      </div>

      <div className="w-full h-64 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-sm border-[1px] mt-8 md:max-w-md">
        <div className="w-full h-full bg-black bg-opacity-50 backdrop-blur-3xl p-4">
          <p className="font-medium text-sm">Link de afiliado:</p>
          <div className="flex justify-start items-center">
            <p className="text-sm line-clamp-1">
              https://privatus.vip/?referrer={session?.user.referrerCode}
            </p>
            <Button onClick={handleClipboardCopy} className="ml-2 w-8 h-8" size={"icon"} variant={"outline"}>
              <Copy size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-5 mt-4">
            <div>
              <p className="font-medium text-sm">Você recebe:</p>
              {isLoading ? <Loader2 className="animate-spin" /> : <p className="font-bold text-lg">{referrerMetrics?.metrics.referrerPercentage}%</p>}
            </div>
            <div>
              <p className="font-medium text-sm">Nº de afiliados:</p>
              {isLoading ? <Loader2 className="animate-spin" /> : <p className="font-bold text-lg">{referrerMetrics?.metrics.totalReferences}</p>}
            </div>
            <div>
              <p className="font-medium text-sm">Total de ganhos:</p>
              {isLoading ? <Loader2 className="animate-spin" /> : <p className="font-bold text-lg">{toCurrency(referrerMetrics?.metrics.totalMonetaryReferences)}</p>}
            </div>
          </div>

          <p className="text-xs italic text-gray-300 mt-6">O valor mínimo para saque é de {toCurrency(10)}</p>
        </div>
      </div>
    </div>
  );
}
