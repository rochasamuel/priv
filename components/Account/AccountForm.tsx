"use client";
import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useMutation, useQuery } from "react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";
import { Textarea } from "../ui/textarea";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { Skeleton } from "../ui/skeleton";

interface AccountFormProps {
  user: User;
}

const AccountForm: FunctionComponent<AccountFormProps> = ({ user }) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const { mutate, isLoading: isSendindRequest } = useMutation({
    mutationFn: async (payload: User) => {
      const api = apiClient(session?.user.accessToken!);
      const result = await api.account.updateUserAccountData(payload);
      return result;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Sucesso!",
        description: "As configurações do usuário foram atualizadas",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Houve um erro ao atualizar as configurações do usuário",
      });
    },
  });

  const formSchema = z.object({
    presentationName: z.string().min(2).max(60),
    username: z.string().min(2).max(30),
    email: z.string().email(),
    facebook: z.string().max(50).optional(),
    instagram: z.string().max(30).optional(),
    twitter: z.string().max(15).optional(),
    biography: z.string().max(2000).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      presentationName: user.presentationName,
      username: user.username,
      email: user.email,
      facebook: user.facebook,
      instagram: user.instagram,
      twitter: user.twitter,
      biography: user.biography,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values as User);
  }

  return (
    <>
      <div className="relative">
        <div className="absolute cursor-pointer top-0 right-0 z-10 p-1 bg-slate-600 rounded-sm opacity-70 flex items-center gap-2 text-sm">
          <ImagePlus color="#FFFFFF" /> Alterar foto de capa
        </div>
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
      </div>
      <div className="p-4 pb-4 mb-12 relative flex flex-col justify-center items-center">
        <div className="absolute cursor-pointer -top-4 z-10 p-1 bg-slate-600 rounded-sm opacity-70">
          <ImagePlus color="#FFFFFF" />
        </div>
        <Avatar className="w-28 h-28 mb-2 border-4 absolute -top-14">
          <AvatarImage src={user.profilePhotoPresignedGet} />
          <AvatarFallback>{getAcronym(user.presentationName)}</AvatarFallback>
        </Avatar>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="presentationName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nome de apresentação</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0} / 60
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0} / 30
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0} / 100
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de usuário" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0} / 100
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de usuário" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0} / 30
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter X</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de usuário" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0} / 15
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="biography"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobre mim</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  {field.value?.length ?? 0} / 20000
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex">
            <Button
              className="w-full md:w-64 md:ml-auto"
              type="submit"
              disabled={isSendindRequest || !form.formState.isDirty}
            >
              {isSendindRequest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde
                </>
              ) : (
                <>
                  Salvar alterações
                  <Save className="ml-2" size={18} />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export const AccountFormSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className="relative">
        <div className="w-full h-20 md:h-36 bg-slate-600 rounded-md aspect-auto animate-pulse" />
      </div>
      <div className="p-4 pb-4 mb-12 relative flex flex-col justify-center items-center">
        <div className="absolute cursor-pointer -top-4 z-10 p-1 bg-slate-600 rounded-sm opacity-70">
          <ImagePlus color="#FFFFFF" />
        </div>
        <Avatar className="w-28 h-28 mb-2 border-4 absolute -top-14">
          <AvatarImage src=""/>
          <AvatarFallback> </AvatarFallback>
        </Avatar>
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <Skeleton className="w-60 h-6 mb-2" />
          <Skeleton className="w-full h-10" />
        </div>

        <div>
          <Skeleton className="w-40 h-6 mb-2 mt-4 md:mt-0" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2 mt-6 ">
        <div>
          <Skeleton className="w-60 h-6 mb-2" />
          <Skeleton className="w-full h-10" />
        </div>

        <div>
          <Skeleton className="w-52 h-6 mb-2 mt-6 md:mt-0" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2 mt-6">
        <div>
          <Skeleton className="w-60 h-6 mb-2" />
          <Skeleton className="w-full h-10" />
        </div>

        <div>
          <Skeleton className="w-40 h-6 mb-2 mt-4 md:mt-0" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>

      <Skeleton className="w-40 h-6 mb-2 mt-4 md:mt-6" />
      <Skeleton className="w-full h-36" />

      <div className="w-full flex">
        <Skeleton className="w-full h-10 ml-auto mt-6 md:w-80" />
      </div>
    </>
  );
};

export default AccountForm;
