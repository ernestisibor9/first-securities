import React from "react";
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

const { width, height } = Dimensions.get("window"); // screen dimensions
const scale = width / 375; // scale factor (base = iPhone 11 width)

const Index = () => {
  const router = useRouter();
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
            source={require("../assets/images/fslogo.png")}
            style={{ width: 180, height: 130 }}
          />
        </View>

        {/* Title */}
        {/* <Text style={styles.title}>First Securities</Text> */}

        {/* Bull Image */}
        <Image
          source={require("../assets/images/bull-chart.jpg")}
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
          <Text style={styles.buttonText}>DAILY PRICE LISTS</Text>
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
    flexGrow: 1, // ensures it stretches on tall devices
    justifyContent: "center", // centers vertically on tall screens
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  logo: {
    width: "25%",
    height: undefined,
    aspectRatio: 4 / 3,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 18 * scale,
    fontWeight: "bold",
    marginBottom: 20,
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
});
