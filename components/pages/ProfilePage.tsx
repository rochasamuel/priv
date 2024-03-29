"use client";

import apiClient from "@/backend-sdk";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import Feed from "../Feed/Feed";
import PostMaker from "../Post/PostMaker";
import AboutCard from "../Profile/AboutCard";
import MediaCard from "../Profile/MediaCard";
import ProfileCard, { ProfileCardSkeleton } from "../Profile/ProfileCard";
import SuggestionList from "../Suggestion/SuggestionList";
import { useMenuStore } from "@/store/useMenuStore";
import useBackendClient from "@/hooks/useBackendClient";
import { useRouter, useSearchParams } from "next/navigation";

interface ProfilePageProps {
  params: { username: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const setPageTitle = useMenuStore((state) => state.setPageTitle);
  const searchParams = useSearchParams();
  const [selectedSection, setSelectedSection] = useState(searchParams.get("section") || "posts");
  const router = useRouter();

  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", params.username],
    queryFn: async () => {
      setPageTitle("Carregando...");
      return await api.profile.getByUsername(params.username);
    },
    onSuccess(data) {
      setPageTitle(data.presentationName);
    },
    enabled: readyToFetch,
  });

  const canMakePosts = useMemo(() => {
    return (
      session?.user.activeProducer && session?.user.approved && session?.user.username === params.username
    );
  }, [session, params]);

  const handleSectionChange = (section: "posts" | "about" | "media") => {
    setSelectedSection(section);
    const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentSearchParams.set("section", section);
    router.push(`${params.username}?${currentSearchParams.toString()}`);
  };

  const renderSection = () => {
    const currentSearchParams = new URLSearchParams(Array.from(searchParams.entries()));

    switch (currentSearchParams.get("section") || "posts") {
      case "posts":
        return (
          <>
            {canMakePosts && <PostMaker />}
            <Feed mode="profile" producerId={user?.producerId!} />
          </>
        );
      case "about":
        return <AboutCard user={user!} />;
      case "media":
        return <MediaCard user={user!} />;
      default:
        return <></>;
    }
  };

  const selectedSessionStyle =
    "text-sm font-bold border-b-2 border-pink-500 transition-all duration-500";

  return (
    <>
      <main className="flex-1 max-w-[96vw] mx-auto md:max-w-2xl">
        {isLoading && <ProfileCardSkeleton />}
        {user && !isLoading && <ProfileCard user={user} />}
        <div className="w-full bg-background z-20 mb-4 flex items-center justify-evenly border rounded-md h-12 py-2 sticky -top-[20px]">
          <div
            className={`cursor-pointer text-sm ${
              selectedSection === "posts" && selectedSessionStyle
            }`}
            onClick={() => handleSectionChange("posts")}
          >
            Publicações
          </div>
          <Separator orientation="vertical" />
          <div
            className={`cursor-pointer text-sm ${
              selectedSection === "about" && selectedSessionStyle
            }`}
            onClick={() => handleSectionChange("about")}
          >
            Sobre mim
          </div>
          <Separator orientation="vertical" />
          <div
            className={`cursor-pointer text-sm ${
              selectedSection === "media" && selectedSessionStyle
            }`}
            onClick={() => handleSectionChange("media")}
          >
            Mídias
          </div>
        </div>
        {user && renderSection()}
      </main>

      <aside className="sticky top-0 hidden w-72 shrink-0 xl:block">
        <p className="text-lg font-bold mb-4">Sugestões pra você</p>
        <SuggestionList />
      </aside>
    </>
  );
}
