import type { ReactNode } from "react";
import {
  Modal,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { colors, s } from "./theme";

export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  label,
}: {
  children: ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [
        s.button,
        secondary && s.secondary,
        disabled && s.disabled,
        (hovered || pressed) && s.hovered,
      ]}
    >
      <Text style={[s.buttonText, secondary && s.secondaryText]}>{children}</Text>
    </Pressable>
  );
}

export function Chip({
  children,
  active,
  onPress,
}: { children: ReactNode; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
        s.chip,
        active && s.chipActive,
        hovered && s.hovered,
      ]}
    >
      <Text style={[s.chipText, active && s.chipTextActive]}>{children}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ flexGrow: 1, flexShrink: 1, minWidth: 0 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...props}
        style={[s.input, props.style]}
      />
    </View>
  );
}

export function Badge({ children, warning = false }: { children: ReactNode; warning?: boolean }) {
  return (
    <View style={[s.badge, warning && { backgroundColor: colors.dangerLight }]}>
      <Text style={[s.badgeText, warning && { color: colors.danger }]}>{children}</Text>
    </View>
  );
}

export function Dialog({
  title,
  children,
  onClose,
}: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View
          role="dialog"
          aria-modal
          accessibilityLabel={title}
          accessibilityViewIsModal
          style={s.modal}
        >
          <View style={s.between}>
            <Text accessibilityRole="header" style={s.subheading}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tutup dialog"
              onPress={onClose}
              hitSlop={8}
              style={{
                minWidth: 40,
                minHeight: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, color: colors.muted }}>×</Text>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 18 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function Empty({
  title,
  detail,
  symbol,
}: { title: string; detail: string; symbol?: string }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        {symbol ? (
          <Text style={{ color: colors.brown, fontSize: 26, fontFamily: "serif" }}>{symbol}</Text>
        ) : (
          <Image
            source={require("../assets/logo-mark.png")}
            style={{ width: 37, height: 32 }}
            resizeMode="contain"
          />
        )}
      </View>
      <Text style={[s.text, { fontWeight: "600", textAlign: "center" }]}>{title}</Text>
      <Text style={[s.muted, { textAlign: "center", maxWidth: 240 }]}>{detail}</Text>
    </View>
  );
}
