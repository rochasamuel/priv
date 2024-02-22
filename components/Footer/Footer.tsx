export default function Footer() {
	return (
		<footer className="border-t h-20 flex justify-around p-2">
			<div className="text-xs flex flex-col justify-center items-center gap-1">
				<a href="/">© {new Date().getFullYear()} Privatus</a>
				<a href="/public/privacy-policy">Política de Privacidade</a>
				<a href="/public/help">Ajuda</a>
			</div>
			<div className="text-xs flex flex-col justify-center items-center gap-1">
				<a href="/public/terms">Termos de Uso</a>
				<a href="/public/cookies">Política de Cookies</a>
			</div>
		</footer>
	);
}
