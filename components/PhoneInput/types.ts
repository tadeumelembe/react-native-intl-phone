import type { ReactNode } from "react";
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

export type CountriesLocale = "PT" | "EN";

export type CountryCodeType = {
  name: string;
  dial_code: string;
  emoji: string;
  code: CountryCodes;
  unicode?: string;
  image?: string;
};

export interface onChangeItem extends CountryCodeType {
  /** National number formatted for the selected country, e.g. "(201) 555-0123". */
  formattedPhone: string;
  /** Digits only, without the dial code, e.g. "2015550123". */
  nationalNumber: string;
  /** Full number in E.164 format, e.g. "+12015550123". Empty string when there are no digits. */
  e164: string;
  /** Whether libphonenumber-js considers the number valid for the selected country. */
  isValid: boolean;
}

export interface DropDownStyles {
  /** Container of the dropdown list. */
  dropDownStyle?: StyleProp<ViewStyle>;
  searchInputStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  itemDialCodeStyle?: StyleProp<TextStyle>;
  emptyTextStyle?: StyleProp<TextStyle>;
}

export interface DropDownProps extends DropDownStyles {
  countries: CountryCodeType[];
  selectedCode?: CountryCodes;
  onSelect: (country: CountryCodeType) => void;
  top: number;
  maxHeight?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: string;
  emptyText?: string;
  renderItem?: (country: CountryCodeType, isSelected: boolean) => ReactNode;
}

export interface PhoneInputProps
  extends DropDownStyles,
    Omit<
      TextInputProps,
      "value" | "defaultValue" | "onChange" | "onChangeText" | "style" | "keyboardType"
    > {
  /** Initial number. Accepts national digits ("2015550123") or E.164 ("+12015550123"). */
  defaultValue?: string;
  /** Controlled number. Same formats as `defaultValue`. */
  value?: string;
  /** Initial country. Defaults to "US". */
  defaultCode?: CountryCodes;
  /** Controlled country. */
  countryCode?: CountryCodes;
  /** Language of the country names. Defaults to "EN". */
  locale?: CountriesLocale;
  /** What the country button shows. Defaults to "Flag". */
  codeType?: "Flag" | "Dial_Code";
  /** Show the dial code before the input. Defaults to true. */
  showCode?: boolean;
  /** Only show these countries in the picker. */
  countries?: CountryCodes[];
  /** Hide these countries from the picker. */
  excludedCountries?: CountryCodes[];
  /** Pin these countries to the top of the picker, in the given order. */
  preferredCountries?: CountryCodes[];
  /** Disable the input and the country picker. */
  disabled?: boolean;
  /** Disable only the country picker. */
  disableCountryPicker?: boolean;

  onChange?: (item: onChangeItem) => void;
  /** Called with the formatted national number. */
  onChangeValue?: (value: string) => void;
  onChangeCountry?: (country: CountryCodeType) => void;

  /** Outer wrapper (also positions the dropdown). */
  style?: StyleProp<ViewStyle>;
  /** Bordered row that holds the country button and the input. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Applied to the container while the input is focused. */
  focusedContainerStyle?: StyleProp<ViewStyle>;
  /** Applied to the container when `disabled` is true. */
  disabledContainerStyle?: StyleProp<ViewStyle>;
  countryButtonStyle?: StyleProp<ViewStyle>;
  countryButtonTextStyle?: StyleProp<TextStyle>;
  dialCodeTextStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;

  /** Gap between the input and the dropdown. Defaults to 5. */
  dropDownOffset?: number;
  /** Defaults to 300. */
  dropDownMaxHeight?: number;
  /** Show the search box in the dropdown. Defaults to true. */
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: string;
  emptyText?: string;

  /** Replace the content of the country button. */
  renderCountryButton?: (country: CountryCodeType, isOpen: boolean) => ReactNode;
  /** Replace the content of each dropdown row. */
  renderCountryItem?: (country: CountryCodeType, isSelected: boolean) => ReactNode;
}

export type CountryCodes =
  | "AC"
  | "AD"
  | "AE"
  | "AF"
  | "AG"
  | "AI"
  | "AL"
  | "AM"
  | "AN"
  | "AO"
  | "AQ"
  | "AR"
  | "AS"
  | "AT"
  | "AU"
  | "AW"
  | "AX"
  | "AZ"
  | "BA"
  | "BB"
  | "BD"
  | "BE"
  | "BF"
  | "BG"
  | "BH"
  | "BI"
  | "BJ"
  | "BL"
  | "BM"
  | "BN"
  | "BO"
  | "BQ"
  | "BR"
  | "BS"
  | "BT"
  | "BW"
  | "BY"
  | "BZ"
  | "CA"
  | "CC"
  | "CD"
  | "CF"
  | "CG"
  | "CH"
  | "CI"
  | "CK"
  | "CL"
  | "CM"
  | "CN"
  | "CO"
  | "CR"
  | "CU"
  | "CV"
  | "CW"
  | "CX"
  | "CY"
  | "CZ"
  | "DE"
  | "DJ"
  | "DK"
  | "DM"
  | "DO"
  | "DZ"
  | "EC"
  | "EE"
  | "EG"
  | "EH"
  | "ER"
  | "ES"
  | "ET"
  | "FI"
  | "FJ"
  | "FK"
  | "FM"
  | "FO"
  | "FR"
  | "GA"
  | "GB"
  | "GD"
  | "GE"
  | "GF"
  | "GG"
  | "GH"
  | "GI"
  | "GL"
  | "GM"
  | "GN"
  | "GP"
  | "GQ"
  | "GR"
  | "GS"
  | "GT"
  | "GU"
  | "GW"
  | "GY"
  | "HK"
  | "HN"
  | "HR"
  | "HT"
  | "HU"
  | "ID"
  | "IE"
  | "IL"
  | "IM"
  | "IN"
  | "IO"
  | "IQ"
  | "IR"
  | "IS"
  | "IT"
  | "JE"
  | "JM"
  | "JO"
  | "JP"
  | "KE"
  | "KG"
  | "KH"
  | "KI"
  | "KM"
  | "KN"
  | "KP"
  | "KR"
  | "KW"
  | "KY"
  | "KZ"
  | "LA"
  | "LB"
  | "LC"
  | "LI"
  | "LK"
  | "LR"
  | "LS"
  | "LT"
  | "LU"
  | "LV"
  | "LY"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MF"
  | "MG"
  | "MH"
  | "MK"
  | "ML"
  | "MM"
  | "MN"
  | "MO"
  | "MP"
  | "MQ"
  | "MR"
  | "MS"
  | "MT"
  | "MU"
  | "MV"
  | "MW"
  | "MX"
  | "MY"
  | "MZ"
  | "NA"
  | "NC"
  | "NE"
  | "NF"
  | "NG"
  | "NI"
  | "NL"
  | "NO"
  | "NP"
  | "NR"
  | "NU"
  | "NZ"
  | "OM"
  | "PA"
  | "PE"
  | "PF"
  | "PG"
  | "PH"
  | "PK"
  | "PL"
  | "PM"
  | "PN"
  | "PR"
  | "PS"
  | "PT"
  | "PW"
  | "PY"
  | "QA"
  | "RE"
  | "RO"
  | "RS"
  | "RU"
  | "RW"
  | "SA"
  | "SB"
  | "SC"
  | "SD"
  | "SE"
  | "SG"
  | "SH"
  | "SI"
  | "SJ"
  | "SK"
  | "SL"
  | "SM"
  | "SN"
  | "SO"
  | "SR"
  | "SS"
  | "ST"
  | "SV"
  | "SX"
  | "SY"
  | "SZ"
  | "TA"
  | "TC"
  | "TD"
  | "TG"
  | "TH"
  | "TJ"
  | "TK"
  | "TL"
  | "TM"
  | "TN"
  | "TO"
  | "TR"
  | "TT"
  | "TV"
  | "TW"
  | "TZ"
  | "UA"
  | "UG"
  | "US"
  | "UY"
  | "UZ"
  | "VA"
  | "VC"
  | "VE"
  | "VG"
  | "VI"
  | "VN"
  | "VU"
  | "WF"
  | "WS"
  | "XK"
  | "YE"
  | "YT"
  | "ZA"
  | "ZM"
  | "ZW";
