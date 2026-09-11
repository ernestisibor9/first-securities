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

export default function SignUpScreen() {
  const webviewRef = useRef(null);
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [webError, setWebError] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const router = useRouter();
  const initialUrl =
    "https://alabiansolutions.com/client-mobile-app1/fs-signup.php";
  const WEB_TIMEOUT = 15000;

  // ✅ Orientation handling
  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {});

    const onChange = ({ orientationInfo }) => {
      const o = orientationInfo.orientation;
      setOrientation(
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT"
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
      window.location.href = initialUrl;
      true;
    `);
  };
 
  const isLandscape = orientation === "LANDSCAPE";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (webLoading) setWebError(true);
    }, WEB_TIMEOUT);
    return () => clearTimeout(timer);
  }, [webLoading]);

  const retryWeb = () => {
    setWebError(false);
    webviewRef.current?.reload();
  };

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
          <Feather name="arrow-left" size={22} color="#002B5B" />
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
      {webError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to load page</Text>
          <Text style={styles.errorMessage}>
            Please check your internet connection and try again.
          </Text>
          <TouchableOpacity onPress={retryWeb} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
              <ActivityIndicator size="large" color="#002B5B" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["https://*"]}
          cacheEnabled
          cacheMode="LOAD_DEFAULT"
          incognito={false}
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          setBuiltInZoomControls={Platform.OS === "android"}
          setDisplayZoomControls={false}
          onError={() => setWebError(true)}
          onHttpError={() => setWebError(true)}
          onLoadEnd={() => setWebLoading(false)}
          onLoadStart={() => setWebLoading(true)}
        />
      )}
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

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#c00",
    marginBottom: 12,
  },

  errorMessage: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  loadingText: {
    marginTop: 10,
    color: "#444",
    fontSize: 14,
  },
});
