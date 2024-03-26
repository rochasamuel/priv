import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Subscription, SubscriptionStatus } from "@/types/subscription";
import { getAcronym } from "@/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlansDialog from "../Plan/PlansDialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Trash, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import useBackendClient from "@/hooks/useBackendClient";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { api } = useBackendClient();
  const queryClient = useQueryClient();
  const [openPlansDialog, setOpenPlansDialog] = useState(false);
  const [openSubscriptionCancelDialog, setOpenSubscriptionCancelDialog] =
    useState(false);

  const { mutate: cancelSubscription, isLoading } = useMutation({
    mutationFn: async () => {
      const result = await api.subscription.cancelSubscription(
        subscription.idProducer
      );
      return result;
    },
    onSuccess: async () => {
      toast({
        title: "Sucesso!",
        description: `Sua inscrição foi para ${subscription.presentationName} (@${subscription.username}) foi cancelada.`,
      });
      await queryClient.refetchQueries(["subscriptions", session?.user.email]);
			setOpenSubscriptionCancelDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar inscrição",
        description: error.response.data.message,
        variant: "destructive",
      });
			setOpenSubscriptionCancelDialog(false);
    },
  });

  const handleClosePlansDialog = () => {
    setOpenPlansDialog(false);
  };

  return (
    <div className="w-full rounded-sm border-[1px] mt-4 mb-4 pb-4">
      <div className="w-full flex flex-col items-center rounded-sm">
        {subscription.coverPhotoPresignedGet ? (
          <img
            className="w-full object-cover rounded-sm h-20"
            src={subscription.coverPhotoPresignedGet}
            alt=""
          />
        ) : (
          <div className="w-full h-20 bg-gray-200 rounded-sm" />
        )}
        <Avatar className="w-16 h-16 -mt-8 border-cyan-50 border-2">
          <AvatarImage src={subscription.profilePhotoPresignedGet} />
          <AvatarFallback>
            {getAcronym(subscription.presentationName)}
          </AvatarFallback>
        </Avatar>

        <Link
          className="text-sm font-medium mt-2"
          prefetch
          href={`/profile/${subscription.username}`}
        >
          {subscription.presentationName}
        </Link>
        <Link
          className="text-xs"
          prefetch
          href={`/profile/${subscription.username}`}
        >
          @{subscription.username}
        </Link>

        {subscription.idStatusContract === SubscriptionStatus.ACTIVE &&
          subscription.expirationDate && (
            <>
              <Badge className="mt-4 bg-primary">
                Ativa [{subscription.planType}]
              </Badge>

              <AlertDialog
                open={openSubscriptionCancelDialog}
                onOpenChange={setOpenSubscriptionCancelDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className="text-xs h-6 text-white underline"
                    variant={"link"}
                  >
                    Cancelar assinatura
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[96vw] lg:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja cancelar a assinatura?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao cancelar sua assinatura você está ciente de que não
                      terá mais acesso aos conteúdos postados por{" "}
                      {subscription.presentationName} (@{subscription.username})
                      a partir da data final do contrato.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button disabled={isLoading} onClick={() => cancelSubscription()}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Aguarde
                        </>
                      ) : (
                        <>Tenho certeza</>
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        {subscription.idStatusContract === SubscriptionStatus.ACTIVE &&
          !subscription.expirationDate && (
            <Badge className="mt-4 bg-secondary">Aguardando pagamento</Badge>
          )}
        {subscription.idStatusContract === SubscriptionStatus.INACTIVE && (
          <Button
            onClick={() => setOpenPlansDialog(true)}
            className="mt-4"
            size={"sm"}
          >
            Reativar
          </Button>
        )}

        {subscription.idStatusContract === SubscriptionStatus.ACTIVE &&
          subscription.registrationDate &&
          subscription.expirationDate && (
            <p className="text-xs mt-4 flex">
              Inscrição em:{" "}
              {DateTime.fromISO(subscription.registrationDate).toFormat(
                "dd/MM/yyyy"
              )}{" "}
              e Expira em:{" "}
              {DateTime.fromISO(subscription.expirationDate).toFormat(
                "dd/MM/yyyy"
              )}
            </p>
          )}

        {subscription.idStatusContract === SubscriptionStatus.INACTIVE &&
          subscription.registrationDate &&
          subscription.expirationDate && (
            <p className="text-xs mt-4 flex">
              {DateTime.fromISO(subscription.expirationDate).diffNow('days').days < 0 ? "Expirou em" : "Expira em"}: {" "}
              {DateTime.fromISO(subscription.expirationDate).toFormat(
                "dd/MM/yyyy"
              )}
            </p>
          )}
      </div>
      {openPlansDialog && (
        <PlansDialog
          user={{
            presentationName: subscription.presentationName,
            producerId: subscription.idProducer,
          }}
          closePlansDialog={handleClosePlansDialog}
        />
      )}
    </div>
  );
};

export const SubscriptionCardSkeleton = () => {
  return (
    <div className="w-full rounded-sm border-[1px] mt-4 mb-4 pb-4">
      <div className="w-full flex flex-col items-center rounded-sm">
        <Skeleton className="w-full h-20 rounded-sm bg-muted" />
        <Avatar className="w-16 h-16 -mt-8 border-cyan-50 border-2">
          <AvatarImage src="" />
          <AvatarFallback />
        </Avatar>

        <p className="text-sm font-medium mt-2">
          <Skeleton className="animate-pulse w-44 h-4 rounded-sm" />
        </p>
        <p className="text-xs">
          <Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
        </p>

        <Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
        <Button className="text-xs h-6" variant={"link"}>
          <Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
        </Button>

        <p className="text-xs mt-4 flex">
          <Skeleton className="animate-pulse w-36 h-3 rounded-sm mt-2" />
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
