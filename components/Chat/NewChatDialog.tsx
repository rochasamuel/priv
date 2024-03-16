import apiClient from "@/backend-sdk";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/types/post";
import { Loader2, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../ui/use-toast";
import IconInput from "../Input/IconInput";
import { SearchResult } from "@/backend-sdk/services/producer-service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { ContactSearchResult } from "@/backend-sdk/services/chat-service";
import { useRouter } from "next/navigation";
import useBackendClient from "@/hooks/useBackendClient";
import { useChatStore } from "@/store/useChatStore";

interface NewChatDialogProps {
  closeComments: () => void;
}

const NewChatDialog = ({ closeComments }: NewChatDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { api, readyToFetch } = useBackendClient();

  const setMessages = useChatStore((state) => state.setMessages);

	const router = useRouter();

  const { toast } = useToast();

  const { data: session } = useSession();

  const {
    data: searchResut,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["search-contacts", searchTerm, session?.user.username],
    queryFn: async () => {
      return await api.chat.searchContacts(searchTerm);
    },
    enabled: searchTerm.length > 0 && readyToFetch,
    retry: false,
    staleTime: 1000
  });

	const { mutate: createChat } = useMutation({
    mutationFn: async (idUser: string) => {
      const api = apiClient(session?.user.accessToken!);
      const result = await api.chat.createChat(idUser);
      return result;
    },
    onSuccess: (idUser) => {
      setMessages(undefined);
      router.push(`/chats/conversation/${idUser}`);
    },
    onError: (error) => {
    },
  });

  return (
    <Dialog defaultOpen onOpenChange={closeComments}>
      {/* <DialogTrigger>{trigger}</DialogTrigger> */}
      <DialogContent className="max-w-screen-md h-dvh flex flex-col px-4 md:max-w-[50vw] md:h-auto md:max-h-[90dvh] lg:max-w-[45vw]">
        <DialogHeader>
          <DialogTitle>Nova conversa</DialogTitle>
        </DialogHeader>
        <IconInput
          autoFocus={false}
          icon={<Search size={22} />}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Nome ou usuário"
        />
        {isLoading &&
          <div className="text-gray-500 flex items-center justify-center w-full mt-2">
            Buscando contatos
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </div>}
          {searchResut && <div className="w-full flex flex-col h-full gap-3 overflow-y-auto">
            {searchResut?.map((searchResult: ContactSearchResult) => (
              <div
                key={searchResult.idUser}
                className="flex items-center cursor-pointer"
								onClick={() => createChat(searchResult.idUser)}
              >
                <Avatar>
                  <AvatarImage src={searchResult.avatarReference} />
                  <AvatarFallback>
                    {getAcronym(searchResult.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-4">
                  <p className="font-medium line-clamp-1">
                    {searchResult.name}
                  </p>
                </div>
              </div>
            ))}
          </div>}
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
