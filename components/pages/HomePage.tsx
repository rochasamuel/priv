"use client";

import { useSession } from "next-auth/react";
import Feed from "../Feed/Feed";
import PostMaker from "../Post/PostMaker";
import SuggestionList from "../Suggestion/SuggestionList";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import useBackendClient from "@/hooks/useBackendClient";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
	const router = useRouter();

  const canMakePosts = useMemo(() => {
    return session?.user.activeProducer && session?.user.approved;
  }, [session]);

  const { data: producerRegisterState } = useQuery({
    queryKey: "producerRegisterState",
    queryFn: async () => {
      return await api.producer.getProducerRegisterState();
    },
    enabled: readyToFetch,
  });

  const shouldResumeRegister = useMemo(() => {
		if(producerRegisterState && !session?.user.approved) {
			return (
				// !producerRegisterState.idDocumentStatus ||
				// !producerRegisterState.idProducerDocument ||
				// !producerRegisterState.idUserProducer
				!producerRegisterState.idProducerDocument
			);
		}

		return false;
  }, [producerRegisterState, session?.user.approved]);

	const redirectToRegister = useCallback(() => {
		if(producerRegisterState) {
			if (!producerRegisterState.idProducerDocument) {
				router.push("auth/register/producer/documents");
			}
			// if (!producerRegisterState.idUserProducer) {
			// 	router.push("auth/register/producer/address?resume=true");
			// } else if (!producerRegisterState.idProducerDocument) {
			// 	router.push("auth/register/producer/documents");
			// }
		}
	}, [producerRegisterState, router]);

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
