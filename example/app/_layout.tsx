import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    // Needed for TrueSheet on web; a pass-through on iOS and Android.
    <TrueSheetProvider>
      <Slot />
    </TrueSheetProvider>
  );
}
