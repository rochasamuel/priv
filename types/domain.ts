export enum AccountTypeId {
  ContaCorrente = 1,
  ContaPoupanca = 2,
}

export enum PixKeyTypeId {
  CPFCNPJ = 1,
  Email = 2,
  Celular = 3,
  ChaveAleatoria = 4,
}

export interface BankDomain {
  accountTypes: AccountType[];
  pixKeyTypes: PixKeyType[];
  banks: Bank[];
}

export interface AccountType {
  accountTypeId: AccountTypeId;
  accountTypeName: string;
}

export interface PixKeyType {
  pixKeyTypeId: PixKeyTypeId;
  pixKeyTypeName: string;
}

export interface Bank {
  bankId: number;
  bankName: string;
  bankCode: string;
}
