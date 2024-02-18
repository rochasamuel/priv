export interface User {
	biography: string;
	canEdit: boolean;
	email: string;
	coverPhotoPresignedGet: string;
	isFollower: boolean;
	isSubscripted: boolean;
	presentationName: string;
	producerId: string;
	profilePhotoPresignedGet: string;
	subscriptionExpirationDate: string;
	subscriptionIdStatusContract: number;
	totalImages: number;
	totalPosts: number;
	totalVideos: number;
	username: string;
	facebook: string;
	instagram: string;
	twitter: string;
	usernameFacebook?: string;
	usernameInstagram?: string;
	usernameTwitter?: string;
}
