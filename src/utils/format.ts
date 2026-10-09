// "max" metadata: `isValid()` checks the digits against each country's numbering
// plan. The default "min" metadata only checks the length.
import {
  AsYouType,
  NumberType,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from "libphonenumber-js/max";
import { CountryCodes } from "../types";

export interface FormattedPhone {
  formattedPhone: string;
  nationalNumber: string;
  e164: string;
  isValid: boolean;
  numberType: NumberType;
  /** Country detected from an international number ("+44..."), if any. */
  detectedCountry?: CountryCodes;
}

const onlyDigits = (text: string) => text.replace(/\D/g, "");

export const formatPhoneNumber = (digits: string, code: CountryCodes, dialCode: string): FormattedPhone => {
  if (!digits) return { formattedPhone: "", nationalNumber: "", e164: "", isValid: false, numberType: undefined };
  const parsed = parsePhoneNumberFromString(digits, code);
  return {
    formattedPhone: new AsYouType(code).input(digits),
    nationalNumber: digits,
    e164: parsed?.number ?? `${dialCode}${digits}`,
    isValid: parsed?.isValid() ?? false,
    numberType: parsed?.getType(),
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
    // `getNationalNumber` exists at runtime but is missing from the "max" typings.
    const asYouType = new AsYouType() as AsYouType & { getNationalNumber(): string };
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

  if (digits && validatePhoneNumberLength(digits, code) === "TOO_LONG") {
    return null;
  }

  return formatPhoneNumber(digits, code, dialCode);
};

/** Parses an initial/controlled value (national digits or E.164). */
export const parseInitialValue = (value: string | undefined, code: CountryCodes, dialCode: string) =>
  formatPhoneInput(value ?? "", code, dialCode) ?? formatPhoneNumber(onlyDigits(value ?? ""), code, dialCode);
