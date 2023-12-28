
export enum CreditCardFlag {
  AmericanExpress = 'american-express',
  DinersClub = 'diners-club',
  Elo = 'elo',
  HiperCard = 'hipercard',
  MasterCard = 'mastercard',
  Visa = 'visa',
  Unknown = 'Unknown',
}

export interface CreditCard {
	brand: CreditCardFlag;
	cardId: string;
	expiryMonth: string;
	expiryYear: string;
	holderName: string;
	lastDigits: string;
}
