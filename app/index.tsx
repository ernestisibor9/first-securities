import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandButton } from "@/components/BrandButton";
import Animated, { FadeInUp, FadeInDown, ZoomIn } from "react-native-reanimated";

const { width } = Dimensions.get("window"); // screen dimensions
const scale = width / 375; // scale factor (base = iPhone 11 width)

const Index = () => {
  const router = useRouter();

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo2.png")}
            style={styles.logo}
          />
        </Animated.View>

        {/* Bull Image */}
        <Animated.View entering={FadeInUp.delay(400).duration(1000)}>
          <Image
            source={require("../assets/images/customer.png")}
            style={styles.mainImage}
          />
        </Animated.View>

        {/* Main Text */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
          <Text style={styles.heading}>Invest Smarter. Grow Your Wealth.</Text>
          <Text style={styles.subHeading}>
            Your trusted partner for navigating the stock market.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInUp.delay(800).duration(800)} style={{ width: '100%', alignItems: 'center' }}>
          <BrandButton
            title="MARKET INSIGHT"
            onPress={() => router.push("/marketinsight")}
          />
          <BrandButton
            title="DAILY PRICE LIST"
            onPress={() => router.push("/dailypricelist")}
          />
          <BrandButton
            title="LOGIN"
            onPress={() => router.push("/login")}
          />
        </Animated.View>

        {/* Sign up link */}
        <Animated.View entering={FadeInUp.delay(1000).duration(800)} style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom links */}
        <Animated.View entering={FadeInUp.delay(1200).duration(800)} style={styles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push("/pricechart")}>
            <Text style={styles.bottomLinkText}>Price Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/pricealert")}>
            <Text style={styles.bottomLinkText}>Price Alert</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer / Regulatory text */}
        <Text style={styles.footerText}>
          <TouchableOpacity onPress={() => router.push("/disclaimer")}>
            <Text style={styles.bottomLinkTextDis}>Disclaimer</Text>
          </TouchableOpacity>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  logoContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    width: 190,
    height: 50,
    resizeMode: "contain",
  },
  mainImage: {
    width: "90%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  heading: {
    fontFamily: "Inter-Bold",
    fontSize: 16 * scale,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  subHeading: {
    fontFamily: "Inter",
    fontSize: 14 * scale,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#0033A0",
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    fontWeight: "600",
    fontSize: 15 * scale,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 20,
  },
  signupText: {
    fontFamily: "Inter",
    color: "#444",
    fontSize: 13 * scale,
  },
  signupLink: {
    fontFamily: "Inter-SemiBold",
    color: "#0033A0",
    fontWeight: "600",
    fontSize: 13 * scale,
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  bottomLinkText: {
    fontFamily: "Inter-Bold",
    color: "#0033A0",
    fontWeight: "600",
    fontSize: 13 * scale,
  },
  footerText: {
    fontFamily: "Inter",
    color: "#555",
    fontSize: 9 * scale,
    textAlign: "center",
    marginTop: 35,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  bottomLinkTextDis: {
    fontFamily: "Inter-SemiBold",
    color: "#EAAA00",
    fontWeight: "600",
    fontSize: 13 * scale,
  },
});
