import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const scale = width / 375; // base iPhone 11 width

const PriceAlert = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22 * scale} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>First Securities Brokers</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Please provide your email address</Text>
        <Text style={styles.subtitle}>
          This is required to confirm your identity
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>CONTINUE</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PriceAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16 * scale,
    paddingTop: 40 * scale,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12 * scale,
    marginTop: 10 * scale,
  },
  headerTitle: {
    fontSize: 16 * scale,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10 * scale,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 30 * scale,
  },
  title: {
    fontSize: 18 * scale,
    fontWeight: "600",
    marginBottom: 6 * scale,
    color: "#000",
  },
  subtitle: {
    fontSize: 14 * scale,
    color: "#666",
    marginBottom: 20 * scale,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6 * scale,
    padding: 12 * scale,
    fontSize: 14 * scale,
  },
  button: {
    backgroundColor: "#002B5B",
    paddingVertical: 14 * scale,
    borderRadius: 6 * scale,
    alignItems: "center",
    marginBottom: 55 * scale,
    marginTop: 20 * scale,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16 * scale,
  },
});
