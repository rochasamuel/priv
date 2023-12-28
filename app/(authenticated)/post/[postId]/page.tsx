"use client";
import SuggestionList from "@/components/Suggestion/SuggestionList";
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

	return (
		<>
			<main className="flex-1 h-full">
				{/* <Feed mode="feed" /> */}
			</main>

			<aside className="sticky top-8 hidden w-72 shrink-0 xl:block">
				<p className="text-lg font-bold mb-4">Sugestões pra você</p>
				<SuggestionList />
			</aside>
		</>
	);
};

export default PostModal;
