"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getAcronym } from "@/utils";

import {
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileEdit,
  FileSignature,
  Flame,
  FlameIcon,
  HandCoins,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  Network,
  Receipt,
  Settings,
  UserRound,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { toast } from "../ui/use-toast";

export default function SideNav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleRedirect = (username?: string) => {
    if (!session?.user.activeProducer || !session?.user.approved) {
      toast({
        title: "Acesso negado",
        description:
          session?.user.activeProducer && !session?.user.approved
            ? "Recurso exclusivo para produtores. Sua conta de produtor ainda não foi aprovada"
            : "Recurso exclusivo para produtores",
      });
      return;
    }
    if (username) router.push(`/profile/${username}`);
  };

  const isProducerProfile = useMemo(() => {
    return session?.user.activeProducer && session?.user.approved;
  }, [session]);

  return (
    <div className="h-full">
      <div className="flex gap-2 items-center cursor-pointer justify-between">
        <Avatar onClick={() => handleRedirect(session?.user.username)}>
          <AvatarImage src={session?.user.profilePhotoPresignedGet} />
          <AvatarFallback>
            {getAcronym(session?.user.presentationName ?? "")}
          </AvatarFallback>
        </Avatar>
        <p
          className="text-lg font-bold"
          onClick={() => handleRedirect(session?.user.username)}
        >
          {session?.user.presentationName}
        </p>
        <LogOut
          onClick={() => signOut()}
          className="ml-auto rounded-sm p-2 min-w-9 h-9 cursor-pointer hover:bg-accent transition-all"
        />
      </div>

      <Separator className="mt-4 mb-4" />

      <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100dvh-160px)]">
        <Link href={"/"}>
          <SideNavItem icon={<Home />} name="Início" />
        </Link>
        <Link href={"/subscriptions"}>
          <SideNavItem icon={<FileSignature />} name="Inscrições" />
        </Link>
        <Link href={"/cards"}>
          <SideNavItem icon={<CreditCard />} name="Cartões" />
        </Link>
        <Link href={"/affiliates"}>
          <SideNavItem icon={<Network />} name="Afiliados" />
        </Link>
        <Link href={"/chats"}>
          <SideNavItem icon={<MessageCircle />} name="Chats" />
        </Link>
        <Link href={"/hot"}>
          <SideNavItem icon={<FlameIcon />} name="Hot" />
        </Link>
        {isProducerProfile && (
          <Link href={"/dashboard"}>
            <SideNavItem icon={<CircleDollarSign />} name="Dashboard" />
          </Link>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-1">
            <SideNavItem name="Configurações" icon={<Settings />} />{" "}
            <ChevronRight
              size={14}
              className={`${isOpen ? "rotate-90" : ""} transition-all`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col pl-8 gap-1">
            {isProducerProfile && (
              <Link href={"/settings/plans"}>
                <SideNavItem icon={<FileEdit />} name="Planos" />
              </Link>
            )}

            {isProducerProfile && (
              <Link href={"/settings/bank"}>
                <SideNavItem icon={<HandCoins />} name="Dados Bancários" />
              </Link>
            )}

            <Link href={"/settings/account"}>
              <SideNavItem icon={<UserRound />} name="Conta" />
            </Link>

            <Link href={"/settings/payments"}>
              <SideNavItem icon={<Receipt />} name="Pagamentos" />
            </Link>
          </CollapsibleContent>
        </Collapsible>
        <Link
          href={
            "https://api.whatsapp.com/send?phone=556196286030&text=Gostaria%20de%20um%20aux%C3%ADlio%20na%20plataforma%2C%20poderia%20me%20ajudar%3F"
          }
        >
          <SideNavItem name="Ajuda e Suporte" icon={<HelpCircle />} />
        </Link>
      </div>
    </div>
  );
}

export interface SideNavItemProps {
  name: string;
  icon: ReactElement;
}

export function SideNavItem({ icon, name }: SideNavItemProps) {
  return (
    <div className="flex items-center rounded-sm p-2 cursor-pointer">
      {icon}
      <p className="ml-2 font-semibold text-base">{name}</p>
    </div>
  );
}
