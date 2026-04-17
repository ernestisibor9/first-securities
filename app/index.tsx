import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Typography } from "@/constants/Typography";
import { useOrientation } from "@/hooks/useOrientation";
import { BrandButton } from "@/components/BrandButton";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scale } = useOrientation();

  return (
    <ImageBackground
      // using the existing customer.png or another placeholder if not provided
      source={require("../assets/images/customer.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.40)",
          "rgba(21, 46, 77, 0.45)",
          "#79B076",
        ]}
        locations={[0, 0.2, 1]}
        style={[
          styles.overlay,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 },
        ]}
      >
        {/* Logo Top Right */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          style={styles.logoContainer}
        >
          <Image
            source={require("../assets/images/logo2.png")}
            style={styles.logo}
          />
        </Animated.View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Hero Text */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(1000)}
          style={styles.textContainer}
        >
          <Text style={[styles.heroLine, { fontSize: 34 * scale, lineHeight: 40 * scale }]}>
            <Text style={styles.highlightText}>Trade </Text>
            Smarter
          </Text>
          <Text style={[styles.heroLine, { fontSize: 34 * scale, lineHeight: 40 * scale }]}>Grow Your Wealth</Text>
          <Text style={[styles.subText, { fontSize: 15 * scale, lineHeight: 22 * scale }]}>
            Your trusted partner for navigating the Nigerian Stock Market
          </Text>
        </Animated.View>

        {/* Middle Links */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(800)}
          style={styles.middleLinksContainer}
        >
          <TouchableOpacity
            onPress={() => router.push("/marketinsight")}
            style={styles.middleLinkBtn}
          >
            <Text style={styles.middleLinkText}>MARKET INSIGHT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/dailypricelist")}
            style={styles.middleLinkBtn}
          >
            <Text style={styles.middleLinkText}>DAILY PRICE LIST</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Primary Action */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(800)}
          style={[styles.actionContainer, { width: 335 * scale, marginBottom: 30 * scale }]}
        >
          <BrandButton 
            title="LOGIN"
            type="yellow"
            onPress={() => router.push("/login")}
          />
        </Animated.View>

        {/* Footer Links */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(800)}
          style={styles.footerContainer}
        >
          <View style={styles.signupContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomLinkRow}>
            <TouchableOpacity onPress={() => router.push("/pricechart")}>
              <Text style={[styles.footerLinkText, { fontSize: Typography.sizes.sm * scale }]}>Price Chart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/pricealert")}>
              <Text style={[styles.footerLinkText, { fontSize: Typography.sizes.sm * scale }]}>Price Alert</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/disclaimer")}
            style={styles.disclaimerBtn}
          >
            <Text style={[styles.disclaimerText, { fontSize: Typography.sizes.sm * scale }]}>DISCLAIMER</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
 
      {/* Predictive-Prefetch: Hidden WebView to prime cache for Login portal */}
      <View style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }} pointerEvents="none">
        <WebView 
          source={{ uri: "https://alabiansolutions.com/client-mobile-app1/redirect.php" }} 
          onLoadEnd={() => console.log('Login portal prefetched')}
        />
      </View>
    </ImageBackground>
  );
};

export default Index;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  logo: {
    width: 220,
    height: 60,
    resizeMode: "contain",
  },
  spacer: {
    flex: 1, // pushes text down toward the middle
  },
  textContainer: {
    marginBottom: 50,
  },
  heroLine: {
    fontFamily: Typography.fonts.bold,
    color: "#FFFFFF",
  },
  highlightText: {
    color: Colors.brand.yellow,
  },
  subText: {
    fontFamily: Typography.fonts.semiBold,
    color: "#FFFFFF",
    marginTop: 12,
    maxWidth: "85%",
  },
  middleLinksContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  middleLinkBtn: {
    paddingVertical: 12,
  },
  middleLinkText: {
    fontFamily: Typography.fonts.bold,
    color: "#FFFFFF",
    textDecorationLine: "underline",
    letterSpacing: 0.5,
  },
  actionContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: Colors.brand.yellow,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: Typography.fonts.bold,
    color: "#11181C",
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  signupContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  footerText: {
    fontFamily: Typography.fonts.regular,
    color: "#EAEAEA",
  },
  signupText: {
    fontFamily: Typography.fonts.bold,
    color: "#FFFFFF",
  },
  bottomLinkRow: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 40,
    justifyContent: "center",
  },
  footerLinkText: {
    fontFamily: Typography.fonts.semiBold,
    color: "#FFFFFF",
  },
  disclaimerBtn: {
    paddingVertical: 10,
  },
  disclaimerText: {
    fontFamily: Typography.fonts.bold,
    color: Colors.brand.yellow,
    letterSpacing: 0.5,
  },
});
