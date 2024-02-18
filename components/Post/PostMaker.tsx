"use client";

import { getAcronym } from "@/utils";
import { useSession } from "next-auth/react";
import { FunctionComponent, createRef, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import apiClient from "@/backend-sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post } from "@/types/post";
import {
  Globe2,
  Image,
  ImageIcon,
  Loader2,
  Lock,
  Pencil,
  Video,
  X,
} from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { Label } from "../ui/label";
import ImageCropper from "../Cropper/ImageCropper";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { CropperRef } from "react-mobile-cropper";
import useBackendClient from "@/hooks/useBackendClient";
interface PostMakerProps {
  algo?: string;
}

export interface PresignedUrl {
  url: string;
  fields: {
    [key: string]: string;
  };
}

export interface MediaToSend {
  mimeType: string;
  id: string;
  isPublic: boolean;
}

const PostMaker: FunctionComponent<PostMakerProps> = ({ algo }) => {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [postDescription, setPostDescription] = useState("");
  const [postPrivacy, setPostPrivacy] = useState("private");
  const [postMedias, setPostMedias] = useState(null);
  const [presignedUrls, setPresignedUrls] = useState<PresignedUrl[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    isLoading: isLoadingPublishPost,
    variables,
    isSuccess,
    mutate: createPost,
  } = useMutation({
    mutationFn: (postData: {
      postDescription: string;
      postMedias?: MediaToSend[];
    }) => {
      return api.post.createPost(postData.postDescription, postData.postMedias);
    },
    onSuccess: async (data: any) => {
      setPresignedUrls(data.result.medias);
      await apiClient(session?.user.accessToken!).post.uploadFiles(data.result.medias, files, setUploadProgress);
      queryClient.refetchQueries(["posts", session?.user.email, "feed", undefined]);
      setUploadProgress(0); //reset progress
      setFiles([]); //clear files
      setPostDescription(""); //clear post description
      toast({
        variant: "default",
        title: "Sucesso",
        description: "Seu post está sendo processado, após alguns segundos ele estará disponível",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir comentário",
        description: "Tente novamente mais tarde",
      });
      console.error(error);
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [currentEditingImage, setCurrentEditingImage] = useState<File | null>(
    null
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      const updatedFiles = [...files];
      for (let i = 0; i < selectedFiles.length; i++) {
        updatedFiles.push(selectedFiles[i]);
      }
      setFiles(updatedFiles);
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleFinishCrop = (blob: Blob) => {
    const updatedFiles = [...files];
    updatedFiles[files.indexOf(currentEditingImage!)] = new File(
      [blob],
      currentEditingImage!.name,
      { type: currentEditingImage!.type }
    );
    setFiles(updatedFiles);
    setOpenImageCropper(false);
  };

  const getMediasToSendFromFiles = () => {
    return files.map((file) => {
      return {
        mimeType: file.type,
        id: crypto.randomUUID(),
        isPublic: postPrivacy === "public",
        resolution: file.type.startsWith('video') ? '1280 x 720' : undefined
      };
    });
  }

  return (
    <div className="max-w-[96vw] m-auto mb-4 md:max-w-2xl">
      <Card className="p-0">
        <CardHeader className="mb-0 p-4">
          <CardTitle className="flex items-center gap-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user.profilePhotoPresignedGet} />
              <AvatarFallback>
                {getAcronym(session?.user.presentationName || "Anonymous")}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm min-w-max">Compartilhar com:</div>
            <Select
              onValueChange={(value) => setPostPrivacy(value)}
              defaultValue="private"
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent defaultValue={"private"}>
                <SelectItem value="private">
                  <div className="flex items-center">
                    Assinantes <Lock className="text-pink-600 ml-2" size={14} />
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center">
                    Todos <Globe2 className="text-pink-600 ml-2" size={14} />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pb-2">
          <Textarea
            placeholder="O que está acontecendo?"
            rows={6}
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
          />
          <div className="text-xs mt-2 text-gray-300">
            {postDescription.length} / 5000
          </div>
          {files.length > 0 && (
            <div className="w-full flex gap-2 mt-4 flex-wrap">
              {files.map((file, index) => (
                <div
                  className="w-36 min-w-20 h-32 border relative rounded-sm p-1"
                  key={index + 1}
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      className="w-full object-cover h-full rounded-[2px]"
                      src={URL.createObjectURL(file)}
                      alt="preview"
                    />
                  ) : (
                    <video
                      controls={false}
                      className="w-full object-cover h-full rounded-[2px] pointer-events-none"
                      src={URL.createObjectURL(file)}
                    />
                  )}
                  <Button
                    className="p-1 w-6 h-6 absolute top-2 right-2 bg-black bg-opacity-80"
                    type="button"
                    disabled={isLoadingPublishPost}
                    variant={"outline"}
                    onClick={() => handleDeleteFile(index)}
                  >
                    <X size={12} />
                  </Button>
                  {file.type.startsWith('image') && <Button
                    className="p-1 w-6 h-6 absolute bottom-2 left-2 bg-black bg-opacity-80"
                    type="button"
                    disabled={isLoadingPublishPost}
                    variant={"outline"}
                    onClick={() => {
                      setCurrentEditingImage(file);
                      setOpenImageCropper(true);
                    }}
                  >
                    <Pencil size={12} />
                  </Button>}
                </div>
              ))}
            </div>
          )}
          {openImageCropper && (
            <ImageCropperDialog
              src={URL.createObjectURL(currentEditingImage!)}
              closeCropper={() => setOpenImageCropper(false)}
							saveCrop={handleFinishCrop}
            />
          )}

        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <div className="flex gap-8">
            <label htmlFor="image-input" className="cursor-pointer flex gap-2">
              <ImageIcon /> Foto
            </label>
            <input
              onChange={handleFileInputChange}
              id="image-input"
              className="hidden"
              type="file"
              accept="image/*"
              multiple
            />

            <label htmlFor="video-input" className="cursor-pointer flex gap-2">
              <Video /> Vídeo
            </label>
            <input
              onChange={handleFileInputChange}
              id="video-input"
              className="hidden"
              type="file"
              accept="video/*"
              multiple
            />
          </div>
          <Button
            disabled={(postDescription.length <= 0 && files.length <= 0) || isLoadingPublishPost}
            onClick={() => createPost({ postDescription, postMedias: getMediasToSendFromFiles() })}
          >
            {isLoadingPublishPost ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando
              </>
            ) : (
              <>Publicar</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface ImageCropperDialogProps {
  closeCropper: () => void;
  saveCrop: (blob: Blob) => void;
  src: string;
}

const ImageCropperDialog = ({ closeCropper, saveCrop,  src }: ImageCropperDialogProps) => {
	const cropperRef = createRef<CropperRef>();

	const handleSaveCrop = () => {
		if (cropperRef.current) {
			cropperRef.current.getCanvas()?.toBlob((blob) => {
				if (blob) {
					saveCrop(blob);
				}
			});
		}
	}

  return (
    <Dialog defaultOpen onOpenChange={closeCropper}>
      <DialogContent className="max-w-screen-md h-dvh flex flex-col gap-4 px-4 md:max-w-[50vw] md:h-auto md:max-h-[90dvh] lg:max-w-[45vw]">
				<ImageCropper imageSrc={src} ref={cropperRef} />
				<Button className="" onClick={handleSaveCrop}>Salvar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PostMaker;
