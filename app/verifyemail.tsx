import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useOrientation } from "@/hooks/useOrientation";
import { BrandButton } from "@/components/BrandButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";



// --- Animated OTP Box ---
const OtpBox = ({
  value,
  inputRef,
  onChangeText,
  onFocus,
  onBlur,
  focused,
}: {
  value: string;
  inputRef: (ref: TextInput | null) => void;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}) => {
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    focusProgress.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused]);

  const animatedBox = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      ["#ccc", Colors.brand.primary]
    ),
    shadowOpacity: focusProgress.value * 0.25,
    shadowRadius: focusProgress.value * 8,
    elevation: focusProgress.value * 4,
  }));

  return (
    <Animated.View style={[styles.codeInputWrapper, animatedBox]}>
      <TextInput
        ref={inputRef}
        style={styles.codeInput}
        maxLength={1}
        keyboardType="numeric"
        onChangeText={onChangeText}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Animated.View>
  );
};

export default function VerifyEmail() {
  const { scale } = useOrientation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();
  const { email } = useLocalSearchParams();

  // Countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert_confirmation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (data.status === "ok") {
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          router.replace("/");
        }, 3000);
      } else if (data.status === "not ok") {
        alert("❌ Invalid OTP. Please try again.");
      } else {
        alert("⚠️ Unexpected response. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      alert("❌ You have reached the maximum resend attempts.");
      return;
    }
    try {
      setIsResendDisabled(true);
      setTimer(60);
      const response = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data?.otp) {
        setResendCount((prev) => prev + 1);
        alert("📧 A new OTP has been sent to your email.");
      } else {
        alert(data?.message || "⚠️ Failed to resend OTP. Try again later.");
        setIsResendDisabled(false);
      }
    } catch (error) {
      alert("Failed to resend OTP. Try again later.");
      setIsResendDisabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: 20 * scale, paddingVertical: 20 * scale }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24 * scale} color={Colors.brand.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { fontSize: Typography.sizes.md * scale, marginLeft: 10 * scale }]}>Verify Email</Text>
        </View>

        {/* Content */}
        <View style={[styles.content, { marginHorizontal: 20 * scale, paddingTop: 60 * scale, paddingBottom: 60 * scale, borderRadius: 12 * scale, marginTop: 40 * scale }]}>
          <Text style={[styles.title, { fontSize: Typography.sizes.xxl * scale, marginBottom: 5 * scale }]}>Check your email</Text>
          <Text style={[styles.subtitle, { fontSize: Typography.sizes.sm * scale }]}>We just sent you a mail</Text>
          <Text style={[styles.subtitle, { fontSize: Typography.sizes.sm * scale }]}>
            Enter the 6-digit code to verify your account
          </Text>

          <View style={[styles.codeContainer, { marginTop: 24 * scale, marginBottom: 24 * scale }]}>
            {code.map((digit, index) => (
              <OtpBox
                key={index}
                value={digit}
                focused={focusedIndex === index}
                inputRef={(ref) => (inputs.current[index] = ref)}
                onChangeText={(text) => handleChange(text, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              />
            ))}
          </View>

          {/* Verify Button */}
          <BrandButton
            title="VERIFY"
            onPress={handleVerify}
            loading={loading}
            disabled={loading || code.some((digit) => digit === "")}
            style={{ marginBottom: 40 * scale }}
          />

          {/* Resend */}
          <TouchableOpacity
            disabled={isResendDisabled || resendCount >= 3}
            onPress={handleResend}
          >
            <Text
              style={[
                styles.resendText,
                { marginTop: 15 * scale, fontSize: Typography.sizes.sm * scale },
                (isResendDisabled || resendCount >= 3) && { color: "#aaa" },
              ]}
            >
              {resendCount >= 3
                ? "Resend limit reached"
                : isResendDisabled
                ? `Resend in ${timer}s`
                : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { padding: 25 * scale, borderRadius: 14 * scale, marginHorizontal: 20 * scale }]}>
            <Text style={[styles.modalText, { fontSize: Typography.sizes.md * scale }]}>
              ✅ Congratulations! You have been successfully added to our Market
              News Alert subscription service. Stay tuned for regular updates!
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerText: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: Colors.brand.primary,
  },
  content: {
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    color: "#555",
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  codeInputWrapper: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 0 },
    justifyContent: "center",
    alignItems: "center",
  },
  codeInput: {
    fontFamily: Typography.fonts.regular,
    width: "100%",
    height: "100%",
    textAlign: "center",
  },
  verifyButton: {
    backgroundColor: Colors.brand.primary,
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonText: {
    fontFamily: Typography.fonts.bold,
    color: "#fff",
    fontWeight: "bold",
  },
  resendText: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: Colors.brand.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalText: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: Colors.brand.palette.green,
    textAlign: "center",
  },
});
