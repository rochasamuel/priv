export enum MediaType {
  Image = 1,
  Video = 2
}

export interface Media {
  isPublic: boolean;
  mediaTypeId: MediaType;
  presignedUrls: string[];
}

export interface Producer {
  producerId: string;
  username: string;
  presentationName: string;
  presignedUrlProfile: string;
}

export interface Post {
  canEdit: boolean;
  description: string;
  postId: string;
  producer: Producer;
  registrationDate: string;
  totalLikes: number;
  totalComments: number;
  isLiked: boolean;
  isSaved: boolean;
  medias: Media[];
}