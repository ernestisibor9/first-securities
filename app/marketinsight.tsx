import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const scale = width / 375;

const MarketInsight = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("https://regencyng.net/fs-api/proxy.php?type=market");
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Platform.OS === 'ios' ? 100 : 100,
            paddingBottom: insets.bottom + 20,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand.primary}
            colors={[Colors.brand.primary]}
            progressViewOffset={Platform.OS === 'ios' ? 90 : 110}
          />
        }
      >
        {loading ? (
          <View style={{ marginTop: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        ) : (
          insights.map((item, idx) => {
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
                  <TouchableOpacity onPress={() => Linking.openURL(String(item.url))}>
                    <Text style={styles.link}>{String(item.url)}</Text>
                  </TouchableOpacity>
                ) : null}
                <Text style={styles.time}>{String(item.date || "")}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Premium Blurred Header */}
      <BlurView
        intensity={80}
        tint="light"
        style={[styles.headerAbsolute, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22 * scale} color={Colors.brand.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Market Insight</Text>
          <View style={{ width: 40 }} />
        </View>
      </BlurView>
    </View>
  );
};

export default MarketInsight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerTitleText: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    fontWeight: "700",
    color: Colors.brand.primary,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16 * scale,
  },
  card: {
    backgroundColor: "#F5F7FA",
    padding: 16 * scale,
    borderRadius: 12 * scale,
    marginBottom: 16 * scale,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    fontSize: 16 * scale,
    marginBottom: 6 * scale,
    color: Colors.brand.primary,
  },
  desc: {
    fontFamily: "Inter",
    fontSize: 14 * scale,
    marginBottom: 8 * scale,
    color: "#444",
  },
  link: {
    fontFamily: "Inter-Medium",
    color: Colors.brand.primary,
    fontSize: 12 * scale,
    marginBottom: 8 * scale,
    textDecorationLine: "underline",
  },
  time: {
    fontFamily: "Inter",
    fontSize: 11 * scale,
    color: "#888",
    textAlign: "right",
  },
});
