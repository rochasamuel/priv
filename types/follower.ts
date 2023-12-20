export interface Follower {
	coverPhotoPresignedGet: string;
	idUser: string;
	isProducer: boolean;
	presentationName: string;
	profilePhotoPresignedGet: string;
	username: string;
}

export interface Following {
	coverPhotoPresignedGet: string;
	idUserProducer: string;
	presentationName: string;
	profilePhotoPresignedGet: string;
	username: string;
}
