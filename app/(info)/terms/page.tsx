"use client"
import ConsumerTerms from "@/components/Terms/ConsumerTerms";
import ProducerTerms from "@/components/Terms/ProducerTerms";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

export default function Terms() {
  const [selectedSection, setSelectedSection] = useState("producer");

  const handleSessionChange = (
    session:
      | "producer"
      | "consumer"
  ) => {
    setSelectedSection(session);
  };

  const renderSession = () => {
    switch (selectedSection) {
      case "producer":
        return <ProducerTerms />;
      case "consumer":
        return <ConsumerTerms />;
    }
  };

  const selectedSessionStyle =
    "text-lg  font-bold border-b-2 border-pink-500 transition-all duration-500";
    
  return <div className="p-6">
    <div className="w-full h-max bg-background z-20 mb-4 flex gap-4 items-center justify-start py-2 overflow-x-auto">
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "producer" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("producer")}
        >
          Criador de Conteúdo
        </div>
        <Separator orientation="vertical" />
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "consumer" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("consumer")}
        >
          Assinante
        </div>
        <Separator orientation="vertical" />
      </div>
    {renderSession()}
  </div>;
}
