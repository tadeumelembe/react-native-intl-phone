# react-native-intl-phone

This is a React Native component for handling phone number input with formatting and validation. This component leverages the libphonenumber-js library to format and validate phone numbers based on country codes.

## ScreenShots
<p align="center">
      <img src="https://github.com/user-attachments/assets/9bdd9dfe-9cb0-4337-b4ef-345c6365f2aa" width="200px" >
      <img src="https://github.com/user-attachments/assets/274fa095-88c5-4b66-8203-602f5e3057b4"  width="200px">
      <img src="https://github.com/user-attachments/assets/08a22237-6184-4fdd-8f54-bb7822d43fa2"  width="200px" >
</p>

## Features

* **Automatic Formatting:** Automatically formats phone numbers as users type based on the selected country code.
* **Validation:** Validates phone numbers to ensure they are valid for the selected country.
* **Country Selection:** Supports selecting country codes from a list of countries.
* **Customizable:** Fully customizable styles and input behavior.

## Installation

```sh
npm install react-native-intl-phone
# or
yarn add react-native-intl-phone
```

Pure JS: no native code, works with Expo and bare React Native (iOS, Android, Web).

## Usage

```tsx
import PhoneInput, { type onChangeItem } from "react-native-intl-phone";

const [phone, setPhone] = useState<onChangeItem>();

<PhoneInput defaultCode="US" onChange={setPhone} placeholder="Phone number" />;
```

## Props

Any other [`TextInput` prop](https://reactnative.dev/docs/textinput#props) (`placeholder`, `onFocus`, `autoFocus`, ...) is passed to the input, except `onChangeText` and `keyboardType`, which the component manages. `ref` is forwarded to the `TextInput`.

### Value and country

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultValue` | `string` | | Initial number. Accepts national digits (`"2015550123"`) or E.164 (`"+12015550123"`). An E.164 number also selects its country. |
| `value` | `string` | | Controlled number, same formats as `defaultValue`. |
| `defaultCode` | `CountryCodes` | `"US"` | Initial country (ISO 3166-1 alpha-2). |
| `countryCode` | `CountryCodes` | | Controlled country. |
| `locale` | `"EN" \| "PT"` | `"EN"` | Language of the country names. |
| `countries` | `CountryCodes[]` | all | Only show these countries in the picker. |
| `excludedCountries` | `CountryCodes[]` | | Hide these countries from the picker. |
| `preferredCountries` | `CountryCodes[]` | | Pin these countries to the top of the picker, in the given order. |

### Callbacks

| Prop | Type | Description |
|---|---|---|
| `onChange` | `(item: onChangeItem) => void` | Called on every change with the country plus `formattedPhone`, `nationalNumber`, `e164`, `isValid` and `numberType`. |
| `onChangeValue` | `(value: string) => void` | Called with the formatted national number. |
| `onChangeCountry` | `(country: CountryCodeType) => void` | Called when the selected country changes. |
| `onPressCountryButton` | `(country: CountryCodeType) => void` | Takes over the country button press. No picker opens; set the new country through `countryCode`. |

### Behavior

| Prop | Type | Default | Description |
|---|---|---|---|
| `codeType` | `"Flag" \| "Dial_Code"` | `"Flag"` | What the country button shows. |
| `showCode` | `boolean` | `true` | Show the dial code before the input. |
| `disabled` | `boolean` | `false` | Disable the input and the country picker. |
| `disableCountryPicker` | `boolean` | `false` | Disable only the country picker. |

### Dropdown

These apply to the built-in dropdown and are ignored when `renderCountryPicker` is set.

| Prop | Type | Default | Description |
|---|---|---|---|
| `showSearch` | `boolean` | `true` | Show the search box. |
| `searchPlaceholder` | `string` | `"Type your country..."` | Placeholder of the search box. |
| `searchPlaceholderTextColor` | `string` | | Placeholder color of the search box. |
| `emptyText` | `string` | `"Country not found"` | Shown when the search has no results. |
| `dropDownOffset` | `number` | `5` | Gap between the input and the dropdown. |
| `dropDownMaxHeight` | `number` | `300` | Maximum height of the dropdown. |

### Custom rendering

| Prop | Type | Description |
|---|---|---|
| `renderCountryButton` | `(country: CountryCodeType, isOpen: boolean) => ReactNode` | Replace the content of the country button. |
| `renderCountryItem` | `(country: CountryCodeType, isSelected: boolean) => ReactNode` | Replace the content of each dropdown row. |
| `renderCountryPicker` | `(props: CountryPickerRenderProps) => ReactNode` | Replace the whole picker (modal, bottom sheet, ...). See [Custom country picker](#custom-country-picker). |

### Styles

| Prop | Type | Description |
|---|---|---|
| `style` | `ViewStyle` | Outer wrapper (also positions the dropdown). |
| `containerStyle` | `ViewStyle` | Bordered row holding the country button and the input. |
| `focusedContainerStyle` | `ViewStyle` | Applied to the container while the input is focused. |
| `disabledContainerStyle` | `ViewStyle` | Applied to the container when `disabled` is true. |
| `countryButtonStyle` | `ViewStyle` | Country button. |
| `countryButtonTextStyle` | `TextStyle` | Flag / dial code text in the country button. |
| `dialCodeTextStyle` | `TextStyle` | Dial code shown before the input (`showCode`). |
| `inputStyle` | `TextStyle` | The `TextInput`. |
| `dropDownStyle` | `ViewStyle` | Dropdown container. |
| `searchInputStyle` | `TextStyle` | Dropdown search box. |
| `itemStyle` | `ViewStyle` | Each dropdown row. |
| `selectedItemStyle` | `ViewStyle` | The selected dropdown row. |
| `itemTextStyle` | `TextStyle` | Country name in a row. |
| `itemDialCodeStyle` | `TextStyle` | Dial code in a row. |
| `emptyTextStyle` | `TextStyle` | The `emptyText` message. |

### Types

```ts
type CountryCodeType = {
  code: CountryCodes;  // "US"
  name: string;        // localized name
  dial_code: string;   // "+1"
  emoji: string;       // "🇺🇸"
};

interface onChangeItem extends CountryCodeType {
  formattedPhone: string;  // "(201) 555-0123"
  nationalNumber: string;  // "2015550123"
  e164: string;            // "+12015550123", "" when empty
  isValid: boolean;
  numberType: NumberType;  // "MOBILE", "FIXED_LINE", ... or undefined
}
```

## Custom country picker

Pass `renderCountryPicker` to replace the built-in dropdown with your own modal, bottom sheet, etc. The component still owns the open state, the localized and filtered country list, and the formatting when the country changes:

```tsx
<PhoneInput
  renderCountryPicker={({ visible, close, countries, selectedCountry, onSelect }) => (
    <MyCountrySheet
      open={visible}
      onDismiss={close}
      data={countries}          // respects locale, countries, excludedCountries, preferredCountries
      selected={selectedCountry.code}
      onPick={onSelect}         // updates the number and closes the picker
    />
  )}
/>
```

It is called on every render, so pickers opened imperatively (e.g. `sheetRef.present()`) can react to `visible` in an effect. See [`example/components/TrueSheetCountryPicker.tsx`](example/components/TrueSheetCountryPicker.tsx) for a native bottom sheet built with [TrueSheet](https://github.com/lodev09/react-native-true-sheet). `searchCountries(countries, term)` is exported if you want the same accent-insensitive search.

To handle the picker completely outside the component (e.g. navigate to a screen), use `onPressCountryButton` and pass the chosen country back through `countryCode`:

```tsx
<PhoneInput
  countryCode={country}
  onPressCountryButton={() => navigation.navigate("CountryPicker", { onPick: setCountry })}
/>
```

## Validation

`onChange` gives you `isValid` and `numberType` (`"MOBILE"`, `"FIXED_LINE"`, ...). They come from [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js) using its full ("max") metadata, so the digits are checked against each country's numbering plan, not just the length.

Treat them as input checks, not proof that the number works:

* **Valid is not the same as reachable.** A valid number can still be unassigned or belong to someone else. Confirm ownership with an SMS / OTP code if it matters.
* **Numbering plans change.** The metadata is bundled with your app and only updates when you ship a new version, so a newly assigned prefix can be reported as invalid. Avoid hard-blocking submission on `isValid` alone, and validate again on your server with an up-to-date libphonenumber.

Dial codes and the list of countries also come from libphonenumber-js; the bundled JSON files only provide the localized country names.

## Development

The library lives in `src/`; `example/` is an Expo app that imports it straight from source.

```sh
yarn               # install root + example workspace
yarn example start # run the example app
yarn test          # unit tests
yarn typecheck
yarn build         # compile to lib/ with react-native-builder-bob
```

## License

MIT
