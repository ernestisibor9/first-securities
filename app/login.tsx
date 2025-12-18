import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const webviewRef = useRef(null);
  const [orientation, setOrientation] = useState("PORTRAIT");
  const router = useRouter();
  const url = "https://myportfolio.first-securities.com/securities/Home/Login";

  // ✅ Enable auto-rotation and track orientation
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

  // ✅ Go back to previous app screen
  const handleGoBack = () => {
    router.back();
  };

  const isLandscape = orientation === "LANDSCAPE";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLandscape ? "#fff" : "#f9f9f9" },
      ]}
    >
      {/* ✅ Header visible only in portrait */}
      {!isLandscape && (
        <View style={styles.header}>
          {/* ⬅️ Back/Home */}
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#002B5B" />
            <Text style={styles.backText}>Home</Text>
          </TouchableOpacity>

          {/* 🧭 Dashboard */}
          <TouchableOpacity onPress={() => webviewRef.current && webviewRef.current.reload()}>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🌍 WebView with footer */}
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            borderRadius: isLandscape ? 0 : 8,
          }}
          source={{ uri: url }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#002B5B" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={["https://*"]}
          cacheEnabled
          mixedContentMode="always"
          setBuiltInZoomControls={Platform.OS === "android"}
          setDisplayZoomControls={false}
        />

        {/* Footer / Regulatory text */}
        <Text style={styles.footerText}>
          First Securities is registered as a broker dealer{"\n"}
          and regulated by the Securities and Exchange{"\n"}
          Commission, Nigeria.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },

  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#444",
    fontSize: 14,
  },

  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
});
