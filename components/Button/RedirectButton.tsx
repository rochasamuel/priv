"use client";

import { useRouter } from "next/navigation";
import { FunctionComponent, ReactElement } from "react";
import { Button } from "../ui/button";

interface RedirectButtonProps {
	destination: string;
	icon: ReactElement;
}

const RedirectButton: FunctionComponent<RedirectButtonProps> = ({
	destination,
	icon,
}) => {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.push(destination)}
			variant="default"
			size="default"
			className="font-bold"
		>
			HOT{icon}
		</Button>
	);
};

export default RedirectButton;
