import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  Platform,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useOrientation } from "@/hooks/useOrientation";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { SkeletonRow } from "@/components/SkeletonRow";

interface StockItem {
  name: string;
  price: number;
  change: number;
}

interface PriceData {
  date: string;
  stock: StockItem[];
}

const DailyPriceList = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLandscape, scale } = useOrientation();
  const insets = useSafeAreaInsets();
  const itemsPerPage = 20;

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    fetch("https://regencyng.net/fs-api/proxy.php?type=daily_price")
      .then((res) => res.json())
      .then((data) => {
        setPriceData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredStocks = priceData?.stock.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredStocks.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
 
  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: Platform.OS === 'ios' ? (isLandscape ? 130 : 180) : 180,
          paddingBottom: insets.bottom + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={Colors.brand.primary}
            colors={[Colors.brand.primary]}
            progressViewOffset={Platform.OS === 'ios' ? 90 : 110}
          />
        }
      >
        {loading ? (
          <View style={{ marginTop: 16 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </View>
        ) : priceData ? (
          <>
            <Text
              style={[
                styles.dateText,
                {
                  fontSize: Typography.sizes.xl * scale,
                  marginLeft: isLandscape ? 24 : 16 * scale,
                  marginTop: 8 * scale,
                },
              ]}
            >
              Daily Price List - {formatDate(priceData.date)}
            </Text>
 
            {currentItems.length === 0 ? (
              <View style={[styles.emptyContainer, { marginTop: 40 * scale }]}>
                <Feather name="search" size={50 * scale} color="#ccc" />
                <Text style={[styles.emptyText, { fontSize: Typography.sizes.md * scale, marginTop: 10 * scale }]}>
                  No stocks found matching "{searchQuery}"
                </Text>
              </View>
            ) : (
              currentItems.map((item: StockItem, idx: number) => (
                <View key={idx} style={styles.stockRow}>
                  <Text style={[styles.stockName, { fontSize: 15 * scale }]}>
                    {item.name}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.stockPrice, { fontSize: 14 * scale }]}>
                      ₦{item.price.toFixed(2)} |{" "}
                    </Text>
                    <Text
                      style={[
                        styles.changeText,
                        {
                          color: item.change >= 0 ? "green" : "red",
                          fontSize: 13 * scale,
                        },
                      ]}
                    >
                      <Text style={{ color: "black" }}>Chg: </Text>
                      {item.change >= 0 ? "+" : ""}
                      {item.change.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.pageButton, currentPage === 1 && { opacity: 0.5 }]}
                  onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <Text style={[styles.pageText, { fontSize: 13 * scale }]}>Prev</Text>
                </TouchableOpacity>

                <Text style={[styles.pageNumber, { fontSize: 14 * scale, marginHorizontal: 10 * scale }]}>
                  {currentPage} / {totalPages}
                </Text>

                <TouchableOpacity
                  style={[styles.pageButton, currentPage === totalPages && { opacity: 0.5 }]}
                  onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <Text style={[styles.pageText, { fontSize: 13 * scale }]}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 * scale }}>Failed to load data</Text>
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
          <Text style={styles.headerTitleText}>Daily Price List</Text>
          <View style={{ width: 40 }} />
        </View>
 
        {/* Search Bar */}
        <View style={[styles.searchContainer, { marginHorizontal: 16 * scale, marginBottom: 12 * scale }]}>
          <Feather name="search" size={18 * scale} color="#666" style={{ marginRight: 8 * scale }} />
          <TextInput
            placeholder="Search stock name..."
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

export default DailyPriceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
  dateText: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 4,
    color: Colors.brand.primary,
  },
  stockRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stockName: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    marginBottom: 4,
  },
  stockPrice: {
    fontFamily: Typography.fonts.regular,
    color: "#333",
  },
  changeText: {
    fontFamily: Typography.fonts.medium,
    fontWeight: "500",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.brand.primary,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  pageText: {
    fontFamily: Typography.fonts.bold,
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    fontFamily: Typography.fonts.bold,
    fontWeight: "bold",
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
