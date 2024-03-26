import { User } from "@/types/user";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { Button } from "../ui/button";
import {
  Cog,
  FileEdit,
  Loader2,
  MessageCircle,
  MessageCircleMore,
  PenLine,
  UserRoundCheck,
  UserRoundPlus,
  Video,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import { useToast } from "../ui/use-toast";
import apiClient from "@/backend-sdk";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import PlansDialog from "../Plan/PlansDialog";
import Link from "next/link";
import useBackendClient from "@/hooks/useBackendClient";
import { SubscriptionStatus } from "@/types/subscription";

interface ProfileCardProps {
  user: User;
}

const ProfileCard: FunctionComponent<ProfileCardProps> = ({ user }) => {
  const [openPlansDialog, setOpenPlansDialog] = useState(false);

  const { data: session } = useSession();

  const isOwn = useMemo(
    () => session?.user?.userId === user.producerId,
    [user, session]
  );

  const handleOpenPlansDialog = useCallback(() => {
    setOpenPlansDialog(true);
  }, []);

  const handleClosePlansDialog = useCallback(() => {
    setOpenPlansDialog(false);
  }, []);

  return (
    <>
      <div className="max-w-[96vw] m-auto mb-4 md:max-w-2xl">
        <Card className="p-0">
          <CardHeader className="mb-0 p-0">
            {user.coverPhotoPresignedGet ? (
              <img
                src={user.coverPhotoPresignedGet}
                alt="Foto de capa"
                onError={(e) => {}}
                className="w-full h-full object-cover rounded-md aspect-auto"
              />
            ) : (
              <div className="w-full h-20 bg-slate-600 rounded-md aspect-auto" />
            )}
          </CardHeader>
          <CardContent className="p-4 pb-4 relative flex flex-col justify-center items-center">
            <Avatar className="w-28 h-28 mb-2 border-4 absolute -top-14">
              <AvatarImage src={user.profilePhotoPresignedGet} />
              <AvatarFallback>
                {getAcronym(user.presentationName)}
              </AvatarFallback>
            </Avatar>

            <div className="mt-14">
              <CardTitle className="text-xl">{user.presentationName}</CardTitle>
            </div>
            <div className="text-sm">@{user.username}</div>

            <div className="mt-4 flex justify-center flex-wrap sm:justify-between gap-2">
              {isOwn && (
                <>
                  <Link prefetch href="/settings/plans">
                    <Button>
                      Planos <FileEdit className="ml-2" size={17} />
                    </Button>
                  </Link>
                  <Link prefetch href="/settings/account">
                    <Button variant={"secondary"}>
                      Perfil <Cog className="ml-2" size={18} />
                    </Button>
                  </Link>
                </>
              )}

              {!isOwn && (
                <>
                  {user.isSubscripted ? (
                    <Button className="w-auto">Ver assinatura</Button>
                  ) : (user.subscriptionIdStatusContract === SubscriptionStatus.ACTIVE && !user.subscriptionExpirationDate) ? (
                    <Button className="w-auto" onClick={handleOpenPlansDialog}>
                      Aguardando pagamento <Clock className="ml-2" size={18} />
                    </Button>
                  ): (
                    <Button className="w-auto" onClick={handleOpenPlansDialog}>
                      Assinar <PenLine className="ml-2" size={18} />
                    </Button>
                  )}

                  <FollowButton user={user} />
                </>
              )}

              <Button variant={"outline"}>
                <MessageCircleMore size={18} />
              </Button>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="cursor-pointer flex items-center gap-2">
                <ImageIcon size={28} /> {user.totalImages}
              </div>
              <div className="cursor-pointer flex items-center gap-2">
                <Video size={28} /> {user.totalVideos}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {openPlansDialog && (
        <PlansDialog user={user} closePlansDialog={handleClosePlansDialog} />
      )}
    </>
  );
};

interface FollowButtonProps {
  user: User;
}

export const FollowButton = ({ user }: FollowButtonProps) => {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const { toast } = useToast();

  const [isFollowing, setIsFollowing] = useState(user.isFollower);

  const {
    isLoading: loadingFollow,
    variables,
    mutate,
  } = useMutation({
    mutationFn: async (producerId: string) => {
      const result = await api.profile.toggleFollow(producerId);
      return result;
    },
    onSuccess: (data) => {
      setIsFollowing(!isFollowing);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro executar a ação",
        description: "Tente novamente mais tarde",
      });
    },
  });

  return (
    <>
      {isFollowing ? (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant={"secondary"}>
              Seguindo{" "}
              {loadingFollow ? (
                <Loader2 className="ml-2 animate-spin" size={18} />
              ) : (
                <UserRoundCheck className="ml-2" size={18} />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[96vw] lg:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Ao deixar de seguir @{user.username}, você não receberá mais os
                conteúdos postados neste perfil.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => mutate(user.producerId)}>
                Deixar de seguir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button variant={"secondary"} onClick={() => mutate(user.producerId)}>
          Seguir{" "}
          {loadingFollow ? (
            <Loader2 className="ml-2 animate-spin" size={18} />
          ) : (
            <UserRoundPlus className="ml-2" size={18} />
          )}
        </Button>
      )}
    </>
  );
};

export const ProfileCardSkeleton = () => {
  return (
    <div className="max-w-[96vw] m-auto mb-4 md:max-w-2xl">
      <Card className="p-0">
        <CardHeader className="mb-0 p-0">
          <div className="w-full h-24 bg-slate-600 rounded-md aspect-auto" />
        </CardHeader>
        <CardContent className="p-4 pb-4 relative flex flex-col justify-center items-center">
          <Avatar className="w-28 h-28 mb-2 border-4 absolute -top-14">
            <AvatarImage src={""} />
            <AvatarFallback> </AvatarFallback>
          </Avatar>

          <div className="mt-14">
            <Skeleton className="w-52 h-6" />
          </div>

          <div className="mt-4 flex gap-2">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-6 h-6" />
          </div>

          <div className="mt-4 flex gap-4">
            <div className="cursor-pointer flex items-center gap-2">
              <Skeleton className="w-8 h-8" /> <Skeleton className="w-6 h-6" />
            </div>
            <div className="cursor-pointer flex items-center gap-2">
              <Skeleton className="w-8 h-8" /> <Skeleton className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
