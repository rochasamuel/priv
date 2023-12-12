"use client";

import { FunctionComponent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe2, Lock, Image, Video } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface PostMakerProps {
  algo?: string;
}

const PostMaker: FunctionComponent<PostMakerProps> = ({}) => {
  const { data: session } = useSession();

  const [postDescription, setPostDescription] = useState("");

  return (
    <div className="max-w-[96vw] m-auto mb-4 md:max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user.profilePhotoPresignedGet} />
              <AvatarFallback>
                {getAcronym(session?.user.presentationName || "Anonymous")}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">Compartilhar com:</div>
            <Select defaultValue="private">
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
        <CardContent>
          <Textarea placeholder="O que está acontecendo?" rows={6} onChange={(e) => setPostDescription(e.target.value)} />
          <div className="text-xs mt-2 text-gray-300">{postDescription.length} / 5000</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-8">
            <div className="cursor-pointer flex gap-2"><Image /> Foto</div>
            <div className="cursor-pointer flex gap-2"><Video /> Vídeo</div>
          </div>
          <Button>Publicar</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostMaker;
