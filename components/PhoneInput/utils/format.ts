import {
  AsYouType,
  CountryCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from "libphonenumber-js";
import { CountryCodes } from "../types";

export interface FormattedPhone {
  formattedPhone: string;
  nationalNumber: string;
  e164: string;
  isValid: boolean;
  /** Country detected from an international number ("+44..."), if any. */
  detectedCountry?: CountryCodes;
}

const onlyDigits = (text: string) => text.replace(/\D/g, "");

const isSupported = (code: string): code is CountryCode => isSupportedCountry(code);

export const formatPhoneNumber = (digits: string, code: CountryCodes, dialCode: string): FormattedPhone => {
  if (!digits) return { formattedPhone: "", nationalNumber: "", e164: "", isValid: false };
  if (!isSupported(code)) {
    return {
      formattedPhone: digits,
      nationalNumber: digits,
      e164: `${dialCode}${digits}`,
      isValid: false,
    };
  }
  const parsed = parsePhoneNumberFromString(digits, code);
  return {
    formattedPhone: new AsYouType(code).input(digits),
    nationalNumber: digits,
    e164: parsed?.number ?? `${dialCode}${digits}`,
    isValid: parsed?.isValid() ?? false,
  };
};

/**
 * Formats raw input for the given country.
 * Returns `null` when the input should be rejected (number too long).
 */
export const formatPhoneInput = (
  text: string,
  code: CountryCodes,
  dialCode: string,
  previousFormatted = ""
): FormattedPhone | null => {
  // Pasted or autofilled international number: detect the country from it.
  if (text.trim().startsWith("+")) {
    const asYouType = new AsYouType();
    asYouType.input(text);
    const detected = asYouType.getCountry();
    if (detected) {
      return {
        ...formatPhoneNumber(asYouType.getNationalNumber(), detected, `+${asYouType.getCallingCode()}`),
        detectedCountry: detected,
      };
    }
  }

  let digits = onlyDigits(text);

  // Deleting a formatting character ("(", ")", "-", " ") would leave the digits
  // unchanged and the formatter would add it right back, so remove a digit instead.
  if (text.length < previousFormatted.length && digits === onlyDigits(previousFormatted)) {
    digits = digits.slice(0, -1);
  }

  if (digits && isSupported(code) && validatePhoneNumberLength(digits, code) === "TOO_LONG") {
    return null;
  }

  return formatPhoneNumber(digits, code, dialCode);
};

/** Parses an initial/controlled value (national digits or E.164). */
export const parseInitialValue = (value: string | undefined, code: CountryCodes, dialCode: string) =>
  formatPhoneInput(value ?? "", code, dialCode) ?? formatPhoneNumber(onlyDigits(value ?? ""), code, dialCode);
