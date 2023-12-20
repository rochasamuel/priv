"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const PostModal = () => {
	const router = useRouter();

	return <div>Post sozinho</div>;
};

export default PostModal;
