import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const scale = width / 375; // base = iPhone 11 width

const MarketInsight = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://regencyng.net/fs-api/proxy.php?type=market")
      .then((res) => res.json())
      .then((data) => {
        setInsights(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#002B5B" />
        <Text style={styles.loadingText}>Loading Market Insights...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22 * scale} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.header}>Market Insight</Text>
        <View style={{ width: 24 * scale }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {insights.map((item, idx) => {
          const shortContent = String(item.content || "");
          const displayContent =
            shortContent.length > 100
              ? shortContent.slice(0, 140) + "..."
              : shortContent;

          return (
            <View key={idx} style={styles.card}>
              <Text style={styles.title}>{String(item.title || "")}</Text>
              <Text style={styles.desc}>{displayContent}</Text>
              {item.url ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(String(item.url))}
                >
                  <Text style={styles.link}>{String(item.url)}</Text>
                </TouchableOpacity>
              ) : null}
              <Text style={styles.time}>{String(item.date || "")}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MarketInsight;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16 * scale,
    color: "#555",
  },
  headerContainer: {
    paddingHorizontal: 16 * scale,
    paddingVertical: 14 * scale,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 40,
  },
  header: {
    fontSize: 18 * scale,
    fontWeight: "bold",
    color: "#002B5B",
  },
  scrollContent: {
    padding: 16 * scale,
  },
  card: {
    backgroundColor: "#F5F7FA",
    padding: 16 * scale,
    borderRadius: 8 * scale,
    marginBottom: 16 * scale,
  },
  title: {
    fontWeight: "700",
    fontSize: 16 * scale,
    marginBottom: 6 * scale,
  },
  desc: {
    fontSize: 14 * scale,
    marginBottom: 8 * scale,
    color: "#444",
  },
  link: {
    fontSize: 12 * scale,
    color: "#1E90FF",
  },
  time: {
    fontSize: 12 * scale,
    color: "#999",
    marginTop: 4 * scale,
  },
});
