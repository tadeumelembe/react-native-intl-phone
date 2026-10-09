import type { ReactNode } from "react";
import type { CountryCode, NumberType } from "libphonenumber-js/max";
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

export type CountriesLocale = "PT" | "EN";

/** Country codes supported by libphonenumber-js, e.g. "US". */
export type CountryCodes = CountryCode;

export type CountryCodeType = {
  code: CountryCodes;
  /** Localized country name. */
  name: string;
  /** Country calling code from libphonenumber-js, e.g. "+1". */
  dial_code: string;
  emoji: string;
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
  /** "MOBILE", "FIXED_LINE", "FIXED_LINE_OR_MOBILE", "TOLL_FREE", ... or undefined when unknown. */
  numberType: NumberType;
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

export interface CountryPickerRenderProps {
  visible: boolean;
  close: () => void;
  /** Countries in the selected locale, after `countries` / `excludedCountries` / `preferredCountries`. */
  countries: CountryCodeType[];
  selectedCountry: CountryCodeType;
  /** Selects the country (reformatting the number and firing the change callbacks) and closes the picker. */
  onSelect: (country: CountryCodeType) => void;
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
  /**
   * Replace the whole country picker (modal, bottom sheet, ...). Called on every
   * render, use `visible` to show or hide it. The built-in dropdown props are ignored.
   */
  renderCountryPicker?: (props: CountryPickerRenderProps) => ReactNode;
  /**
   * Take over the country button press, e.g. to navigate to your own screen.
   * No picker is opened; set the country back through `countryCode`.
   */
  onPressCountryButton?: (country: CountryCodeType) => void;
}
