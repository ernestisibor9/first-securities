import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import disclaimer from "./disclaimer";

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
      }
    );

    // Clean up listener when component unmounts
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0, 43, 91, 0.8)"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ marginTop: -30, marginBottom: 10 }}>
          <Image
            source={require("../assets/images/fslogo2.png")}
            style={{ width: 320, height: 100, resizeMode: "contain" }}
          />
        </View>

        {/* Bull Image */}
        <Image
          source={require("../assets/images/customer.png")}
          style={styles.mainImage}
        />

        {/* Main Text */}
        <Text style={styles.heading}>Invest Smarter. Grow Your Wealth.</Text>
        <Text style={styles.subHeading}>
          Your trusted partner for navigating the stock market.
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/marketinsight")}
        >
          <Text style={styles.buttonText}>MARKET INSIGHT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/dailypricelist")}
        >
          <Text style={styles.buttonText}>DAILY PRICE LIST</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom links */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push("/pricechart")}>
            <Text style={styles.bottomLinkText}>Price Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/pricealert")}>
            <Text style={styles.bottomLinkText}>Price Alert</Text>
          </TouchableOpacity>
        </View>
        {/* Footer / Regulatory text */}

          <Text style={styles.footerText}>
          <TouchableOpacity onPress={() => router.push("/disclaimer")}><Text style={styles.bottomLinkTextDis}>Disclaimer</Text></TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "90%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 16 * scale,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subHeading: {
    fontSize: 14 * scale,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#002B5B",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15 * scale,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  signupText: {
    color: "#444",
    fontSize: 13 * scale,
  },
  signupLink: {
    color: "#002B5B",
    fontWeight: "600",
    fontSize: 13 * scale,
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
  },
  bottomLinkText: {
    color: "#002B5B",
    fontWeight: "600",
    fontSize: 13 * scale,
  },
  footerText: {
    color: "#555",
    fontSize: 9 * scale,
    textAlign: "center",
    marginTop: 15,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  bottomLinkTextDis: {
    color: "red",
    fontWeight: "600",
    fontSize: 13 * scale,
  },
});
