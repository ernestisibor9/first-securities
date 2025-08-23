import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Get screen width and set scale factor
const { width } = Dimensions.get("window");
const scale = width / 375; // 375 = base width (iPhone 11)

const DailyPriceList = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetch("https://regencyng.net/fs-api/proxy.php?type=daily_price")
      .then((res) => res.json())
      .then((data) => {
        setPriceData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching daily price list:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = priceData?.stock.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = priceData
    ? Math.ceil(priceData.stock.length / itemsPerPage)
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22 * scale} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Price List</Text>
        <View style={{ width: 22 * scale }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text style={[styles.loadingText, { marginTop: 10 * scale }]}>
            Loading daily price list...
          </Text>
        </View>
      ) : priceData ? (
        <>
          <Text style={styles.dateText}>
            Daily Price List - {formatDate(priceData.date)}
          </Text>

          <ScrollView style={{ flex: 1 }}>
            {currentItems.map((item: any, idx: number) => (
              <View key={idx} style={styles.stockRow}>
                <Text style={styles.stockName}>{item.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.stockPrice}>
                    ₦{item.price.toFixed(2)} |{" "}
                  </Text>
                  <Text
                    style={[
                      styles.changeText,
                      { color: item.change >= 0 ? "green" : "red" },
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
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && { opacity: 0.5 }]}
              onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageText}>Prev</Text>
            </TouchableOpacity>

            <Text style={styles.pageNumber}>
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
              <Text style={styles.pageText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 * scale }}>
          Failed to load data
        </Text>
      )}
    </View>
  );
};

export default DailyPriceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40 * scale,
    marginBottom: 10 * scale,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16 * scale,
    paddingBottom: 12 * scale,
    marginTop: 20 * scale,
  },
  headerTitle: {
    fontSize: 16 * scale,
    fontWeight: "700",
    color: "#002B5B",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14 * scale,
    color: "#555",
  },
  dateText: {
    fontSize: 20 * scale,
    fontWeight: "600",
    marginBottom: 8 * scale,
    marginLeft: 16 * scale,
    marginTop: 4 * scale,
    color: "#002B5B",
  },
  stockRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
  },
  stockName: {
    fontSize: 15 * scale,
    fontWeight: "600",
    marginBottom: 4 * scale,
  },
  stockPrice: {
    fontSize: 14 * scale,
    color: "#333",
  },
  changeText: {
    fontSize: 13 * scale,
    fontWeight: "500",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16 * scale,
  },
  pageButton: {
    paddingHorizontal: 16 * scale,
    paddingVertical: 8 * scale,
    backgroundColor: "#002B5B",
    borderRadius: 5 * scale,
    marginHorizontal: 5 * scale,
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13 * scale,
  },
  pageNumber: {
    fontSize: 14 * scale,
    fontWeight: "bold",
    marginHorizontal: 10 * scale,
  },
});
