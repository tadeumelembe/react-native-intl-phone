# React Native Phone Lib Input (On going project)

This is a React Native component for handling phone number input with formatting and validation. This component leverages the libphonenumber-js library to format and validate phone numbers based on country codes.

## ScreenShots
<p align="center">
      <img src="https://github.com/user-attachments/assets/9bdd9dfe-9cb0-4337-b4ef-345c6365f2aa" width="200px" >
      <img src="https://github.com/user-attachments/assets/274fa095-88c5-4b66-8203-602f5e3057b4"  width="200px">
      <img src="https://github.com/user-attachments/assets/08a22237-6184-4fdd-8f54-bb7822d43fa2"  width="200px" >
</p>

## Features

* **Automatic Formatting:** Automatically formats phone numbers as users type based on the selected country code.
* **Validation: Validates:** phone numbers to ensure they are valid for the selected country.
* **Country Selection:** Supports selecting country codes from a list of countries.
* **Customizable:** Fully customizable styles and input behavior.

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

It is called on every render, so pickers opened imperatively (e.g. `sheetRef.present()`) can react to `visible` in an effect. `searchCountries(countries, term)` is exported if you want the same accent-insensitive search.

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

...
