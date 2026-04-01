import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const router = useRouter();

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
      <Image
        source={require("../assets/images/risks.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Securities Trading is Risky</Text>
      <Text style={styles.subtitle}> Prices can fall anytime, leading to losses. Invest wisely.</Text>

      {/* Skip and Next Buttons */}
      <View style={styles.controls}>
        {/* <TouchableOpacity onPress={goToHome}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.nextButton} onPress={goToHome}>
          <Text style={styles.nextText}>Continue ›</Text>
        </TouchableOpacity>
      </View>
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
    width: width * 0.8,
    height: 250,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    fontWeight: "bold",
    color: "#EEB72B",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: "#555",
    marginTop: 8,
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
    fontFamily: 'Inter',
    color: "#777",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#00338f",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  nextText: {
    fontFamily: 'Inter-SemiBold',
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
