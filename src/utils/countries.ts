import { getCountries as getSupportedCountries, getCountryCallingCode } from "libphonenumber-js/max";
import CountryNamesEN from "../data/countries-en.json";
import CountryNamesPT from "../data/countries-pt.json";
import { CountriesLocale, CountryCodes, CountryCodeType } from "../types";

type CountryName = { code: string; name: string };

/** Builds the flag emoji from the two regional indicator symbols of the code. */
export const getFlagEmoji = (code: string) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));

const SUPPORTED_COUNTRIES = new Set<string>(getSupportedCountries());

// Names come from the localized JSON (already sorted); dial codes and the list
// of supported countries always come from libphonenumber-js.
const buildCountries = (names: CountryName[]): CountryCodeType[] =>
  names
    .filter((el): el is { code: CountryCodes; name: string } => SUPPORTED_COUNTRIES.has(el.code))
    .map(({ code, name }) => ({
      code,
      name,
      dial_code: `+${getCountryCallingCode(code)}`,
      emoji: getFlagEmoji(code),
    }));

const COUNTRIES_BY_LOCALE: Record<CountriesLocale, CountryCodeType[]> = {
  EN: buildCountries(CountryNamesEN),
  PT: buildCountries(CountryNamesPT),
};

export const getCountries = (locale: CountriesLocale = "EN"): CountryCodeType[] =>
  COUNTRIES_BY_LOCALE[locale] ?? COUNTRIES_BY_LOCALE.EN;

/** Looks the country up in the given locale, falling back to the other locales. */
export const findCountry = (
  code: CountryCodes | undefined,
  locale: CountriesLocale = "EN"
): CountryCodeType | undefined => {
  if (!code) return undefined;
  const sources = [getCountries(locale), ...Object.values(COUNTRIES_BY_LOCALE)];
  for (const source of sources) {
    const country = source.find((el) => el.code === code);
    if (country) return country;
  }
  return undefined;
};

interface FilterOptions {
  countries?: CountryCodes[];
  excludedCountries?: CountryCodes[];
  preferredCountries?: CountryCodes[];
}

export const filterCountries = (
  data: CountryCodeType[],
  { countries, excludedCountries, preferredCountries }: FilterOptions
): CountryCodeType[] => {
  let result = data;
  if (countries?.length) {
    const allowed = new Set(countries);
    result = result.filter((el) => allowed.has(el.code));
  }
  if (excludedCountries?.length) {
    const excluded = new Set(excludedCountries);
    result = result.filter((el) => !excluded.has(el.code));
  }
  if (preferredCountries?.length) {
    const preferred = preferredCountries
      .map((code) => result.find((el) => el.code === code))
      .filter((el): el is CountryCodeType => !!el);
    const preferredSet = new Set(preferred.map((el) => el.code));
    result = [...preferred, ...result.filter((el) => !preferredSet.has(el.code))];
  }
  return result;
};

const normalize = (text: string) => {
  const lower = text.toLocaleLowerCase().trim();
  try {
    return lower.normalize("NFD").replace(/[̀-ͯ]/g, "");
  } catch {
    return lower;
  }
};

/** Matches by name (accent-insensitive), ISO code or dial code. */
export const searchCountries = (data: CountryCodeType[], term: string) => {
  const query = normalize(term);
  if (!query) return data;
  const digits = query.replace(/\D/g, "");
  return data.filter(
    (el) =>
      normalize(el.name).includes(query) ||
      el.code.toLowerCase() === query ||
      (!!digits && el.dial_code.replace(/\D/g, "").startsWith(digits))
  );
};
