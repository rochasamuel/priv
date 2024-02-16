"use client";
import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { FunctionComponent, createRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
import { Dialog, DialogContent } from "../ui/dialog";
import { CropperRef, FixedCropperRef } from "react-advanced-cropper";
import AccountImageCropper from "../Cropper/AccountImageCropper";

interface AccountFormProps {
  user: User;
}

const AccountForm: FunctionComponent<AccountFormProps> = ({ user }) => {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const [isCoverCropperOpen, setIsCoverCropperOpen] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState<Blob>();
  const [isProfileCropperOpen, setIsProfileCropperOpen] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<Blob>();
  const queryClient = useQueryClient();

  const { mutate, isLoading: isSendindRequest } = useMutation({
    mutationFn: async (payload: User) => {
      const api = apiClient(session?.user.accessToken!);
      const payloadToSend = {
        ...payload,
        profilePhotoOption: selectedProfileImage ? 1 : undefined,
        coverPhotoOption: selectedCoverImage ? 1 : undefined,
      };
      const result = await api.account.updateUserAccountData(payloadToSend);
      return result;
    },
    onSuccess: async (data, variables) => {
      const coverPresignedUrl = data.cover;
      const profilePresignedUrl = data.profile;

      if (coverPresignedUrl) {
        await apiClient(session?.user.accessToken!).account.uploadAccountImage(
          coverPresignedUrl,
          selectedCoverImage!
        );
      }
      
      if (profilePresignedUrl) {
        await apiClient(session?.user.accessToken!).account.uploadAccountImage(
          profilePresignedUrl,
          selectedProfileImage!
          );
      }

      updateSession({ user: { ...variables, profilePhotoPresignedGet: user.profilePhotoPresignedGet } });
      queryClient.refetchQueries(["user", session?.user.userId]);

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

  const handleCoverImageFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedCoverImage(e.target.files[0]);
      setIsCoverCropperOpen(true);
    }
  };

  const saveCoverImageCrop = (blob: Blob) => {
    setIsCoverCropperOpen(false);
    setSelectedCoverImage(blob);
    user.coverPhotoPresignedGet = URL.createObjectURL(blob);
  };

  const handleProfileImageFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedProfileImage(e.target.files[0]);
      setIsProfileCropperOpen(true);
    }
  };

  const saveProfileImageCrop = (blob: Blob) => {
    setIsProfileCropperOpen(false);
    setSelectedProfileImage(blob);
    user.profilePhotoPresignedGet = URL.createObjectURL(blob);
  };

  return (
    <>
      {isCoverCropperOpen && selectedCoverImage ? (
        <ImageCropperDialog
          type="cover"
          saveCrop={saveCoverImageCrop}
          closeCropper={() => setIsCoverCropperOpen(false)}
          src={URL.createObjectURL(selectedCoverImage)}
        />
      ) : null}
      {isProfileCropperOpen && selectedProfileImage ? (
        <ImageCropperDialog
          type="profile"
          saveCrop={saveProfileImageCrop}
          closeCropper={() => setIsProfileCropperOpen(false)}
          src={URL.createObjectURL(selectedProfileImage)}
        />
      ) : null}
      <div className="relative">
        <div className="absolute cursor-pointer top-0 right-0 z-10 p-1 bg-slate-600 rounded-sm opacity-70 flex items-center gap-2 text-sm">
          <label
            htmlFor="cover-image-input"
            className="cursor-pointer flex gap-2"
          >
            <ImagePlus color="#FFFFFF" /> Alterar foto de capa
          </label>
          <input
            onChange={handleCoverImageFileInputChange}
            id="cover-image-input"
            className="hidden"
            type="file"
            accept="image/*"
            multiple
          />
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
          <label
            htmlFor="profile-image-input"
            className="cursor-pointer flex gap-2"
          >
            <ImagePlus color="#FFFFFF" />
          </label>
          <input
            onChange={handleProfileImageFileInputChange}
            id="profile-image-input"
            className="hidden"
            type="file"
            accept="image/*"
            multiple
          />
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
              disabled={isSendindRequest || (!form.formState.isDirty && !selectedCoverImage && !selectedProfileImage) }
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

interface ImageCropperDialogProps {
  closeCropper: () => void;
  saveCrop: (blob: Blob) => void;
  src: string;
  type?: "cover" | "profile";
}

const ImageCropperDialog = ({
  closeCropper,
  saveCrop,
  src,
  type,
}: ImageCropperDialogProps) => {
  const cropperRef = createRef<CropperRef>();

  const handleSaveCrop = () => {
    if (cropperRef.current) {
      cropperRef.current.getCanvas()?.toBlob((blob) => {
        if (blob) {
          saveCrop(blob);
        }
      });
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={closeCropper}>
      <DialogContent className="max-w-screen-md h-dvh flex flex-col gap-4 px-4 md:max-w-[50vw] md:h-auto md:max-h-[90dvh] lg:max-w-[45vw]">
        <AccountImageCropper imageSrc={src} type={type} ref={cropperRef} />
        <Button className="" onClick={handleSaveCrop}>
          Salvar
        </Button>
      </DialogContent>
    </Dialog>
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
          <AvatarImage src="" />
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
