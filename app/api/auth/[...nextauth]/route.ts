import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
	providers: [
		CredentialProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const tokenResponse = (
					await axios.post(
						"https://privatus-homol.automatizai.com.br/token",
						{
							username: credentials?.email,
							password: credentials?.password,
							client_id: "autenticador",
							grant_type: "password",
						},
						{
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
							},
						},
					)
				).data;

				const userResponse: any = (
					await axios.get(
						"https://privatus-homol.automatizai.com.br/users/me",
						{
							headers: {
								Authorization: `Bearer ${tokenResponse.access_token}`,
							},
						},
					)
				).data;

				const user = {
					accessToken: tokenResponse.access_token,
					refreshToken: tokenResponse.refresh_token,
					...userResponse.user,
				};

				if (user) {
					return { ...user };
				}

				return null;
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: process.env.VERCEL_ENV === "production" ? (60 * 60 * 24 * 2) : (60 * 60),
	},
	callbacks: {
		jwt: async ({ token, user, session, trigger }) => {
			const customUser = user as unknown as any;

			// update token and session on sessionUpdate
			if (trigger === "update") {
				token = { ...token, ...session.user };
			}

			if (user) {
				return {
					...token,
					...customUser,
				};
			}

			return token;
		},
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					accessToken: token.accessToken,
					refreshToken: token.refreshToken,
					username: token.username,
					userId: token.userId,
					presentationName: token.presentationName,
					email: token.email,
					role: token.role,
					approved: token.approved,
					banned: token.banned,
					activeProducer: token.activeProducer,
					activeUser: token.activeUser,
					hasDocuments: token.hasDocuments,
					hasRejectedDocument: token.hasRejectedDocument,
					hasPendingDocument: token.hasPendingDocument,
					hasActiveBank: token.hasActiveBank,
					producerTax: token.producerTax,
					roles: token.roles,
					profilePhotoPresignedGet: token.profilePhotoPresignedGet,
					referrerCode: token.referrerCode,
				},
			};
		},
	},
	pages: {
		signIn: "/auth/login",
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
