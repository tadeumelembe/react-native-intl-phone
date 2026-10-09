import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { searchCountries, type CountryPickerRenderProps } from "react-native-intl-phone";

/**
 * Country picker backed by a native bottom sheet. TrueSheet is opened
 * imperatively, so `visible` is synced to `present()` / `dismiss()` and a
 * swipe-down dismissal is reported back through `close()`.
 */
export default function TrueSheetCountryPicker({
  visible,
  close,
  countries,
  selectedCountry,
  onSelect,
}: CountryPickerRenderProps) {
  const sheet = useRef<TrueSheet>(null);
  const presented = useRef(false);
  const [search, setSearch] = useState("");

  const results = useMemo(() => searchCountries(countries, search), [countries, search]);

  useEffect(() => {
    if (visible && !presented.current) {
      presented.current = true;
      sheet.current?.present();
    } else if (!visible && presented.current) {
      sheet.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    presented.current = false;
    setSearch("");
    close();
  };

  return (
    <TrueSheet
      ref={sheet}
      detents={[0.6, 1]}
      cornerRadius={24}
      grabber
      scrollable
      onDidDismiss={handleDismiss}
      header={
        <View style={styles.header}>
          <Text style={styles.title}>Select a country</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or dial code"
            placeholderTextColor="#9ca3af"
            autoCorrect={false}
            style={styles.search}
          />
        </View>
      }
    >
      <FlatList
        data={results}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Country not found</Text>}
        renderItem={({ item }) => {
          const isSelected = item.code === selectedCountry.code;
          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.item,
                isSelected && styles.itemSelected,
                pressed && styles.itemPressed,
              ]}
            >
              <Text style={styles.flag}>{item.emoji}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.dialCode}>{item.dial_code}</Text>
            </Pressable>
          );
        }}
      />
    </TrueSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  search: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f3f4f6",
    fontSize: 16,
  },
  list: {
    paddingBottom: 32,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  itemSelected: {
    backgroundColor: "#eef2ff",
  },
  itemPressed: {
    opacity: 0.6,
  },
  flag: {
    fontSize: 22,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
    color: "#6b7280",
  },
  empty: {
    textAlign: "center",
    padding: 24,
    color: "#6b7280",
  },
});
