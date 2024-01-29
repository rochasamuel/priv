export interface SocialMetric {
	metricDate: string;
	totalFollowers: number;
	totalSubscriptions: number;
}

export interface ProfitMetrics {
	metricDate: string;
	totalProfit: number;
}

export interface UserTransaction {
	description: string;
	idTransaction: string;
	netValue: number;
	plataformTax: number;
	status: string;
	transactionDate: string;
	value: number;
}
