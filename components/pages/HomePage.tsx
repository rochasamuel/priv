"use client";

import { Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Feed from "../Feed/Feed";
import PostMaker from "../Post/PostMaker";
import SuggestionList from "../Suggestion/SuggestionList";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export default function HomePage() {
  const { data: session } = useSession();
	const router = useRouter();

  const canMakePosts = useMemo(() => {
    return session?.user.activeProducer && session?.user.approved;
  }, [session]);

  const shouldResumeRegister = useMemo(() => {
		if(session?.user.activeProducer && !session?.user.approved) {
			return (
				!session.user.hasDocuments ||
				!session.user.hasAddress
			);
		}

		return false;
  }, [session]);

	const redirectToRegister = useCallback(() => {
		if(session) {
			if (!session.user.hasAddress) {
				router.push("auth/register/producer/address");
			} else if (!session.user.hasDocuments) {
        router.push("auth/register/producer/documents");
      }
		}
	}, [router, session]);

  return (
    <>
      <main className="flex-1 h-full">
        {shouldResumeRegister && <Alert className="max-w-[96vw] mx-auto mb-4  md:max-w-2xl">
          <Info className="h-4 w-4" />
          <AlertTitle>Você não terminou o seu cadastro de produtor!</AlertTitle>
          <AlertDescription>
            Clique no botão abaixo para completar o cadastro de onde você parou.
            <br />
            <Button onClick={redirectToRegister} className="mt-2">Voltar ao cadastro</Button>
          </AlertDescription>
        </Alert>}
        {canMakePosts && <PostMaker />}
        <Feed mode="feed" />
      </main>

      <aside className="sticky top-0 hidden w-72 shrink-0 xl:block">
        <p className="text-lg font-bold mb-4">Sugestões pra você</p>
        <SuggestionList />
      </aside>
    </>
  );
}
