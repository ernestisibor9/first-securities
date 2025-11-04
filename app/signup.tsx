import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [currentUrl, setCurrentUrl] = useState(
    "https://myportfolio.fbnquest.com/Securities/NewAccount/Registration"
  );

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  // ✅ Detect and handle orientation changes dynamically
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const onChange = ({ orientationInfo }) => {
      const o = orientationInfo.orientation;
      setOrientation(
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT"
      );
    };

    const subscription = ScreenOrientation.addOrientationChangeListener(onChange);
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const redirectToDashboard = () => {
    setCurrentUrl("https://myportfolio.fbnquest.com/Securities");
  };

  const isLandscape = orientation === "LANDSCAPE";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLandscape ? "#fff" : "#f9f9f9" },
      ]}
    >
      {/* ✅ Always render header but hide with opacity in landscape */}
      <View
        style={[
          styles.header,
          { opacity: isLandscape ? 0 : 1, height: isLandscape ? 0 : "auto" },
        ]}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.homeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color="#002B5B" />
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={redirectToDashboard} style={styles.dashboardButton}>
          <Text style={styles.dashboardText}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* 🌍 WebView */}
      <WebView
        key={currentUrl}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          borderRadius: isLandscape ? 0 : 8,
        }}
        source={{ uri: currentUrl }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002B5B" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess={false}
        allowUniversalAccessFromFileURLs={false}
        originWhitelist={["https://*"]}
        setBuiltInZoomControls={Platform.OS === "android"}
        setDisplayZoomControls={false}
        setWebContentsDebuggingEnabled={false}
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
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
  },
  dashboardButton: {
    padding: 6,
  },
  dashboardText: {
    color: "#002B5B",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#444",
    fontSize: 14,
  },
});
