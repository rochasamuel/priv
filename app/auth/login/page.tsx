import Login from "@/components/Login/Login";

const LoginPage = () => {
	return (
		<div
			className="w-full overflow-y-auto min-h-full flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-36 p-4 
    bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
    from-purple-200 via-[#eedcf5] to-[#ffffff]
    dark:from-purple-900 dark:via-[#2b1932] dark:to-[#18101c]"
		>
			<div className="max-w-[90dvw]">
				<img className="w-full" src="https://d384rvovcanpvp.cloudfront.net/assets/img/logos/logo-white-text.svg" alt="" />
				<div className="lg:text-2xl mt-2">Desfrute do prazer de fazer parte!</div>
			</div>
			<Login />
		</div>
	);
};

export default LoginPage;
