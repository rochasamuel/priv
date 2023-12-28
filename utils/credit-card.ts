import { CreditCardFlag } from "@/types/credit-card";

const cardFlagRegex: Map<CreditCardFlag, RegExp> = new Map([
  [CreditCardFlag.AmericanExpress, /^3[47]\d{0,13}$/],
  [CreditCardFlag.DinersClub, /^3(?:0[0-5]|[68]\d)\d{0,11}$/],
  [CreditCardFlag.Elo, /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/],
  [CreditCardFlag.HiperCard, /^(606282\d{0,10}(\d{3})?)|(3841\d{0,12})|(637\d{0,13})$/],
  [CreditCardFlag.MasterCard, /^5[1-5]\d{0,14}$|^2(?:2(?:2[1-9]|[3-9]\d)|[3-6]\d\d|7(?:[01]\d|20))\d{0,12}$/],
  [CreditCardFlag.Visa, /^(?!504175|506699|5067|509|6500|6501|4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|627780|63(6297|6368|6369)|65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8])))4[0-9]{0,12}(?:[0-9]{3})?$/],
]);

export const getCreditCardFlag = (cardNumber: string): CreditCardFlag => {
  for (const [cardType, regex] of cardFlagRegex.entries()) {
    if (cardNumber.trim().replace(/ /g, '').match(regex)) {
      return cardType;
    }
  }

  return CreditCardFlag.Unknown;
}

export const cardLayoutConfig = {
  [CreditCardFlag.AmericanExpress]: { 
    iconSrc: '/amex.png', 
  },
  [CreditCardFlag.DinersClub]: { 
    iconSrc: '/diners.png', 
  },
  [CreditCardFlag.Elo]: { 
    iconSrc: '/elo.png', 
  },
  [CreditCardFlag.HiperCard]: { 
    iconSrc: '/hipercard.png', 
  },
  [CreditCardFlag.MasterCard]: { 
    iconSrc: '/mastercard.png', 
  },
  [CreditCardFlag.Visa]: { 
    iconSrc: '/visa.png', 
  },
  [CreditCardFlag.Unknown]: { 
    iconSrc: '/credit-card.png', 
  },
};