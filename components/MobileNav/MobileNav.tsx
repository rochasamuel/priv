"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAcronym } from "@/utils";
import {
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileEdit,
  FileSignature,
  Flame,
  HandCoins,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Network,
  PlusSquare,
  Receipt,
  Search,
  Settings,
  Share2,
  UserRound,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useMemo, useState } from "react";
import { SideNavItem } from "../SideNav/SideNav";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "../ui/use-toast";

const MobileNav = () => {
  const pathName = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleRedirect = (username?: string) => {
    if(!session?.user.activeProducer || !session?.user.approved) {
      toast({
        title: "Acesso negado",
        description:
          session?.user.activeProducer && !session?.user.approved
            ? "Recurso exclusivo para produtores. Sua conta de produtor ainda não foi aprovada"
            : "Recurso exclusivo para produtores",
      })
      return;
    };
    if (username) router.push(`/profile/${username}`);
  };

  const shouldHighlight = (pathname: string) => {
    return pathname === pathName;
  };

  const isProducerProfile = useMemo(() => {
    return session?.user.activeProducer && session?.user.approved;
  }
  , [session]);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="w-full h-16 bg-[#161616] flex items-center justify-between p-6 z-50 lg:hidden">
      <Link href={"/"}>
        <Home className={`${shouldHighlight("/") ? "text-secondary" : "text-white"}`} />
      </Link>
      <Link href={"/hot"}>
        <Flame className={`${shouldHighlight("/hot") ? "text-secondary" : "text-white"}`} />
      </Link>
      <Link href={"/search"}>
        <Search className={`${shouldHighlight("/search") ? "text-secondary" : "text-white"}`} />
      </Link>
      {/* <Link href={"/"}>
        <PlusSquare
          color={shouldHighlight("/create-post") ? "#b759d9" : "#FFF"}
        />
      </Link> */}
      <Link href={"/chats"}>
        <MessageCircle
          className={`${shouldHighlight("/chats") ? "text-secondary" : "text-white"}`}
        />
      </Link>
      <Sheet>
        <SheetTrigger>
          <Menu color="#FFF" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetClose asChild>
              <SheetTitle
                className="flex items-center justify-start"
                onClick={() => handleRedirect(session?.user.username)}
              >
                <Avatar className="mr-2 w-9 h-9">
                  <AvatarImage src={session?.user.profilePhotoPresignedGet} />
                  <AvatarFallback>
                    {getAcronym(session?.user.presentationName || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-left">
                  {session?.user.presentationName}
                </div>
              </SheetTitle>
            </SheetClose>
          </SheetHeader>
          <div className="flex flex-col justify-between h-full pb-4 pt-4">
            <div className="mt-2 flex flex-col">
              <SheetClose asChild>
                <Link href={"/subscriptions"} className={`${shouldHighlight("/subscriptions") ? "text-secondary" : "text-white"}`}>
                  <MobileNavItem name="Inscrições" icon={<FileSignature />} />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/cards"} className={`${shouldHighlight("/cards") ? "text-secondary" : "text-white"}`}>
                  <MobileNavItem name="Cartões" icon={<CreditCard />} />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/affiliates"} className={`${shouldHighlight("/affiliates") ? "text-secondary" : "text-white"}`}>
                  <MobileNavItem name="Afiliados" icon={<Network />} />
                </Link>
              </SheetClose>

              {isProducerProfile && <SheetClose asChild>
                <Link href={"/dashboard"} className={`${shouldHighlight("/dashboard") ? "text-secondary" : "text-white"}`}>
                  <MobileNavItem name="Dashboard" icon={<CircleDollarSign />} />
                </Link>
              </SheetClose>}

              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="flex items-center gap-2">
                  <MobileNavItem name="Configurações" icon={<Settings />} />{" "}
                  <ChevronRight
                    size={14}
                    className={`${isOpen ? "rotate-90" : ""} transition-all`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col pl-8">
                  {isProducerProfile && <SheetClose asChild>
                    <Link href={"/settings/plans"} className={`${shouldHighlight("/settings/plans") ? "text-secondary" : "text-white"}`}>
                      <MobileNavItem name="Planos" icon={<FileEdit />} />
                    </Link>
                  </SheetClose>}

                  {isProducerProfile && <SheetClose asChild>
                    <Link href={"/settings/bank"} className={`${shouldHighlight("/settings/bank") ? "text-secondary" : "text-white"}`}>
                      <MobileNavItem name="Dados Bancários" icon={<HandCoins />} />
                    </Link>
                  </SheetClose>}

                  <SheetClose asChild>
                    <Link href={"/settings/account"} className={`${shouldHighlight("/settings/account") ? "text-secondary" : "text-white"}`}>
                      <MobileNavItem name="Conta" icon={<UserRound />} />
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link href={"/settings/payments"} className={`${shouldHighlight("/settings/payments") ? "text-secondary" : "text-white"}`}>
                      <MobileNavItem name="Pagamentos" icon={<Receipt />} />
                    </Link>
                  </SheetClose>
                </CollapsibleContent>
              </Collapsible>

              <SheetClose asChild>
                <Link
                  target="_blank"
                  href={
                    "https://api.whatsapp.com/send?phone=556196286030&text=Gostaria%20de%20um%20aux%C3%ADlio%20na%20plataforma%2C%20poderia%20me%20ajudar%3F"
                  }
                >
                  <MobileNavItem name="Ajuda e Suporte" icon={<HelpCircle />} />
                </Link>
              </SheetClose>
            </div>
            <div className="mb-3 w-min" onClick={handleLogout}>
              <MobileNavItem name="Sair" icon={<LogOut />} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export interface MobileNavItemProps {
  name: string;
  icon: ReactElement;
}

const MobileNavItem = ({ icon, name }: MobileNavItemProps) => {
  return (
    <div className="flex items-center cursor-pointer mt-3 mb-3">
      {icon}
      <p className="ml-2 font-semibold text-base">{name}</p>
    </div>
  );
};

export default MobileNav;
