import { MediaType } from "./post";

export interface Media {
	mediaId: string;
	postId: string;
	registrationDate: string;
	isPublic: boolean;
	mediaTypeId: MediaType;
	presignedUrls: string[];
}
