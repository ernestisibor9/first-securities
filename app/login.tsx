import * as ScreenOrientation from "expo-screen-orientation";
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

export default function LoginScreen() {
  const webviewRef = useRef<WebView>(null);
  const router = useRouter();
  const { isLandscape, scale } = useOrientation();
  const [progress, setProgress] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const url = "https://alabiansolutions.com/client-mobile-app1/redirect.php";
 
  // ✅ Unlock for this screen
  React.useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  // ✅ Go back to previous app screen
  const handleGoBack = () => {
    router.back();
  };
 
  const handleReload = () => {
    // setIsLoaded(false);
    setProgress(0);
    // ✅ Soft Navigate is faster than reload()
    webviewRef.current?.injectJavaScript(`
      window.location.href = "${url}";
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
      {/* ✅ Header visible only in portrait */}
      {!isLandscape && (
        <View style={styles.header}>
          {/* ⬅️ Back/Home */}
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={22 * scale} color={Colors.brand.primary} />
            <Text style={[styles.backText, { fontSize: Typography.sizes.md * scale }]}>Home</Text>
          </TouchableOpacity>

          {/* 🧭 Dashboard */}
          <TouchableOpacity onPress={handleReload}>
            <Text style={[styles.headerTitle, { fontSize: Typography.sizes.md * scale }]}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Progress Bar (Shows whenever progress is active) */}
      {progress > 0 && progress < 1 && (
        <View style={[styles.progressBarContainer, { top: isLandscape ? 0 : 0 }]}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      {/* 🌍 WebView with footer */}
      <View style={{ flex: 1, backgroundColor: isLandscape ? "#fff" : "#f9f9f9" }}>
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
          source={{ uri: url }}
          onLoadProgress={({ nativeEvent }) => {
            setProgress(nativeEvent.progress);
            if (nativeEvent.progress > 0.8) setIsLoaded(true);
          }}
          onLoadEnd={() => setIsLoaded(true)}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={["https://*"]}
          cacheEnabled
          mixedContentMode="always"
          setBuiltInZoomControls={Platform.OS === "android"}
          setDisplayZoomControls={false}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          incognito={false}
        />
 
        {/* Custom Loader Overlay (Works for initial load AND reloads) */}
        {!isLoaded && (
          <View style={[styles.loaderContainer, { 
            backgroundColor: isLandscape ? "#fff" : "#f9f9f9",
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10
          }]}>
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

        {/* Footer / Regulatory text */}
        <Text style={[styles.footerText, { fontSize: Typography.sizes.xs * scale }]}>
          FirstInvest is registered as a broker dealer{"\n"}
          in Nigeria and a member of the NGX Exchange.{"\n"}
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
    fontFamily: Typography.fonts.semiBold,
    marginLeft: 6,
    fontWeight: "600",
    color: Colors.brand.primary,
  },

  headerTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: Colors.brand.primary,
  },

  loaderContainer: {
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

  footerText: {
    fontFamily: Typography.fonts.regular,
    textAlign: "center",
    color: "#555",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
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
