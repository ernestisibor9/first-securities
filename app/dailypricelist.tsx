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
import * as ScreenOrientation from "expo-screen-orientation";

const DailyPriceList = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orientation, setOrientation] = useState("PORTRAIT");

  const itemsPerPage = 20;

  // --- Orientation setup ---
  useEffect(() => {
    // Get initial orientation
    (async () => {
      const current = await ScreenOrientation.getOrientationAsync();
      setOrientation(
        current === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          current === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT"
      );
    })();

    // Listen for changes
    const sub = ScreenOrientation.addOrientationChangeListener((event) => {
      const newOrientation =
        event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? "LANDSCAPE"
          : "PORTRAIT";
      setOrientation(newOrientation);
    });

    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, []);

  // Adjust scaling dynamically
  const { width } = Dimensions.get("window");
  const scale =
    orientation === "LANDSCAPE" ? width / 812 : width / 375; // base widths

  // --- Fetch data ---
  useEffect(() => {
    fetch("https://regencyng.net/fs-api/proxy.php?type=daily_price")
      .then((res) => res.json())
      .then((data) => {
        setPriceData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    <View style={[styles.container, { paddingTop: 40 * scale }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            marginTop: 20 * scale,
            paddingHorizontal: orientation === "LANDSCAPE" ? 24 : 16 * scale,
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
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#002B5B" />
          <Text style={[styles.loadingText, { marginTop: 10 * scale }]}>
            Loading daily price list...
          </Text>
        </View>
      ) : priceData ? (
        <>
          <Text
            style={[
              styles.dateText,
              {
                fontSize: 20 * scale,
                marginLeft: orientation === "LANDSCAPE" ? 24 : 16 * scale,
              },
            ]}
          >
            Daily Price List - {formatDate(priceData.date)}
          </Text>

          <ScrollView style={{ flex: 1 }}>
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
          <View style={styles.pagination}>
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
    paddingVertical: 8,
    backgroundColor: "#002B5B",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    fontWeight: "bold",
  },
});
