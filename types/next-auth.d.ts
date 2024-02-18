import NextAuth from "next-auth/next";

declare module "next-auth" {
	interface Session {
		user: {
			accessToken?: string;
			refreshToken?: string;
			email?: string;
			userId?: string;
			username: string;
			presentationName: string;
			email: string;
			role: string;
			approved: boolean;
			banned: boolean;
			activeProducer: boolean;
			activeUser: boolean;
			hasDocuments: boolean;
			hasRejectedDocument: boolean;
			hasPendingDocument: boolean;
			hasActiveBank: boolean;
			producerTax: number;
			roles: string[];
			profilePhotoPresignedGet: string;
			referrerCode: string;
		};
	}
}
