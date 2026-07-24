import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useTheme } from "@/context/ThemeContext";
import { Spacing, Radius, FontSize, Fonts } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEPS = [
  { name: "Expo SDK", license: "MIT", url: "https://expo.dev" },
  { name: "React", license: "MIT", url: "https://react.dev" },
  { name: "React Native", license: "MIT", url: "https://reactnative.dev" },
  { name: "Expo Router", license: "MIT", url: "https://docs.expo.dev/router/introduction" },
  { name: "Phosphor Icons", license: "MIT", url: "https://phosphoricons.com" },
  { name: "React Native Reanimated", license: "MIT", url: "https://docs.swmansion.com/react-native-reanimated" },
  { name: "React Native Gesture Handler", license: "MIT", url: "https://docs.swmansion.com/react-native-gesture-handler" },
  { name: "React Native Screens", license: "MIT", url: "https://github.com/software-mansion/react-native-screens" },
  { name: "React Native Safe Area Context", license: "MIT", url: "https://github.com/th3rdwave/react-native-safe-area-context" },
  { name: "React Native SVG", license: "MIT", url: "https://github.com/software-mansion/react-native-svg" },
  { name: "React Native Camera Tool", license: "MIT", url: "https://github.com/nylxar/react-native-camera-tool" },
  { name: "React Native Permissions", license: "MIT", url: "https://github.com/zoontek/react-native-permissions" },
  { name: "React Native View Shot", license: "MIT", url: "https://github.com/gre/react-native-view-shot" },
  { name: "React Native Worklets", license: "MIT", url: "https://github.com/margelo/react-native-worklets" },
  { name: "Expo Clipboard", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/clipboard" },
  { name: "Expo File System", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/filesystem" },
  { name: "Expo Haptics", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/haptics" },
  { name: "Expo Image Manipulator", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/imagemanipulator" },
  { name: "Expo Image Picker", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/imagepicker" },
  { name: "Expo Media Library", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/medialibrary" },
  { name: "Expo Sharing", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/sharing" },
  { name: "Expo Splash Screen", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/splash-screen" },
  { name: "Expo Status Bar", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/status-bar" },
  { name: "Expo System UI", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/system-ui" },
  { name: "Expo Navigation Bar", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/navigation-bar" },
  { name: "Expo Build Properties", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/build-properties" },
  { name: "Expo Constants", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/constants" },
  { name: "Expo Font", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/font" },
  { name: "Expo Linking", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/linking" },
  { name: "Expo Linear Gradient", license: "MIT", url: "https://docs.expo.dev/versions/latest/sdk/linear-gradient" },
  { name: "AsyncStorage", license: "MIT", url: "https://react-native-async-storage.github.io/async-storage" },
  { name: "QRCode.js", license: "MIT", url: "https://github.com/soldair/node-qrcode" },
  { name: "react-native-qrcode-styled", license: "MIT", url: "https://github.com/nicklaessson/react-native-qrcode-styled" },
  { name: "react-native-qrcode-svg", license: "MIT", url: "https://github.com/nicklaessson/react-native-qrcode-svg" },
];

export default function LicensesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.sm,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          style={[
            styles.backBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Icon name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontFamily: Fonts.monoBold },
          ]}
        >
          License
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.xl,
          paddingTop: Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xxxl,
        }}
      >
        <View style={styles.section}>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.licenseHeader}>
              <Text style={[styles.licenseTitle, { color: colors.text, fontFamily: Fonts.monoBold }]}>
                AGPL v3.0
              </Text>
            </View>
            <Text style={[styles.licenseDesc, { color: colors.textMuted, fontFamily: Fonts.mono }]}>
              Curium is free, open source software. You may redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: Fonts.monoBold }]}
          >
            DEPENDENCIES
          </Text>
          {DEPS.map((dep, i) => (
            <View
              key={dep.name}
              style={[
                styles.depRow,
                { borderBottomColor: colors.border },
                i === DEPS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.depInfo}>
                <Text
                  style={[styles.depName, { color: colors.text, fontFamily: Fonts.mono }]}
                  numberOfLines={1}
                >
                  {dep.name}
                </Text>
                <Text
                  style={[styles.depLicense, { color: colors.textFaint, fontFamily: Fonts.mono }]}
                >
                  {dep.license}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: FontSize.base,
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
    marginLeft: 2,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.md,
  },
  licenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  licenseTitle: {
    fontSize: FontSize.base,
  },
  licenseDesc: {
    fontSize: FontSize.xs,
    lineHeight: 20,
  },
  depRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  depInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  depName: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  depLicense: {
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },
});
