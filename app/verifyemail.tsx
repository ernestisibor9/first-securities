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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const scale = width / 375;

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
      ["#ccc", "#0033A0"]
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

// --- Main Screen ---
export default function VerifyEmail() {
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24 * scale} color="#0033A0" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Verify Email</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>We just sent you a mail</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code to verify your account
          </Text>

          {/* Animated OTP Inputs */}
          <View style={styles.codeContainer}>
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
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>VERIFY</Text>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity
            disabled={isResendDisabled || resendCount >= 3}
            onPress={handleResend}
          >
            <Text
              style={[
                styles.resendText,
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
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
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
    paddingHorizontal: 20 * scale,
    paddingVertical: 20 * scale,
    backgroundColor: "#fff",
  },
  headerText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16 * scale,
    fontWeight: "600",
    marginLeft: 10 * scale,
    color: "#0033A0",
  },
  content: {
    backgroundColor: "#fff",
    marginHorizontal: 20 * scale,
    paddingTop: 60 * scale,
    paddingBottom: 60 * scale,
    borderRadius: 12 * scale,
    alignItems: "center",
    marginTop: 40 * scale,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 22 * scale,
    fontWeight: "600",
    marginBottom: 5 * scale,
  },
  subtitle: {
    fontFamily: "Inter",
    fontSize: 14 * scale,
    color: "#555",
    textAlign: "center",
    marginBottom: 2 * scale,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24 * scale,
    marginBottom: 24 * scale,
  },
  codeInputWrapper: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 8 * scale,
    width: 45 * scale,
    height: 52 * scale,
    marginHorizontal: 5 * scale,
    backgroundColor: "#fff",
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 0 },
    justifyContent: "center",
    alignItems: "center",
  },
  codeInput: {
    fontFamily: "Inter",
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: 20 * scale,
  },
  verifyButton: {
    backgroundColor: "#0033A0",
    paddingVertical: 14 * scale,
    paddingHorizontal: 50 * scale,
    borderRadius: 10 * scale,
    marginVertical: 10 * scale,
    shadowColor: "#0033A0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonText: {
    fontFamily: "Inter-Bold",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16 * scale,
  },
  resendText: {
    fontFamily: "Inter-SemiBold",
    marginTop: 15 * scale,
    fontSize: 14 * scale,
    fontWeight: "600",
    color: "#0033A0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25 * scale,
    borderRadius: 14 * scale,
    alignItems: "center",
    marginHorizontal: 20 * scale,
  },
  modalText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16 * scale,
    fontWeight: "600",
    color: "green",
    textAlign: "center",
  },
});
