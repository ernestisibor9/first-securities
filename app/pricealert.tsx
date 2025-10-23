import React, { useState, useEffect } from "react";
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
import * as ScreenOrientation from "expo-screen-orientation";

const PriceAlert = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState("PORTRAIT");

  // --- Detect and respond to screen rotation ---
  useEffect(() => {
    // Get initial orientation
    (async () => {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT"
      );
    })();

    // Listen for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const newOrientation =
        event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT";
      setOrientation(newOrientation);
    });

    // Cleanup on unmount
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Scale layout based on orientation
  const { width } = Dimensions.get("window");
  const scale = orientation === "LANDSCAPE" ? width / 812 : width / 375;

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
          <Feather name="arrow-left" size={22 * scale} color="#002B5B" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: 16 * scale }]}>
          First Securities Brokers
        </Text>
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: 30 * scale }]}>
        <Text style={[styles.title, { fontSize: 18 * scale }]}>
          Please provide your email address
        </Text>
        <Text style={[styles.subtitle, { fontSize: 14 * scale }]}>
          This is required to confirm your identity
        </Text>

        <TextInput
          style={[styles.input, { padding: 12 * scale, fontSize: 14 * scale }]}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            paddingVertical: 14 * scale,
            marginBottom: orientation === "LANDSCAPE" ? 20 : 55 * scale,
          },
        ]}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { fontSize: 16 * scale }]}>
            CONTINUE
          </Text>
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
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#002B5B",
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
