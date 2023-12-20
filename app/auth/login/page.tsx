import Login from "@/components/Login/Login";

const LoginPage = () => {
	return (
		<div
			className="w-full min-h-screen flex items-center justify-center p-4 
    bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
    from-purple-200 via-[#eedcf5] to-[#ffffff]
    dark:from-purple-900 dark:via-[#2b1932] dark:to-[#18101c]"
		>
			<Login />
		</div>
	);
};

export default LoginPage;
