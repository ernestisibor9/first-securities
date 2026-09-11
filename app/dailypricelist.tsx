import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkeletonBox } from "@/components/Skeleton";

const DailyPriceList = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const itemsPerPage = 20;

  const { width } = Dimensions.get("window");
  const scale = width / 375;

  // --- Fetch data ---
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    fetch("https://regencyng.net/fs-api/proxy.php?type=daily_price", {
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPriceData(data);
        setLoading(false);
        setFetchError(null);
      })
      .catch((err: any) => {
        if (err.name === "AbortError") {
          setFetchError("Request timed out. Tap retry.");
        } else {
          setFetchError("Failed to load data. Tap retry.");
        }
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [retryKey]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = priceData?.stock.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = priceData
    ? Math.ceil(priceData.stock.length / itemsPerPage)
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            marginTop: 20 * scale,
            paddingHorizontal: 16 * scale,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22 * scale} color="#002B5B" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: 16 * scale }]}>
          Daily Price List
        </Text>
        <View style={{ width: 22 * scale }} />
      </View>

      {/* Content */}
      {loading ? (
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((key) => (
            <View key={key} style={styles.stockRow}>
              <SkeletonBox
                width="55%"
                height={15 * scale}
                radius={4}
                style={{ marginBottom: 8 }}
              />
              <SkeletonBox width="75%" height={13 * scale} radius={4} />
            </View>
          ))}
        </ScrollView>
      ) : priceData ? (
        <>
          <Text
            style={[
              styles.dateText,
              {
                fontSize: 20 * scale,
                marginLeft: 16 * scale,
              },
            ]}
          >
            Daily Price List - {formatDate(priceData.date)}
          </Text>

        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            {currentItems.map((item, idx) => (
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
            ))}
          </ScrollView>

          {/* Pagination */}
          <View
            style={[styles.pagination, { paddingBottom: insets.bottom + 16 }]}
          >
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 1 && { opacity: 0.5 },
              ]}
              onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={[styles.pageText, { fontSize: 13 * scale }]}>
                Prev
              </Text>
            </TouchableOpacity>

            <Text
              style={[styles.pageNumber, { fontSize: 14 * scale, marginHorizontal: 10 * scale }]}
            >
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === totalPages && { opacity: 0.5 },
              ]}
              onPress={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <Text style={[styles.pageText, { fontSize: 13 * scale }]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ alignItems: "center", marginTop: 20 * scale }}>
          <Text style={{ color: "#c00", marginBottom: 12 }}>{fetchError}</Text>
          <TouchableOpacity
            onPress={() => {
              setFetchError(null);
              setLoading(true);
              setRetryKey((k) => k + 1);
            }}
            style={styles.pageButton}
          >
            <Text style={[styles.pageText, { fontSize: 13 * scale }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DailyPriceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  headerTitle: {
    fontWeight: "700",
    color: "#002B5B",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#555",
  },
  dateText: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
    color: "#002B5B",
  },
  stockRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stockName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  stockPrice: {
    color: "#333",
  },
  changeText: {
    fontWeight: "500",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#002B5B",
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 48,
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    fontWeight: "bold",
  },
});
