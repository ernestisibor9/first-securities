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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
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
  const [orientation, setOrientation] = useState("PORTRAIT");
  const insets = useSafeAreaInsets();

  const itemsPerPage = 20;

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, []);

  const sub = ScreenOrientation.addOrientationChangeListener((event) => {
    const newOrientation =
      event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        ? "LANDSCAPE"
        : "PORTRAIT";
    setOrientation(newOrientation);
  });

  const { width } = Dimensions.get("window");
  const scale = orientation === "LANDSCAPE" ? width / 812 : width / 375;

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = priceData?.stock.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = priceData ? Math.ceil(priceData.stock.length / itemsPerPage) : 0;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: Platform.OS === 'ios' ? (orientation === "LANDSCAPE" ? 80 : 100) : 100,
          paddingBottom: insets.bottom + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor="#00338f"
            colors={["#00338f"]}
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
                  fontSize: 20 * scale,
                  marginLeft: orientation === "LANDSCAPE" ? 24 : 16 * scale,
                },
              ]}
            >
              Daily Price List - {formatDate(priceData.date)}
            </Text>

            {currentItems?.map((item: StockItem, idx: number) => (
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

            {/* Pagination */}
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
            <Feather name="arrow-left" size={22 * scale} color="#00338f" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Daily Price List</Text>
          <View style={{ width: 40 }} />
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
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: "700",
    color: "#00338f",
  },
  backButton: {
    padding: 4,
  },
  dateText: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 4,
    color: "#00338f",
  },
  stockRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stockName: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: "600",
    marginBottom: 4,
  },
  stockPrice: {
    fontFamily: 'Inter',
    color: "#333",
  },
  changeText: {
    fontFamily: 'Inter-Medium',
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
    backgroundColor: "#00338f",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  pageText: {
    fontFamily: 'Inter-Bold',
    color: "#fff",
    fontWeight: "bold",
  },
  pageNumber: {
    fontFamily: 'Inter-Bold',
    fontWeight: "bold",
  },
});
