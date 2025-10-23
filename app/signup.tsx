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

export default function SignUpScreen() {
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [currentUrl, setCurrentUrl] = useState(
    "https://myportfolio.fbnquest.com/Securities/NewAccount/Registration"
  );

  const { width, height } = useWindowDimensions();

  // ✅ Allow auto-rotation and detect orientation dynamically
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

  // ✅ Redirect function for both Dashboard & Arrow buttons
  const redirectToDashboard = () => {
    setCurrentUrl("https://myportfolio.fbnquest.com/Securities");
  };

  // ✅ Dynamic styles based on orientation
  const isLandscape = orientation === "LANDSCAPE";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLandscape ? "#fff" : "#f9f9f9" },
      ]}
    >
      {/* ✅ Header visible only in portrait mode */}
      {!isLandscape && (
        <View style={styles.header}>
          <View style={styles.leftGroup}>
            <TouchableOpacity onPress={redirectToDashboard} style={styles.backButton}>
              <Feather name="arrow-left" size={22} color="#002B5B" />
            </TouchableOpacity>

            <TouchableOpacity onPress={redirectToDashboard}>
              <Text style={styles.dashboardText}>Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🌐 WebView (takes full screen in landscape) */}
      <WebView
        key={currentUrl} // ensures reload when URL changes
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
    justifyContent: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    elevation: 2, // subtle shadow for Android
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 8,
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
