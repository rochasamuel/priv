import axios from "axios";
import { CommentService } from "./services/comment-service";
import { FollowService } from "./services/follow-service";
import { PostService } from "./services/post-service";
import { ProducerService } from "./services/producer-service";
import { RecommendationService } from "./services/recommendation-service";
import { ReferrerService } from "./services/referrer-service";
import { SubscriptionService } from "./services/subscription-service";
import { CreditCardService } from "./services/credit-card-service";
import { ProfileService } from "./services/profile-service";
import { PlanService } from "./services/plan-service";
import { AccountService } from "./services/account-service";
import { TransactionService } from "./services/transaction-service";
import { MetricService } from "./services/metric-service";
import { ChatService } from "./services/chat-service";
import { AuthService } from "./services/auth-service";
import { PaymentService } from "./services/payment-service";
import { useSession } from "next-auth/react";

const defaultHeaders = {
	"X-Api": 1,
	"X-TimeZone": "America/Sao_Paulo",
};

export const apiClient = (accessToken?: string) => {
	const httpClient = axios.create({
		baseURL: "https://privatus-homol.automatizai.com.br/",
		headers: {
			...defaultHeaders,
			Authorization: accessToken && `Bearer ${accessToken}`,
			"Access-Control-Allow-Origin": "*",
		},
	});

	return {
		post: PostService(httpClient),
		subscription: SubscriptionService(httpClient),
		follow: FollowService(httpClient),
		reccomendation: RecommendationService(httpClient),
		comment: CommentService(httpClient),
		producer: ProducerService(httpClient),
		referrer: ReferrerService(httpClient),
		creditCard: CreditCardService(httpClient),
		profile: ProfileService(httpClient),
		plan: PlanService(httpClient),
		account: AccountService(httpClient),
		transaction: TransactionService(httpClient),
		metrics: MetricService(httpClient),
		chat: ChatService(httpClient),
		auth: AuthService(httpClient),
		payment: PaymentService(httpClient),
	};
};

export default apiClient;
