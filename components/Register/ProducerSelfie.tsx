"use client";
import { Button } from "@/components/ui/button";
import { isValidNumber } from "@/utils/phone";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  CornerRightDown,
  ImageIcon,
  Loader2,
  Smartphone,
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
import { useMutation } from "react-query";
import { toast } from "../ui/use-toast";
import useBackendClient from "@/hooks/useBackendClient";
import { useSession } from "next-auth/react";

export default function ProducerSelfie() {
  const [selectedSelfieImage, setSelectedSelfieImage] = useState<File>();
  const { api } = useBackendClient();
  const router = useRouter();
  const { update: updateSession } = useSession();

  const { mutate: sendSelfie, isLoading } = useMutation({
    mutationFn: async () => {
      const selfiePresignedUrl = localStorage.getItem("selfiePresignedUrl");
      if(selfiePresignedUrl) {
        return await api.producer.uploadSelfie(JSON.parse(selfiePresignedUrl), selectedSelfieImage!);
      }
      
      throw new Error("Presigned URL not found");
    },
    onSuccess: async (data) => {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "A sua selfie foi enviada!",
      });
      updateSession({ user: { hasDocuments: true, hasPendingDocuments: true } })
      router.push("/auth/register/producer/bank");
    },
    onError(error: any, variables, context) {
      toast({
        variant: "destructive",
        title: "Ops.",
        description: "Erro ao enviar selfie",
      });
    },
  });

  const handleSelfieImageFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedSelfieImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedSelfieImage(undefined);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSendSelfie = () => {
    sendSelfie();
  }

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
            <div className="w-1/5 h-1 rounded-sm bg-slate-300" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300 opacity-50" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="font-medium">
          Tire uma selfie segurando seu RG ou CNH
        </div>

        <ul className="text-sm list-decimal list-inside space-y-1">
          <li>Procure um lugar bem iluminado e com um fundo claro.</li>
          <li>Posicione o celular em modo paisagem (deitado).</li>
          <li>O documento precisa estar for do plástico.</li>
          <li>Segure o documento ao lado do seu rosto.</li>
          <li>Não tampe nenhuma informação do documento.</li>
        </ul>

        <div className="flex gap-20 justify-center mt-6">
          <div className="flex gap-1 items-start relative ">
            <Smartphone size={60} />
            <CornerRightDown size={30} />
            <Smartphone
              className="absolute rotate-90 bottom-2 left-14"
              size={60}
            />
          </div>
          <Image width={110} height={70} src={Selfie} alt="Document back" />
        </div>

        <div className="w-full mt-4">
          <div className="font-medium">Selfie com o documento</div>
          <div className="flex gap-4 mt-2">
            {!selectedSelfieImage ? (
              <>
                <Button className="w-1/2 p-0 lg:hidden">
                  <label
                    className="w-full h-full flex items-center justify-center"
                    htmlFor="selfie-capture"
                  >
                    Tirar Foto <Camera className="ml-2" size={18} />
                  </label>
                </Button>
                <Button className="w-1/2">
                  <label
                    className="w-full h-full flex items-center justify-center"
                    htmlFor="selfie-file"
                  >
                    Enviar Foto <ImageIcon className="ml-2" size={18} />
                  </label>
                </Button>
              </>
            ) : (
              <div className="w-full flex p-2 rounded-sm border justify-between">
                <div className="overflow-hidden text-ellipsis text-nowrap">
                  {selectedSelfieImage.name}
                </div>
                <div
                  onClick={handleRemoveImage}
                  className="flex cursor-pointer gap-2 text-sm items-center justify-center font-medium w-max flex-none"
                >
                  Remover <XCircle size={16} />
                </div>
              </div>
            )}
          </div>
        </div>
        <input
          id="selfie-capture"
          className="hidden"
          onChange={handleSelfieImageFileInputChange}
          type="file"
          accept="image/*"
          capture
        />
        <input
          id="selfie-file"
          className="hidden"
          onChange={handleSelfieImageFileInputChange}
          type="file"
          accept="image/*"
        />

        <div className="text-xs w-full pt-4">
          Ao avançar declaro que li e concordo com os{" "}
          <Link href="/terms" className="underline opacity-75">
            Termos de Uso
          </Link>
          ,{" "}
          <Link href="/privacy" className="underline opacity-75">
            Política de Privacidade
          </Link>{" "}
          e{" "}
          <Link href="/cookies" className="underline opacity-75">
            Política de Cookies
          </Link>
          . E confirmo ter pelo menos 18 anos.
        </div>

        <div>
          <Button onClick={handleSendSelfie} disabled={!selectedSelfieImage || isLoading} className="w-full mt-4">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Aguarde
              </>
            ) : (
              <div className="flex items-center justify-center">
                Avançar <ArrowRight className="ml-2" size={18} />
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
