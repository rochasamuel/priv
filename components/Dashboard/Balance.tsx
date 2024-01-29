"use client";

import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { FunctionComponent, useState } from "react";
import { useQuery } from "react-query";
import { DateTime } from "luxon";
import { Button } from "../ui/button";
import { Banknote, Eye, EyeOff, FileSignature, Info, Loader2, Lock } from "lucide-react";
import { toCurrency } from "@/utils/currency";

const Balance: FunctionComponent = () => {
  const [shouldHideMoney, setShouldHideMoney] = useState(false);

  const { data: session } = useSession();

  const { data: producerData } = useQuery({
    queryKey: ["producerData", session?.user?.userId],
    queryFn: async () => {
      const api = apiClient(session?.user?.accessToken);

      const activeSubscribersCount =
        await api.producer.getProducerActiveSubscribersCount();
      const balance = await api.producer.getProducerBalance();

      console.log({ activeSubscribersCount, ...balance });

      return {
        activeSubscribersCount,
        ...balance,
      };
    },
    enabled: !!session?.user?.userId,
  });

  return (
    <div className="flex flex-col items-center justify-center mt-4 gap-3">
      <div className="text-xs">
        {DateTime.now().toFormat("dd 'de' LLL 'de' yyyy | HH:mm", {
          locale: "pt-br",
        })}
      </div>
      <Button className="">Sacar saldo desbloqueado</Button>

      <div className="w-min flex flex-col md:flex-row md:justify-center gap-3 mx-auto">
        <div className="w-64 md:w-auto flex border rounded-sm p-3 gap-5">
          <div className="my-auto items-center min-w-[20px]">
            <FileSignature size={20} />
          </div>
          <div className="w-full self-start items-start whitespace-nowrap">
            <p className="font-bold">Assinaturas ativas</p>
            <p className="">
              {producerData?.activeSubscribersCount ?? (
                <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
              )}
            </p>
          </div>
        </div>

        <div className="w-64 md:w-auto flex border rounded-sm p-3 gap-5">
          <div className="my-auto items-center min-w-[20px]">
            <Lock size={20} />
          </div>
          <div className="w-full self-start items-start whitespace-nowrap">
            <div className="flex items-center gap-2 font-bold">
              Saldo bloqueado {/* <Info size={14} />*/}
            </div>
            <div className="flex items-center gap-2">
              {producerData ? (
                <>
                  {!shouldHideMoney ? (
                    toCurrency(producerData?.lockedBalance)
                  ) : (
                    <div className="w-28 h-5 bg-gray-500 rounded-sm" />
                  )}
                </>
              ) : (
                <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
              )}
              <Button
                className="p-1 h-min"
                onClick={() => setShouldHideMoney(!shouldHideMoney)}
                variant={"ghost"}
              >
                {shouldHideMoney ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-64 md:w-auto flex border rounded-sm p-3 gap-5">
          <div className="my-auto items-center min-w-[20px]">
            <Banknote size={20} />
          </div>
          <div className="w-full self-start items-start whitespace-nowrap">
            <div className="flex items-center gap-2 font-bold">
              Saldo desbloqueado {/* <Info size={14} /> */}
            </div>
            <div className="flex items-center gap-2">
              {producerData ? (
                <>
                  {!shouldHideMoney ? (
                    toCurrency(producerData?.unlockedBalance)
                  ) : (
                    <div className="w-28 h-5 bg-gray-500 rounded-sm" />
                  )}
                </>
              ) : (
                <Loader2 className="mr-2 mt-1 h-4 w-4 animate-spin" />
              )}
              <Button
                className="p-1 h-min"
                onClick={() => setShouldHideMoney(!shouldHideMoney)}
                variant={"ghost"}
              >
                {shouldHideMoney ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
