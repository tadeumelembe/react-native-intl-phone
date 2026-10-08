import CountriesDataEN from "../data/countries-en.json";
import CountriesDataPT from "../data/countries-pt.json";
import { CountriesLocale, CountryCodes, CountryCodeType } from "../types";

const COUNTRIES_BY_LOCALE: Record<CountriesLocale, CountryCodeType[]> = {
  EN: CountriesDataEN as CountryCodeType[],
  PT: CountriesDataPT as CountryCodeType[],
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
