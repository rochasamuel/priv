export interface Balance {
	balance: number;
	currentWithdrawTax: number;
	lastWithdrawStatus: number;
	lockedBalance: number;
	nextUnlock?: number;
	unlockedBalance: number;
}