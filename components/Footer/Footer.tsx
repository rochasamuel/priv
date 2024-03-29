import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t h-20 flex justify-around p-2">
			<div className="text-xs flex flex-col justify-center items-center gap-1">
				<Link href="/" target="_blank">© {new Date().getFullYear()} Privatus</Link>
				<Link href="/privacy" target="_blank">Política de Privacidade</Link>
				<Link href="/help" target="_blank">Ajuda</Link>
			</div>
			<div className="text-xs flex flex-col justify-center items-center gap-1">
				<Link href="/terms" target="_blank">Termos de Uso</Link>
				<Link href="/cookies" target="_blank">Política de Cookies</Link>
			</div>
		</footer>
	);
}
