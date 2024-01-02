"use client";

import apiClient from "@/backend-sdk";
import Feed from "@/components/Feed/Feed";
import PostMaker from "@/components/Post/PostMaker";
import ProfileCard, {
	ProfileCardSkeleton,
} from "@/components/Profile/ProfileCard";
import SuggestionList from "@/components/Suggestion/SuggestionList";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { FunctionComponent, useState } from "react";
import { useQuery } from "react-query";

const ProfileComponent = ({ params }: { params: { username: string } }) => {
	const [selectedSession, setSelectedSession] = useState("posts");

	const { data: session } = useSession();
	const { data: user, isLoading } = useQuery({
		queryKey: ["user", params.username],
		queryFn: async () => {
			const api = apiClient(session?.user.accessToken!);

			return await api.profile.getByUsername(params.username);
		},
		enabled: !!session?.user.accessToken,
	});

	const handleSessionChange = (session: "posts" | "about" | "media") => {
		setSelectedSession(session);
	};

	const renderSession = () => {
		switch (selectedSession) {
			case "posts":
				return (
					<>
						<PostMaker />
						<Feed mode="profile" producerId={user?.producerId!} />
					</>
				);
			case "about":
				return <div>about</div>;
			case "media":
				return <div>media</div>;
			default:
				return <></>;
		}
	};
	
	const selectedSessionStyle = "text-sm font-bold border-b-2 border-pink-500 transition-colors duration-500";

	return (
		<>
			<main className="flex-1 h-full">
				{isLoading && <ProfileCardSkeleton />}
				{user && !isLoading && <ProfileCard user={user} />}
				<div className="w-full bg-[#020817] z-20 mb-4 flex items-center justify-evenly border rounded-md h-12 py-2 sticky top-2">
					<div className={`text-sm ${selectedSession === "posts" && selectedSessionStyle}`} onClick={() => handleSessionChange("posts")}>
						Publicações
					</div>
					<Separator orientation="vertical" />
					<div className={`text-sm ${selectedSession === "about" && selectedSessionStyle}`} onClick={() => handleSessionChange("about")}>
						Sobre mim
					</div>
					<Separator orientation="vertical" />
					<div className={`text-sm ${selectedSession === "media" && selectedSessionStyle}`} onClick={() => handleSessionChange("media")}>
						Mídias
					</div>
				</div>
				{user && renderSession()}
			</main>

			<aside className="sticky top-8 hidden w-72 shrink-0 xl:block">
				<p className="text-lg font-bold mb-4">Sugestões pra você</p>
				<SuggestionList />
			</aside>
		</>
	);
};

export default ProfileComponent;
