"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getAcronym } from "@/utils";

import {
	CircleDollarSign,
	CreditCard,
	FileSignature,
	Flame,
	HelpCircle,
	Home,
	LogOut,
	Network,
	Settings,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

export default function SideNav() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const handleRedirect = (username?: string) => {
		if (username) router.push(`/profile/${username}`);
	}

	return (
		<>
			<div className="flex gap-2 items-center cursor-pointer">
				<Avatar onClick={() => handleRedirect(session?.user.username)}>
					<AvatarImage src={session?.user.profilePhotoPresignedGet} />
					<AvatarFallback>
						{getAcronym(session?.user.presentationName ?? "")}
					</AvatarFallback>
				</Avatar>
				<p className="text-lg font-bold" onClick={() => handleRedirect(session?.user.username)}>{session?.user.presentationName}</p>
				<LogOut
					onClick={() => signOut()}
					size={38}
					className="ml-auto rounded-sm p-2"
				/>
			</div>

			<Separator className="mt-4 mb-4" />

			<div className="flex flex-col gap-4">
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
				<Link href={"/dashboard"}>
					<SideNavItem icon={<CircleDollarSign />} name="Dashboard" />
				</Link>
				<Link href={"/settings"}>
					<SideNavItem name="Configurações" icon={<Settings />} />
				</Link>
				<Link href={"https://api.whatsapp.com/send?phone=556196286030&text=Gostaria%20de%20um%20aux%C3%ADlio%20na%20plataforma%2C%20poderia%20me%20ajudar%3F"}>
					<SideNavItem name="Ajuda e Suporte" icon={<HelpCircle />} />
				</Link>
			</div>
		</>
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
