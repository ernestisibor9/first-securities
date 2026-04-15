import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function SignUpScreen() {
  const webviewRef = useRef<WebView>(null); // ✅ MUST be before usage
  const [orientation, setOrientation] = useState("PORTRAIT");

  const router = useRouter();
  const initialUrl =
    "https://alabiansolutions.com/client-mobile-app1/fs-signup.php";

  // ✅ Orientation handling
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const onChange = ({
      orientationInfo,
    }: ScreenOrientation.OrientationChangeEvent) => {
      const o = orientationInfo.orientation;
      setOrientation(
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT",
      );
    };

    const subscription =
      ScreenOrientation.addOrientationChangeListener(onChange);

    return () =>
      ScreenOrientation.removeOrientationChangeListener(subscription);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  // ✅ Dashboard behaves EXACTLY like Login
  const redirectToDashboard = () => {
    webviewRef.current?.injectJavaScript(`
      window.location.href = "https://alabiansolutions.com/client-mobile-app1/redirect.php";
      true;
    `);
  };

  const isLandscape = orientation === "LANDSCAPE";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLandscape ? "#fff" : "#f9f9f9" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { opacity: isLandscape ? 0 : 1, height: isLandscape ? 0 : "auto" },
        ]}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.homeButton}>
          <Feather name="arrow-left" size={22} color={Colors.brand.primary} />
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={redirectToDashboard}
          style={styles.dashboardButton}
        >
          <Text style={styles.dashboardText}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webviewRef}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          borderRadius: isLandscape ? 0 : 8,
        }}
        source={{ uri: initialUrl }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.brand.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["https://*"]}
        setBuiltInZoomControls={Platform.OS === "android"}
        setDisplayZoomControls={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    elevation: 3,
    zIndex: 10,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  homeText: {
    fontFamily: "Inter-SemiBold",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.brand.primary,
  },
  dashboardButton: {
    padding: 6,
  },
  dashboardText: {
    fontFamily: "Inter-SemiBold",
    color: Colors.brand.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter",
    marginTop: 10,
    color: "#444",
    fontSize: 14,
  },
});
