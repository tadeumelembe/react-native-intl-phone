import PhoneInput, { onChangeItem } from "@/components/PhoneInput";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const [phone, setPhone] = useState<onChangeItem>();

  return (
    <View style={styles.container}>
      <Text>Default</Text>
      <PhoneInput onChange={setPhone} placeholder="Phone number" />
      <Text>
        {phone?.e164 || "-"} {phone?.isValid ? "✅" : "❌"}
      </Text>

      <Text>Customized</Text>
      <PhoneInput
        defaultCode="MZ"
        locale="PT"
        codeType="Dial_Code"
        showCode={false}
        preferredCountries={["MZ", "PT", "BR", "AO"]}
        searchPlaceholder="Procurar país..."
        emptyText="País não encontrado"
        containerStyle={styles.customContainer}
        focusedContainerStyle={styles.customContainerFocused}
        countryButtonTextStyle={styles.customCountryText}
        inputStyle={styles.customInput}
        dropDownStyle={styles.customDropDown}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  customContainer: {
    height: 56,
    borderRadius: 28,
    borderColor: "#c7d2fe",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 18,
  },
  customContainerFocused: {
    borderColor: "#4f46e5",
  },
  customCountryText: {
    fontWeight: "700",
    color: "#4f46e5",
  },
  customInput: {
    fontSize: 16,
  },
  customDropDown: {
    borderRadius: 16,
    borderColor: "#c7d2fe",
  },
});
