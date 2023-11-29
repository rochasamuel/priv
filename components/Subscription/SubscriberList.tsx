import apiClient from "@/backend-sdk";
import { Input } from "@/components/ui/input";
import { Subscriber } from "@/types/subscription";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import SubscriberCard, { SubscriberCardSkeleton } from "./SubscriberCard";

const SubscriberList = () => {
  const [searchTerm, setSeachTerm] = useState("");

  const { data: session, status } = useSession();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["subscribers", session?.user.email],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.subscription.getSubscribers();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!session?.user.email,
  });

  const searchResult = useMemo(() => {
    if (!searchTerm) return subscribers;

    const termToSearch = searchTerm.toLowerCase();

    return subscribers?.filter((subscriber: Subscriber) => {
      return (
        subscriber.username.toLowerCase().includes(termToSearch) ||
        subscriber.presentationName.toLowerCase().includes(termToSearch)
      );
    });
  }, [subscribers, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeachTerm(e.target.value);
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center">
        <Input
          onChange={handleSearch}
          className="mr-2"
          type="search"
          placeholder="Nome ou usuário"
        />
        <Search />
      </div>
      <div className="mt-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <SubscriberCardSkeleton key={index} />
          ))
        ) : (
          <>
            {searchResult?.map((subscriber: Subscriber, index) => (
              <SubscriberCard key={index} subscriber={subscriber} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriberList;
