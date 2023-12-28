import axios from "axios";
import { CommentService } from "./services/comment-service";
import { FollowService } from "./services/follow-service";
import { PostService } from "./services/post-service";
import { ProducerService } from "./services/producer-service";
import { RecommendationService } from "./services/recommendation-service";
import { ReferrerService } from "./services/referrer-service";
import { SubscriptionService } from "./services/subscription-service";
import { CreditCardService } from "./services/credit-card-service";

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
	};
};

export default apiClient;
