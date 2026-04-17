import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useOrientation } from "@/hooks/useOrientation";
import { BrandButton } from "@/components/BrandButton";

const PriceAlert = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLandscape, scale } = useOrientation();

  const handleContinue = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=daily_alert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.push({
          pathname: "/verifyemail",
          params: { email },
        });
      } else {
        Alert.alert("Error", data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: 10 * scale }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22 * scale} color={Colors.brand.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: Typography.sizes.md * scale }]}>
          FirstInvest
        </Text>
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: 30 * scale }]}>
        <Text style={[styles.title, { fontSize: Typography.sizes.lg * scale }]}>
          Please provide your email address
        </Text>
        <Text style={[styles.subtitle, { fontSize: Typography.sizes.sm * scale }]}>
          This is required to confirm your identity
        </Text>

        <TextInput
          style={[styles.input, { padding: 12 * scale, fontSize: Typography.sizes.sm * scale }]}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Continue Button */}
      <BrandButton
        title="CONTINUE"
        onPress={handleContinue}
        loading={loading}
        disabled={loading}
        style={{ marginBottom: isLandscape ? 20 : 55 * scale }}
      />
    </View>
  );
};

export default PriceAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: Colors.brand.primary,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 12,
  },
  title: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    color: "#666",
  },
  input: {
    fontFamily: Typography.fonts.regular,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 8,
  },
  button: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Typography.fonts.semiBold,
    color: "#fff",
    fontWeight: "600",
  },
});
