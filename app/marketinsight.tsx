import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as WebBrowser from "expo-web-browser";
import { SkeletonBox } from "@/components/Skeleton";

const { width } = Dimensions.get("window");
const scale = width / 375; // base = iPhone 11 width

const MarketInsight = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {});

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        console.log("Orientation changed:", event.orientationInfo.orientation);
      }
    );

    // Cleanup listener when component unmounts
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const openArticle = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.log("Failed to open article", e);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    fetch("https://regencyng.net/fs-api/proxy.php?type=market", {
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setInsights(data);
        setLoading(false);
        setFetchError(null);
      })
      .catch((err: any) => {
        if (err.name === "AbortError") {
          setFetchError("Request timed out. Tap to retry.");
        } else {
          setFetchError("Failed to load insights. Tap to retry.");
        }
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [retryKey]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.headerContainer}>
          <View style={{ width: 24 * scale }} />
          <Text style={styles.header}>Market Insight</Text>
          <View style={{ width: 24 * scale }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {[0, 1, 2, 3].map((key) => (
            <View key={key} style={styles.card}>
              <SkeletonBox
                width="60%"
                height={18 * scale}
                radius={4}
                style={{ marginBottom: 8 * scale }}
              />
              <SkeletonBox
                width="100%"
                height={13 * scale}
                radius={4}
                style={{ marginBottom: 6 * scale }}
              />
              <SkeletonBox
                width="90%"
                height={13 * scale}
                radius={4}
                style={{ marginBottom: 8 * scale }}
              />
              <SkeletonBox width="40%" height={12 * scale} radius={4} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#c00", marginBottom: 12 }}>
          {fetchError}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setFetchError(null);
            setLoading(true);
            setRetryKey((k) => k + 1);
          }}
          style={{ backgroundColor: "#002B5B", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Retry</Text>
        </TouchableOpacity>
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
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {insights.map((item, idx) => {
          const shortContent = String(item.content || "");
          const displayContent =
            shortContent.length > 140
              ? shortContent.slice(0, 140) + "..."
              : shortContent;

          return (
            <View key={idx} style={styles.card}>
              <Text style={styles.title}>{String(item.title || "")}</Text>
              <Text style={styles.desc}>{displayContent}</Text>
              {item.url ? (
                <TouchableOpacity
                  onPress={() => openArticle(String(item.url))}
                  accessibilityRole="link"
                  accessibilityLabel="Open article"
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
