export enum BillingType {
  CREDIT_CARD = 1,
  BOLETO = 2,
  PIX = 3,
}

export interface PaymentPayload {
  billingType: number;
  paymentData: {
    cpfCnpj: string;
    name: string;
    phoneNumber: string;
  };
  productId: string;
}

export interface PaymentResponse {
  billingType: string;
  boleto: string;
  price: number;
  discount: number;
  discountPercentage: number;
  finalPrice: number;
  email: string;
  pix: {
    expiration: string;
    qrCode: string;
  };
}