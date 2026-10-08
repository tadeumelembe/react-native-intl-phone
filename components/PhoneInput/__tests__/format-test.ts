import { formatPhoneInput, parseInitialValue } from "../utils/format";
import { filterCountries, findCountry, getCountries, searchCountries } from "../utils/countries";

describe("formatPhoneInput", () => {
  it("formats national digits for the country", () => {
    expect(formatPhoneInput("2015550123", "US", "+1")).toEqual({
      formattedPhone: "(201) 555-0123",
      nationalNumber: "2015550123",
      e164: "+12015550123",
      isValid: true,
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

  it("does not throw for countries libphonenumber-js does not support", () => {
    expect(formatPhoneInput("12345", "AQ", "+672")?.formattedPhone).toBe("12345");
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
  it("falls back to another locale when a country is missing", () => {
    expect(findCountry("AN", "EN")?.code).toBe("AN");
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
