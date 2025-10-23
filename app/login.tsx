import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";

export default function LoginScreen() {
  const webviewRef = useRef(null);
  const [orientation, setOrientation] = useState("PORTRAIT_UP");
  const url = "https://myportfolio.fbnquest.com/Securities";

  // ✅ Enable auto-rotation and listen for changes
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    const subscription = ScreenOrientation.addOrientationChangeListener(
      ({ orientationInfo }) => {
        setOrientation(orientationInfo.orientation);
      }
    );
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // ✅ Handle redirect when arrow or dashboard is pressed
  const handleRedirect = () => {
    if (webviewRef.current) {
      webviewRef.current.stopLoading();
      webviewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleRedirect} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRedirect}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webviewRef}
        style={{ flex: 1 }}
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#002B5B" />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={["https://*"]}
        cacheEnabled
        mixedContentMode="always"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },

  backButton: { paddingRight: 8 },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // optional for clarity
  },
});
