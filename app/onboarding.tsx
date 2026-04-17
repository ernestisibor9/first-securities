import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useOrientation } from "@/hooks/useOrientation";
import { BrandButton } from "@/components/BrandButton";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const Onboarding = () => {
  const router = useRouter();
  const { scale } = useOrientation();

  // Automatically go to home after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const goToHome = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        entering={FadeIn.delay(200).duration(800)}
        source={require("../assets/images/risks.png")}
        style={[styles.image, { width: 300 * scale, height: 250 * scale }]}
        resizeMode="contain"
      />

      <Animated.Text 
        entering={FadeInDown.delay(500).duration(600)}
        style={[styles.title, { fontSize: Typography.sizes.xl * scale, marginTop: 20 * scale }]}
      >
        Securities Trading is Risky
      </Animated.Text>
      <Animated.Text 
        entering={FadeInDown.delay(700).duration(600)}
        style={[styles.subtitle, { fontSize: Typography.sizes.md * scale, marginTop: 8 * scale }]}
      >
        Prices can fall anytime, leading to losses. Invest wisely.
      </Animated.Text>

      {/* Skip and Next Buttons */}
      <Animated.View 
        entering={FadeIn.delay(1000).duration(600)}
        style={styles.controls}
      >
        <BrandButton 
          title="Continue ›"
          onPress={goToHome}
          style={{ width: "auto", paddingHorizontal: 20 * scale }}
        />
      </Animated.View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontWeight: "bold",
    color: Colors.brand.yellow,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    color: "#555",
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 60,
  },
  skip: {
    fontFamily: Typography.fonts.regular,
    color: "#777",
  },
  nextButton: {
    backgroundColor: Colors.brand.primary,
  },
  nextText: {
    fontFamily: Typography.fonts.semiBold,
    color: "#fff",
    fontWeight: "600",
  },
});
