"use client";
import { Button } from "@/components/ui/button";
import { isValidNumber } from "@/utils/phone";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ImageIcon,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import DocumentBack from "../../public/doc-back.svg";
import DocumentFront from "../../public/doc-front.svg";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";
import useBackendClient from "@/hooks/useBackendClient";
import { useMutation } from "react-query";
import { toast } from "../ui/use-toast";
import { DocumentType } from "@/backend-sdk/services/producer-service";
import { PresignedUrl } from "../Post/PostMaker";

export default function ProducerDocuments() {
  const [selectedOption, setSelectedOption] = useState("rg");
  const [selectedFrontImage, setSelectedFrontImage] = useState<File>();
  const [selectedBackImage, setSelectedBackImage] = useState<File>();
  const router = useRouter();
  const { api } = useBackendClient();

  const { mutate: sendDocumentPicture, isLoading } = useMutation({
    mutationFn: async () => {
      const docType = selectedOption === "rg" ? DocumentType.RG : DocumentType.CNH;
      return await api.producer.sendDocuments(docType);
    },
    onSuccess: async (data) => {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "As fotos do seu documento foram enviadas!",
      });

      const presignedUrls: any = {front: data.documentFront, back: data.documentBack}
      const files: any = {front: selectedFrontImage!, back: selectedBackImage!}

      localStorage.setItem("selfiePresignedUrl", JSON.stringify(data.documentHolding));

      await api.producer.uploadDocuments(presignedUrls, files);

      router.push("/auth/register/producer/selfie");
    },
    onError(error: any, variables, context) {
      toast({
        variant: "destructive",
        title: "Ops.",
        description: "Erro ao enviar documentação",
      });
    },
  });

  const handleFrontImageFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedFrontImage(e.target.files[0]);
    }
  };

  const handleBackImageFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedBackImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = (image: "front" | "back") => {
    if (image === "front") {
      setSelectedFrontImage(undefined);
    } else {
      setSelectedBackImage(undefined);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSendPictures = () => {
    sendDocumentPicture();
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
            Cadastro de documentos
          </div>
          <div className="w-full flex gap-7 mt-2">
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-secondary" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300 opacity-50" />
            <div className="w-1/5 h-1 rounded-sm bg-slate-300 opacity-50" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="font-medium">
          Como você pode tirar uma foto boa do seu documento?
        </div>

        <ul className="text-sm list-disc list-inside space-y-1">
          <li>
            Não edite fotos. Fotos com algum tipo de edição serão
            desconsideradas.
          </li>
          <li>
            Tire uma foto em que o seu rosto e dados do documento estejam
            nítidos.
          </li>
          <li>Não envie documentos vencidos. Eles serão desconsiderados.</li>
        </ul>

        <div className="flex gap-10 justify-center mt-6">
          <Image
            width={110}
            height={70}
            src={DocumentFront}
            alt="Document front"
          />
          <Image
            width={110}
            height={70}
            src={DocumentBack}
            alt="Document back"
          />
        </div>

        <div className="w-full mt-4">
          <div className="font-medium">Tipo de documento</div>
          <RadioGroup
            className="flex gap-2 items-center justify-start mt-2"
            value={selectedOption}
            onValueChange={setSelectedOption}
          >
            <Label
              className={`flex w-1/2 items-center gap-4 font-medium ${
                selectedOption === "rg" ? "border-secondary" : ""
              }`}
              htmlFor="rg"
            >
              <RadioGroupItem
                className="aria-checked:border-secondary"
                value="rg"
                id="rg"
              />
              RG
            </Label>

            <Label
              className={`flex w-1/2 items-center gap-4 font-medium ${
                selectedOption === "cnh" ? "border-secondary" : ""
              }`}
              htmlFor="cnh"
            >
              <RadioGroupItem
                className="aria-checked:border-secondary"
                value="cnh"
                id="cnh"
              />
              CNH
            </Label>
          </RadioGroup>
        </div>

        <div className="w-full mt-4">
          <div className="font-medium">Frente do documento</div>
          <div className="flex gap-4 mt-2">
            {!selectedFrontImage ? (
              <>
                <Button className="w-1/2 p-0 lg:hidden">
                  <label
                    className="w-full h-full flex items-center justify-center"
                    htmlFor="front-capture"
                  >
                    Tirar Foto <Camera className="ml-2" size={18} />
                  </label>
                </Button>
                <Button className="w-1/2">
                  <label
                    className="w-full h-full flex items-center justify-center"
                    htmlFor="front-file"
                  >
                    Enviar Foto <ImageIcon className="ml-2" size={18} />
                  </label>
                </Button>
              </>
            ) : (
              <div className="w-full flex p-2 rounded-sm border justify-between">
                <div className="overflow-hidden text-ellipsis text-nowrap">
                  {selectedFrontImage.name}
                </div>
                <div
                  onClick={() => handleRemoveImage("front")}
                  className="flex cursor-pointer gap-2 text-sm items-center justify-center font-medium w-max flex-none"
                >
                  Remover <XCircle size={16} />
                </div>
              </div>
            )}
          </div>
        </div>
        <input
          id="front-capture"
          className="hidden"
          onChange={handleFrontImageFileInputChange}
          type="file"
          accept="image/*"
          capture
        />
        <input
          id="front-file"
          className="hidden"
          onChange={handleFrontImageFileInputChange}
          type="file"
          accept="image/*"
        />

        {selectedFrontImage && (
          <div className="w-full ">
            <div className="font-medium">Verso do documento</div>
            <div className="flex gap-4 mt-2">
              {!selectedBackImage ? (
                <>
                  <Button className="w-1/2 p-0 lg:hidden">
                    <label
                      className="w-full h-full flex items-center justify-center"
                      htmlFor="back-capture"
                    >
                      Tirar Foto <Camera className="ml-2" size={18} />
                    </label>
                  </Button>
                  <Button className="w-1/2">
                    <label
                      className="w-full h-full flex items-center justify-center"
                      htmlFor="back-file"
                    >
                      Enviar Foto <ImageIcon className="ml-2" size={18} />
                    </label>
                  </Button>
                </>
              ) : (
                <div className="w-full flex p-2 gap-2 rounded-sm border justify-between">
                  <div className="overflow-hidden text-ellipsis text-nowrap">
                    {selectedBackImage.name}
                  </div>
                  <div
                    onClick={() => handleRemoveImage("back")}
                    className="flex cursor-pointer gap-2 text-sm items-center justify-center font-medium w-max flex-none"
                  >
                    Remover <XCircle size={16} />
                  </div>
                </div>
              )}
            </div>
            <input
              id="back-capture"
              className="hidden"
              onChange={handleBackImageFileInputChange}
              type="file"
              accept="image/*"
              capture
            />
            <input
              id="back-file"
              className="hidden"
              onChange={handleBackImageFileInputChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}

        <div>
          <Button onClick={handleSendPictures} disabled={!selectedBackImage || !selectedFrontImage || isLoading} className="w-full mt-4">
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
