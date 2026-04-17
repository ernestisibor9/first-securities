import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { useOrientation } from "@/hooks/useOrientation";
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
  const router = useRouter();
  const { isLandscape, scale } = useOrientation();
  const [progress, setProgress] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const initialUrl =
    "https://alabiansolutions.com/client-mobile-app1/fs-signup.php";

  const handleGoBack = () => {
    router.back();
  };

  // ✅ Dashboard behaves EXACTLY like Login
  const redirectToDashboard = () => {
    setIsLoaded(false);
    setProgress(0);
    webviewRef.current?.injectJavaScript(`
      window.location.href = "https://alabiansolutions.com/client-mobile-app1/redirect.php";
      true;
    `);
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
          <Feather name="arrow-left" size={22 * scale} color={Colors.brand.primary} />
          <Text style={[styles.homeText, { fontSize: Typography.sizes.md * scale }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={redirectToDashboard}
          style={styles.dashboardButton}
        >
          <Text style={[styles.dashboardText, { fontSize: Typography.sizes.md * scale }]}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar (Shows whenever progress is active) */}
      {progress > 0 && progress < 1 && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webviewRef}
        startInLoadingState={true}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          borderRadius: isLandscape ? 0 : 8,
          opacity: isLoaded ? 1 : 0, // Hide ONLY on initial load
        }}
        source={{ uri: initialUrl }}
        onLoadProgress={({ nativeEvent }) => {
          setProgress(nativeEvent.progress);
          if (nativeEvent.progress > 0.8) setIsLoaded(true);
        }}
        onLoadEnd={() => setIsLoaded(true)}
        renderLoading={() => (
          <View style={[styles.loadingContainer, { backgroundColor: isLandscape ? "#fff" : "#f9f9f9" }]}>
            <View style={[styles.loaderContent, { gap: 12 * scale }]}>
              <ActivityIndicator size="large" color={Colors.brand.primary} />
              <Text style={[styles.loadingText, { 
                fontSize: Typography.sizes.md * scale,
                fontFamily: Typography.fonts.semiBold,
                color: Colors.brand.primary 
              }]}>
                Securing Connection...
              </Text>
            </View>
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["https://*"]}
        setBuiltInZoomControls={Platform.OS === "android"}
        setDisplayZoomControls={false}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        incognito={false}
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
    fontFamily: Typography.fonts.semiBold,
    marginLeft: 6,
    fontWeight: "600",
    color: Colors.brand.primary,
  },
  dashboardButton: {
    padding: 6,
  },
  dashboardText: {
    fontFamily: Typography.fonts.semiBold,
    color: Colors.brand.primary,
    fontWeight: "600",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loaderContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    textAlign: "center",
  },
  loadingSubtext: {
    textAlign: "center",
  },
  progressBarContainer: {
    height: 3,
    width: "100%",
    backgroundColor: "#f0f0f0",
    zIndex: 1000,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.brand.primary,
  },
});
