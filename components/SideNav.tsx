"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { CircleDollarSign, CreditCard, FileSignature, Home, LogOut, Network } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ReactElement } from "react";

export default function SideNav() {
  return (
  <>
    <div className="flex gap-2 items-center cursor-pointer">
      <Avatar>
        <AvatarImage src="https://github.com/rochasamuel.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p className="text-lg font-bold">Samuel Rocha</p>
      <LogOut onClick={() => signOut()} size={38} className="ml-auto rounded-sm p-2 hover:bg-purple-100" />
    </div>

    <Separator className="mt-4 mb-4"/>

    <div className="flex flex-col gap-4">
      <Link href={'/'}><SideNavItem icon={<Home />} name="Início" /></Link>
      <Link href={'/subscriptions'}><SideNavItem icon={<FileSignature />} name="Inscrições" /></Link>
      <Link href={'/cards'}><SideNavItem icon={<CreditCard />} name="Cadastrar cartão" /></Link>
      <Link href={'/affiliates'}><SideNavItem icon={<Network />} name="Afiliados" /></Link>
      <Link href={'/dashboard'}><SideNavItem icon={<CircleDollarSign />} name="Dashboard" /></Link>
    </div>
  </>
  )
}

export interface SideNavItemProps {
  name: string;
  icon: ReactElement
}

export function SideNavItem({ icon, name }: SideNavItemProps) {
  return (
    <div className="flex items-center rounded-sm p-2 hover:bg-purple-100 cursor-pointer">
      { icon }
      <p className="ml-2 font-semibold text-base">{name}</p>
    </div>
  )
}