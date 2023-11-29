import apiClient from "@/backend-sdk";
import { Input } from "@/components/ui/input";
import { Follower, Following } from "@/types/follower";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import FollowerCard, { FollowerCardSkeleton } from "./FollowerCard";

const FollowerList = () => {
  const [searchTerm, setSeachTerm] = useState("");

  const { data: session, status } = useSession();

  const { data: followers, isLoading } = useQuery({
    queryKey: ["followers", session?.user.email],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.follow.getFollowers();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!session?.user.email,
  });

  const searchResult = useMemo(() => {
    if (!searchTerm) return followers;

    const termToSearch = searchTerm.toLowerCase();

    return followers?.filter((follower: Follower) => {
      return (
        follower.username.toLowerCase().includes(termToSearch) ||
        follower.presentationName.toLowerCase().includes(termToSearch)
      );
    });
  }, [followers, searchTerm]);

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
          Array.from({ length: 10 }).map((_, index) => <FollowerCardSkeleton key={index} />)
        ) : (
          <>
            {searchResult?.map((follower: Follower) => (
              <FollowerCard key={follower.idUser} follower={follower} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FollowerList;
