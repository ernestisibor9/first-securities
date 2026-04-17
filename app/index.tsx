import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window"); // screen dimensions
const scale = width / 375; // scale factor (base = iPhone 11 width)

const Index = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // ✅ Allow screen auto-rotation
    ScreenOrientation.unlockAsync();

    // (Optional) Listen for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        console.log("Orientation changed:", event.orientationInfo.orientation);
      },
    );

    // Clean up listener when component unmounts
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

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
          <Text style={styles.heroLine}>
            <Text style={styles.highlightText}>Trade </Text>
            Smarter
          </Text>
          <Text style={styles.heroLine}>Grow Your Wealth</Text>
          <Text style={styles.subText}>
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
          style={styles.actionContainer}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>LOGIN</Text>
          </TouchableOpacity>
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
              <Text style={styles.footerLinkText}>Price Chart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/pricealert")}>
              <Text style={styles.footerLinkText}>Price Alert</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/disclaimer")}
            style={styles.disclaimerBtn}
          >
            <Text style={styles.disclaimerText}>DISCLAIMER</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
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
    fontFamily: "Inter-Bold",
    fontSize: 34 * scale,
    color: "#FFFFFF",
    lineHeight: 40 * scale,
  },
  highlightText: {
    color: Colors.brand.yellow,
  },
  subText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15 * scale,
    color: "#FFFFFF",
    marginTop: 12,
    lineHeight: 22 * scale,
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
    fontFamily: "Inter-Bold",
    fontSize: 16 * scale,
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
    fontFamily: "Inter-Bold",
    color: "#11181C",
    fontSize: 16 * scale,
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
    fontFamily: "Inter",
    color: "#EAEAEA",
    fontSize: 14 * scale,
  },
  signupText: {
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
    fontSize: 14 * scale,
  },
  bottomLinkRow: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 120,
    justifyContent: "center",
  },
  footerLinkText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFFFFF",
    fontSize: 14 * scale,
  },
  disclaimerBtn: {
    paddingVertical: 10,
  },
  disclaimerText: {
    fontFamily: "Inter-Bold",
    color: Colors.brand.yellow,
    fontSize: 14 * scale,
    letterSpacing: 0.5,
  },
});
