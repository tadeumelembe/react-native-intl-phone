import { formatPhoneInput, parseInitialValue } from "../utils/format";
import { getCountries as getSupportedCountries } from "libphonenumber-js/max";
import { filterCountries, findCountry, getCountries, searchCountries } from "../utils/countries";

describe("formatPhoneInput", () => {
  it("formats national digits for the country", () => {
    expect(formatPhoneInput("2015550123", "US", "+1")).toEqual({
      formattedPhone: "(201) 555-0123",
      nationalNumber: "2015550123",
      e164: "+12015550123",
      isValid: true,
      numberType: "FIXED_LINE_OR_MOBILE",
    });
  });

  it("rejects numbers that are too long", () => {
    expect(formatPhoneInput("20155501239999", "US", "+1")).toBeNull();
  });

  it("deletes a digit when backspacing over a formatting character", () => {
    // "(201)" -> user deletes ")" -> "(201"
    expect(formatPhoneInput("(201", "US", "+1", "(201)")?.nationalNumber).toBe("20");
  });

  it("detects the country from a pasted international number", () => {
    const result = formatPhoneInput("+44 7400 123456", "US", "+1");
    expect(result?.detectedCountry).toBe("GB");
    expect(result?.nationalNumber).toBe("7400123456");
    expect(result?.e164).toBe("+447400123456");
  });

  it("validates digits, not just length (max metadata)", () => {
    // Right length for Mozambique, but 81 is not an assigned prefix ("min" metadata says valid).
    expect(formatPhoneInput("811234567", "MZ", "+258")?.isValid).toBe(false);
    expect(formatPhoneInput("841234567", "MZ", "+258")).toMatchObject({
      isValid: true,
      numberType: "MOBILE",
    });
  });

  it("formats +1 countries with the area code in the national number", () => {
    expect(formatPhoneInput("8765551234", "JM", "+1")).toMatchObject({
      formattedPhone: "(876) 555-1234",
      e164: "+18765551234",
    });
  });

  it("detects +1 countries from a pasted number", () => {
    expect(formatPhoneInput("+1 876 555 1234", "US", "+1")?.detectedCountry).toBe("JM");
  });

  it("returns an empty result for empty input", () => {
    expect(formatPhoneInput("", "US", "+1")?.e164).toBe("");
  });
});

describe("parseInitialValue", () => {
  it("accepts E.164 values", () => {
    expect(parseInitialValue("+12015550123", "PT", "+351")).toMatchObject({
      nationalNumber: "2015550123",
      detectedCountry: "US",
    });
  });
});

describe("countries", () => {
  it("takes dial codes from libphonenumber-js", () => {
    expect(findCountry("GY")?.dial_code).toBe("+592");
    expect(findCountry("KZ")?.dial_code).toBe("+7");
    expect(findCountry("KY")?.dial_code).toBe("+1");
    expect(findCountry("JM")?.dial_code).toBe("+1");
  });

  it("builds flags from the country code", () => {
    expect(findCountry("IQ", "PT")?.emoji).toBe("🇮🇶");
  });

  it("lists exactly the countries libphonenumber-js supports, in every locale", () => {
    const supported = getSupportedCountries().sort();
    expect(getCountries("EN").map((el) => el.code).sort()).toEqual(supported);
    expect(getCountries("PT").map((el) => el.code).sort()).toEqual(supported);
  });

  it("filters, excludes and pins preferred countries", () => {
    const list = filterCountries(getCountries("EN"), {
      countries: ["US", "PT", "MZ", "BR"],
      excludedCountries: ["BR"],
      preferredCountries: ["MZ"],
    });
    expect(list.map((el) => el.code)).toEqual(["MZ", "PT", "US"]);
  });

  it("searches accent-insensitively and by dial code", () => {
    const pt = getCountries("PT");
    expect(searchCountries(pt, "afeganistao")[0].code).toBe("AF");
    expect(searchCountries(pt, "+258").map((el) => el.code)).toContain("MZ");
  });
});
