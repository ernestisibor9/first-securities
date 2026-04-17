import { SkeletonCard } from "@/components/SkeletonCard";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useOrientation } from "@/hooks/useOrientation";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MarketInsight = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { scale, isLandscape } = useOrientation();
  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://regencyng.net/fs-api/proxy.php?type=market",
      );
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
  const filteredInsights = insights.filter(item => 
    String(item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(item.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Platform.OS === "ios" ? (isLandscape ? 130 : 180) : 180,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 16 * scale,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand.primary}
            colors={[Colors.brand.primary]}
            progressViewOffset={Platform.OS === "ios" ? 90 : 110}
          />
        }
      >
        {loading ? (
          <View style={{ marginTop: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        ) : filteredInsights.length === 0 ? (
          <View style={[styles.emptyContainer, { marginTop: 40 * scale }]}>
            <Feather name="search" size={50 * scale} color="#ccc" />
            <Text style={[styles.emptyText, { fontSize: Typography.sizes.md * scale, marginTop: 10 * scale }]}>
              No insights found matching "{searchQuery}"
            </Text>
          </View>
        ) : (
          filteredInsights.map((item, idx) => {
            const shortContent = String(item.content || "");
            const displayContent =
              shortContent.length > 140
                ? shortContent.slice(0, 140) + "..."
                : shortContent;

            return (
              <View
                key={idx}
                style={[
                  styles.card,
                  {
                    padding: 16 * scale,
                    borderRadius: 12 * scale,
                    marginBottom: 16 * scale,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { fontSize: 16 * scale, marginBottom: 6 * scale },
                  ]}
                >
                  {String(item.title || "")}
                </Text>
                <Text
                  style={[
                    styles.desc,
                    { fontSize: 14 * scale, marginBottom: 8 * scale },
                  ]}
                >
                  {displayContent}
                </Text>
                {item.url ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(String(item.url))}
                  >
                    <Text
                      style={[
                        styles.link,
                        { fontSize: 12 * scale, marginBottom: 8 * scale },
                      ]}
                    >
                      {String(item.url)}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <Text style={[styles.time, { fontSize: 11 * scale }]}>
                  {String(item.date || "")}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Premium Blurred Header */}
      <BlurView
        intensity={80}
        tint="light"
        style={[
          styles.headerAbsolute,
          { paddingTop: Math.max(insets.top, 20) },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather
              name="arrow-left"
              size={22 * scale}
              color={Colors.brand.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Market Insight</Text>
          <View style={{ width: 40 }} />
        </View>
 
        {/* Search Bar with breathing room */}
        <View style={[styles.searchContainer, { marginHorizontal: 16 * scale, marginBottom: 16 * scale }]}>
          <Feather name="search" size={18 * scale} color="#666" style={{ marginRight: 8 * scale }} />
          <TextInput
            placeholder="Search insights..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { fontSize: 14 * scale, height: 40 * scale }]}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x-circle" size={18 * scale} color="#999" />
            </TouchableOpacity>
          )}
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
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.brand.primary,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {},
  card: {
    backgroundColor: "#F5F7FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontWeight: "700",
    color: Colors.brand.primary,
  },
  desc: {
    fontFamily: Typography.fonts.regular,
    color: "#444",
  },
  link: {
    fontFamily: Typography.fonts.medium,
    color: Colors.brand.primary,
    textDecorationLine: "underline",
  },
  time: {
    fontFamily: Typography.fonts.regular,
    color: "#888",
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fonts.regular,
    color: "#333",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: Typography.fonts.medium,
    color: "#999",
    textAlign: "center",
  },
});
