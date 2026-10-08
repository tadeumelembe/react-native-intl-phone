import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
} from "react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CountryCodes, CountryCodeType, onChangeItem, PhoneInputProps } from "./types";
import DropDown from "./DropDown";
import {
  BORDER_COLOR,
  BORDER_RADIUS,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_DROPDOWN_MAX_HEIGHT,
  DEFAULT_DROPDOWN_OFFSET,
  DEFAULT_INPUT_HEIGHT,
  DEFAULT_LOCALE,
  FOCUSED_BORDER_COLOR,
} from "./utils/constants";
import { filterCountries, findCountry, getCountries } from "./utils/countries";
import { formatPhoneInput, formatPhoneNumber, parseInitialValue } from "./utils/format";

const resolveCountry = (code: CountryCodes | undefined, locale: PhoneInputProps["locale"]) =>
  findCountry(code, locale) ?? findCountry(DEFAULT_COUNTRY_CODE, locale)!;

const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
  (
    {
      defaultValue,
      value,
      defaultCode = DEFAULT_COUNTRY_CODE,
      countryCode,
      locale = DEFAULT_LOCALE,
      codeType = "Flag",
      showCode = true,
      countries,
      excludedCountries,
      preferredCountries,
      disabled = false,
      disableCountryPicker = false,

      onChange,
      onChangeValue,
      onChangeCountry,
      onFocus,
      onBlur,

      style,
      containerStyle,
      focusedContainerStyle,
      disabledContainerStyle,
      countryButtonStyle,
      countryButtonTextStyle,
      dialCodeTextStyle,
      inputStyle,

      dropDownOffset = DEFAULT_DROPDOWN_OFFSET,
      dropDownMaxHeight = DEFAULT_DROPDOWN_MAX_HEIGHT,
      showSearch,
      searchPlaceholder,
      searchPlaceholderTextColor,
      emptyText,
      dropDownStyle,
      searchInputStyle,
      itemStyle,
      selectedItemStyle,
      itemTextStyle,
      itemDialCodeStyle,
      emptyTextStyle,

      renderCountryButton,
      renderCountryItem,
      ...textInputProps
    },
    ref
  ) => {
    const [internalCode, setInternalCode] = useState<CountryCodes>(() => {
      const country = resolveCountry(countryCode ?? defaultCode, locale);
      return parseInitialValue(defaultValue ?? value, country.code, country.dial_code)
        .detectedCountry ?? country.code;
    });
    const selectedCountry = resolveCountry(countryCode ?? internalCode, locale);

    const [nationalNumber, setNationalNumber] = useState(
      () =>
        parseInitialValue(defaultValue ?? value, selectedCountry.code, selectedCountry.dial_code)
          .nationalNumber
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputHeight, setInputHeight] = useState(DEFAULT_INPUT_HEIGHT);

    const phone = useMemo(
      () => formatPhoneNumber(nationalNumber, selectedCountry.code, selectedCountry.dial_code),
      [nationalNumber, selectedCountry.code, selectedCountry.dial_code]
    );

    const countryList = useMemo(
      () =>
        filterCountries(getCountries(locale), {
          countries,
          excludedCountries,
          preferredCountries,
        }),
      [locale, countries, excludedCountries, preferredCountries]
    );

    const changeCountry = useCallback(
      (country: CountryCodeType) => {
        if (countryCode === undefined) setInternalCode(country.code);
        onChangeCountry?.(country);
      },
      [countryCode, onChangeCountry]
    );

    // Sync the controlled value. Accepts national digits, formatted or E.164.
    useEffect(() => {
      if (value === undefined) return;
      const parsed = parseInitialValue(value, selectedCountry.code, selectedCountry.dial_code);
      setNationalNumber(parsed.nationalNumber);
      if (parsed.detectedCountry && parsed.detectedCountry !== selectedCountry.code) {
        const detected = findCountry(parsed.detectedCountry, locale);
        if (detected) changeCountry(detected);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Notify on every change of number or country, but not on mount.
    const isMounted = useRef(false);
    useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      const item: onChangeItem = {
        ...selectedCountry,
        formattedPhone: phone.formattedPhone,
        nationalNumber: phone.nationalNumber,
        e164: phone.e164,
        isValid: phone.isValid,
        numberType: phone.numberType,
      };
      onChange?.(item);
      onChangeValue?.(phone.formattedPhone);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phone]);

    const handleChangeText = (text: string) => {
      const result = formatPhoneInput(
        text,
        selectedCountry.code,
        selectedCountry.dial_code,
        phone.formattedPhone
      );
      if (!result) return;
      if (result.detectedCountry && result.detectedCountry !== selectedCountry.code) {
        const detected = findCountry(result.detectedCountry, locale);
        if (detected) changeCountry(detected);
      }
      setNationalNumber(result.nationalNumber);
    };

    const handleSelectCountry = useCallback(
      (country: CountryCodeType) => {
        setShowDropdown(false);
        if (country.code !== selectedCountry.code) changeCountry(country);
      },
      [selectedCountry.code, changeCountry]
    );

    const handleFocus = (e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
      setIsFocused(true);
      setShowDropdown(false);
      onFocus?.(e);
    };

    const handleBlur = (e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const isPickerDisabled = disabled || disableCountryPicker;

    return (
      <View style={[styles.wrapper, showDropdown && styles.wrapperOpen, style]}>
        <View
          onLayout={({ nativeEvent }) => setInputHeight(nativeEvent.layout.height)}
          style={[
            styles.container,
            containerStyle,
            isFocused && [styles.focusedContainer, focusedContainerStyle],
            disabled && [styles.disabledContainer, disabledContainerStyle],
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Selected country: ${selectedCountry.name}`}
            accessibilityState={{ disabled: isPickerDisabled, expanded: showDropdown }}
            disabled={isPickerDisabled}
            hitSlop={8}
            onPress={() => setShowDropdown((prevState) => !prevState)}
            style={countryButtonStyle}
          >
            {renderCountryButton ? (
              renderCountryButton(selectedCountry, showDropdown)
            ) : (
              <Text style={countryButtonTextStyle}>
                {codeType === "Dial_Code" ? selectedCountry.dial_code : selectedCountry.emoji}
              </Text>
            )}
          </Pressable>

          <View style={styles.inputContainer}>
            {showCode && (
              <Text style={dialCodeTextStyle}>{selectedCountry.dial_code}</Text>
            )}
            <TextInput
              ref={ref}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              editable={!disabled}
              {...textInputProps}
              style={[styles.input, inputStyle]}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={phone.formattedPhone}
            />
          </View>
        </View>
        {showDropdown && (
          <DropDown
            countries={countryList}
            selectedCode={selectedCountry.code}
            onSelect={handleSelectCountry}
            top={inputHeight + dropDownOffset}
            maxHeight={dropDownMaxHeight}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchPlaceholderTextColor={searchPlaceholderTextColor}
            emptyText={emptyText}
            renderItem={renderCountryItem}
            dropDownStyle={dropDownStyle}
            searchInputStyle={searchInputStyle}
            itemStyle={itemStyle}
            selectedItemStyle={selectedItemStyle}
            itemTextStyle={itemTextStyle}
            itemDialCodeStyle={itemDialCodeStyle}
            emptyTextStyle={emptyTextStyle}
          />
        )}
      </View>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  wrapperOpen: {
    zIndex: 1000,
  },
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: DEFAULT_INPUT_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: "hidden",
    gap: 10,
  },
  focusedContainer: {
    borderColor: FOCUSED_BORDER_COLOR,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
