import PhoneInput, { onChangeItem } from "react-native-intl-phone";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

      <Text>Custom picker (modal)</Text>
      <PhoneInput
        defaultCode="PT"
        renderCountryPicker={({ visible, close, countries, selectedCountry, onSelect }) => (
          <Modal visible={visible} animationType="slide" onRequestClose={close}>
            <SafeAreaView style={styles.modal}>
              <Pressable onPress={close} style={styles.modalClose}>
                <Text>Close</Text>
              </Pressable>
              <FlatList
                data={countries}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => onSelect(item)}
                    style={[
                      styles.modalItem,
                      item.code === selectedCountry.code && styles.modalItemSelected,
                    ]}
                  >
                    <Text>
                      {item.emoji} {item.name} ({item.dial_code})
                    </Text>
                  </Pressable>
                )}
              />
            </SafeAreaView>
          </Modal>
        )}
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
  modal: {
    flex: 1,
  },
  modalClose: {
    alignSelf: "flex-end",
    padding: 16,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalItemSelected: {
    backgroundColor: "#eef2ff",
  },
});
