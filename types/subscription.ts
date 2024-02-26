export interface Subscription {
	coverPhotoPresignedGet: string;
	expirationDate: string;
	idProducer: string;
	idStatusContract: SubscriptionStatus;
	planType: string;
	presentationName: string;
	profilePhotoPresignedGet: string;
	registrationDate: string;
	username: string;
}

export enum SubscriptionStatus {
	ACTIVE = 1,
	INACTIVE = 2,
}

export interface Subscriber {
	coverPhotoPresignedGet: string;
	expirationDate: string;
	idProducer: string;
	planType: string;
	presentationName: string;
	profilePhotoPresignedGet: string;
	registrationDate: string;
	username: string;
}
