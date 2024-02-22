export enum MediaType {
	Image = 1,
	Video = 2,
}

export interface PostMedia {
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
	medias: PostMedia[];
}

export interface PostComment {
	comment: string;
	idComment: string;
	idUser: string;
	presentationName: string;
	profilePhotoPresignedGet: string;
	registrationDate: string;
}
