"use client";

import {
  Home,
  Search,
  PlusSquare,
  MessageCircle,
  Menu,
  FileSignature,
  CreditCard,
  Share2,
  Network,
  CircleDollarSign,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SideNavItem } from "../SideNav/SideNav";
import { ReactElement } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { getAcronym } from "@/utils";

const MobileNav = () => {
  const pathName = usePathname();
  const { data: session, status } = useSession();

  const shouldHighlight = (pathname: string) => {
    return pathname === pathName;
  };

  const handleLogout = () => {
    signOut();
  }

  return (
    <div className="w-full h-16 bg-gray-900 flex items-center justify-between p-6 sticky bottom-0 z-50 lg:hidden">
      <Link href={"/"}>
        <Home color={shouldHighlight("/") ? "#b759d9" : "#FFF"} />
      </Link>
      <Link href={"/"}>
        <Search color={shouldHighlight("/search") ? "#b759d9" : "#FFF"} />
      </Link>
      <Link href={"/"}>
        <PlusSquare
          color={shouldHighlight("/create-post") ? "#b759d9" : "#FFF"}
        />
      </Link>
      <Link href={"/"}>
        <MessageCircle color={shouldHighlight("/chats") ? "#b759d9" : "#FFF"} />
      </Link>
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center justify-start">
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
          </SheetHeader>
          <div className="flex flex-col justify-between h-full pb-4 pt-4">
            <div className="mt-2 flex flex-col">
              <SheetClose asChild>
                <Link href={"/subscriptions"}>
                  <MobileNavItem name="Inscrições" icon={<FileSignature />} />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/cards"}>
                  <MobileNavItem
                    name="Cadastrar cartão"
                    icon={<CreditCard />}
                  />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/afiliates"}>
                  <MobileNavItem name="Afiliados" icon={<Network />} />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/dashboard"}>
                  <MobileNavItem name="Dashboard" icon={<CircleDollarSign />} />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/settings"}>
                  <MobileNavItem name="Configurações" icon={<Settings />} />
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/help"}>
                  <MobileNavItem name="Ajuda e Suporte" icon={<HelpCircle />} />
                </Link>
              </SheetClose>
            </div>
            <div className="mb-3" onClick={handleLogout}>
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
