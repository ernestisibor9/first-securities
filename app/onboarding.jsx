import React, { useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const router = useRouter();
  const swiperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/"); // auto redirect after 10s
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const slides = [
    {
      id: 1,
      image: require("../assets/images/unlock.jpg"),
      title: "Unlock New Possibilities",
      subtitle: "Disciplined Savings and Steady Gains",
    },
    {
      id: 2,
      image: require("../assets/images/grow.jpg"),
      title: "Grow Your Wealth",
      subtitle: "Invest and Save across Currencies",
    },
  ];

  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
      showsPagination
    >
      {slides.map((item) => (
        <View key={item.id} style={styles.slide}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                if (swiperRef.current && item.id < slides.length) {
                  swiperRef.current.scrollBy(1);
                } else {
                  router.replace("/");
                }
              }}
            >
              <Text style={styles.nextText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </Swiper>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  slide: {
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#002B5B",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    position: "absolute",
    bottom: 60,
  },
  skip: {
    color: "#777",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#002B5B",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  nextText: {
    color: "#fff",
    fontSize: 22,
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#002B5B",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});
