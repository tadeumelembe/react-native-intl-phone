import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  TextInput,
} from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  BORDER_COLOR,
  BORDER_RADIUS,
  DEFAULT_DROPDOWN_MAX_HEIGHT,
  DIVIDER_COLOR,
  SECONDARY_TEXT_COLOR,
  SELECTED_ITEM_COLOR,
} from "./utils/constants";
import { searchCountries } from "./utils/countries";
import { CountryCodeType, DropDownProps } from "./types";

const DropDown = ({
  countries,
  selectedCode,
  onSelect,
  top,
  maxHeight = DEFAULT_DROPDOWN_MAX_HEIGHT,
  showSearch = true,
  searchPlaceholder = "Type your country...",
  searchPlaceholderTextColor = SECONDARY_TEXT_COLOR,
  emptyText = "Country not found",
  renderItem: renderCustomItem,
  dropDownStyle,
  searchInputStyle,
  itemStyle,
  selectedItemStyle,
  itemTextStyle,
  itemDialCodeStyle,
  emptyTextStyle,
}: DropDownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(
    () => searchCountries(countries, searchTerm),
    [countries, searchTerm]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CountryCodeType>) => {
      const isSelected = item.code === selectedCode;
      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${item.name} ${item.dial_code}`}
          onPress={() => onSelect(item)}
          style={[
            styles.itemContainer,
            itemStyle,
            isSelected && [styles.selectedItem, selectedItemStyle],
          ]}
        >
          {renderCustomItem ? (
            renderCustomItem(item, isSelected)
          ) : (
            <>
              <Text style={itemTextStyle}>{item.emoji}</Text>
              <Text style={[styles.itemName, itemTextStyle]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.itemDialCode, itemDialCodeStyle]}>
                {item.dial_code}
              </Text>
            </>
          )}
        </TouchableOpacity>
      );
    },
    [
      selectedCode,
      onSelect,
      renderCustomItem,
      itemStyle,
      selectedItemStyle,
      itemTextStyle,
      itemDialCodeStyle,
    ]
  );

  return (
    <View style={[styles.dropDown, { top, maxHeight }, dropDownStyle]}>
      {showSearch && (
        <TextInput
          style={[styles.searchInput, searchInputStyle]}
          placeholder={searchPlaceholder}
          placeholderTextColor={searchPlaceholderTextColor}
          onChangeText={setSearchTerm}
          value={searchTerm}
          autoCorrect={false}
          autoCapitalize="none"
        />
      )}
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        extraData={selectedCode}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        ListEmptyComponent={
          <Text style={[styles.emptyText, emptyTextStyle]}>{emptyText}</Text>
        }
      />
    </View>
  );
};

export default memo(DropDown);

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: "#fff",
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    width: "100%",
    position: "absolute",
    left: 0,
    zIndex: 10,
    paddingTop: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: DIVIDER_COLOR,
  },
  listContent: {
    paddingVertical: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedItem: {
    backgroundColor: SELECTED_ITEM_COLOR,
  },
  itemName: {
    flex: 1,
  },
  itemDialCode: {
    color: SECONDARY_TEXT_COLOR,
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "800",
    marginVertical: 10,
  },
});
