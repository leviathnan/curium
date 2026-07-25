import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { captureRef } from "react-native-view-shot";
import { File } from "expo-file-system";
import * as FileSystemLegacy from "expo-file-system/legacy";
import { Icon, type IconName } from "@/components/ui/Icon";
import { QRCanvas } from "@/components/qr/QRCanvas";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/ui/Toast";
import { Spacing, Radius, FontSize, Fonts } from "@/constants/theme";
import { DEFAULT_QR_STYLE, type QRStyle } from "@/types/qr";
import { QR_COLORS } from "@/constants/theme";
import type { SharedContent } from "@/hooks/useShareIntent";

const RANDOM_STYLES = QR_COLORS.filter((c) => c.id !== "paper");

const EYE_SHAPES: QRStyle["eyeShape"][] = [
  "sharp", "soft", "round", "pill", "dot", "shield", "hexagon", "octagon",
];
const PUPIL_SHAPES: QRStyle["pupilShape"][] = [
  "dot", "square", "diamond", "cross", "hexagon", "octagon", "shield",
  "star", "heart", "blob", "dome", "oval", "pentagon", "scallop", "cloud",
  "droplet", "pixel", "none",
];
const PIXEL_SHAPES: QRStyle["pixelShape"][] = [
  "sharp", "soft", "round", "dots", "liquid", "glued", "smooth", "flow",
  "blob", "diamond", "cross", "star", "triangle", "hexagon", "plus", "heart",
  "sparkle", "pinched-square", "circuit-board", "hashtag",
  "vertical-line", "horizontal-line",
];
const NONE_PROBABILITY = 0.1;
const ENTRANCE_CURVE = Easing.bezier(0.16, 1, 0.3, 1);
const EXIT_CURVE = Easing.bezier(0.4, 0, 1, 1);

interface Props {
  content: SharedContent;
  onDismiss: () => void;
}

export function ShareOverlay({ content, onDismiss }: Props) {
  const { colors, isDark } = useTheme();
  const { width: screenW, height: screenH } = useWindowDimensions();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<View>(null);

  const qrSize = Math.min(screenW - 64, 320);
  const qrValue = content.value;

  const qrStyle = useMemo(
    () => ({
      ...DEFAULT_QR_STYLE,
      fgColor: isDark ? "#fafaf9" : "#1c1917",
      bgColor: isDark ? "#1a1a1e" : "#ffffff",
      eyeColor: isDark ? "#e4e4e7" : "#1c1917",
      pupilColor: isDark ? "#fafaf9" : "#1c1917",
    }),
    [isDark],
  );

  const [activeStyle, setActiveStyle] = useState(qrStyle);

  const shuffleStyle = useCallback(() => {
    const r = RANDOM_STYLES[Math.floor(Math.random() * RANDOM_STYLES.length)];
    const eye = EYE_SHAPES[Math.floor(Math.random() * EYE_SHAPES.length)];
    const pool = PUPIL_SHAPES.filter((p) => p !== "none");
    const weightedPool =
      Math.random() < NONE_PROBABILITY
        ? PUPIL_SHAPES
        : pool;
    const pupil =
      weightedPool[Math.floor(Math.random() * weightedPool.length)];
    const pixel = PIXEL_SHAPES[Math.floor(Math.random() * PIXEL_SHAPES.length)];
    setActiveStyle((prev) => ({
      ...prev,
      colorId: r.id,
      fgColor: r.fg,
      bgColor: r.bg,
      eyeColor: r.fg,
      pupilColor: r.fg,
      eyeShape: eye,
      pupilShape: pupil,
      pixelShape: pixel,
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = withTiming(1, { duration: 260, easing: ENTRANCE_CURVE });
  }, []);

  const dismiss = useCallback(() => {
    enter.value = withTiming(
      0,
      { duration: 160, easing: EXIT_CURVE },
      (finished) => {
        "worklet";
        if (finished) runOnJS(onDismiss)();
      },
    );
  }, [onDismiss]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
  }));

  const copyValue = useCallback(async () => {
    const Clipboard = await import("expo-clipboard");
    await Clipboard.setStringAsync(qrValue);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    toast.success("Copied!", "Content copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  }, [qrValue, toast]);

  const shareQR = useCallback(async () => {
    if (!qrRef.current) return;
    try {
      await new Promise<void>((r) => setTimeout(r, 200));
      const tmpUri = await captureRef(qrRef.current, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      const dest =
        FileSystemLegacy.documentDirectory + `curium_share_${Date.now()}.png`;
      const srcFile = new File(tmpUri);
      const destFile = new File(dest);
      await srcFile.copy(destFile);
      const Sharing = await import("expo-sharing");
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(destFile.uri, { mimeType: "image/png" });
      }
    } catch {
      toast.error("Error", "Could not share QR code.");
    }
  }, [toast]);

  const typeIcon: IconName =
    content.type === "url"
      ? "link-outline"
      : content.type === "image"
        ? "image-outline"
        : "text-outline";

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      <BlurView
        intensity={80}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.2)" }]} />
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={dismiss}
      />
      <Animated.View
        needsOffscreenAlphaCompositing
        renderToHardwareTextureAndroid
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          cardStyle,
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.typeChip,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Icon name={typeIcon} size={13} color={colors.primary} />
              <Text
                style={[
                  styles.typeLabel,
                  { color: colors.primary, fontFamily: Fonts.monoBold },
                ]}
              >
                {content.type.toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={dismiss} hitSlop={10}>
            <Icon name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* QR Code */}
        <View
          ref={qrRef}
          collapsable={false}
          style={[
            styles.qrWrap,
            {
              width: qrSize,
              height: qrSize,
              backgroundColor: activeStyle.bgColor,
              borderRadius: activeStyle.qrCorners,
            },
          ]}
        >
          <QRCanvas
            value={qrValue}
            size={qrSize}
            qrStyle={activeStyle}
            skipAnimation
            logoUri={activeStyle.logoUri}
            logoSize={48}
            logoStyle={activeStyle.logoStyle}
            logoBgColor={activeStyle.bgColor}
            logoPosition={activeStyle.logoPosition}
          />
        </View>

        {/* Shared content preview */}
        <View
          style={[
            styles.preview,
            { backgroundColor: colors.bg, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.previewText,
              { color: colors.textMuted, fontFamily: Fonts.mono },
            ]}
            numberOfLines={2}
          >
            {qrValue}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={shuffleStyle}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.surfaceOffset, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Icon name="shuffle" size={16} color={colors.text} />
            <Text
              style={[
                styles.actionLabel,
                { color: colors.text, fontFamily: Fonts.monoBold },
              ]}
            >
              Shuffle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={copyValue}
            style={[
              styles.actionBtn,
              {
                backgroundColor: copied
                  ? colors.success + "18"
                  : colors.surfaceOffset,
                borderColor: copied ? colors.success + "50" : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Icon
              name={copied ? "checkmark" : "copy-outline"}
              size={16}
              color={copied ? colors.success : colors.text}
            />
            <Text
              style={[
                styles.actionLabel,
                {
                  color: copied ? colors.success : colors.text,
                  fontFamily: Fonts.monoBold,
                },
              ]}
            >
              {copied ? "Copied" : "Copy"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={shareQR}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.surfaceOffset, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Icon name="share-social-outline" size={16} color={colors.text} />
            <Text
              style={[
                styles.actionLabel,
                { color: colors.text, fontFamily: Fonts.monoBold },
              ]}
            >
              Share QR
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  typeLabel: { fontSize: 10, letterSpacing: 1.2 },
  qrWrap: { overflow: "hidden" },
  preview: {
    width: "100%",
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  previewText: { fontSize: FontSize.xs, lineHeight: 18 },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: { fontSize: FontSize.xs },
});
