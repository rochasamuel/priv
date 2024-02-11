"use client";
import ConsumerRegister from "@/components/Register/ConsumerRegister";
import OTPInput from "@/components/Register/OTPInput";
import OTPVerify from "@/components/Register/OTPVerify";
import ProducerRegister from "@/components/Register/ProducerRegister";
import { useSearchParams } from "next/navigation";

const ProducerPage = () => {
	const searchParams = useSearchParams();

	return (
		<div
			className="w-full min-h-dvh flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-36 p-4 
    bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
    from-purple-200 via-[#eedcf5] to-[#ffffff]
    dark:from-purple-900 dark:via-[#2b1932] dark:to-[#18101c]"
		>
			<div className="max-w-[90dvw]">
				<img className="w-full" src="https://d384rvovcanpvp.cloudfront.net/assets/img/logos/logo-white-text.svg" alt="" />
				<div className="lg:text-2xl mt-2">Desfrute do prazer de fazer parte!</div>
			</div>
			{searchParams.get("verify") === "true" ? <OTPVerify /> : <ProducerRegister />}
		</div>
	);
};

export default ProducerPage;
