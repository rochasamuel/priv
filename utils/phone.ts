import { isValidNumberForRegion, parsePhoneNumber } from 'libphonenumber-js'

export const isValidNumber = (phone: string) => {
  if(!phone.match(/61[9]\d{8}/)) return false;
  return isValidNumberForRegion(phone, 'BR');
}