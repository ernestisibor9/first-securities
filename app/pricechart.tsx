import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-gifted-charts";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface Stock {
  id: string;
  name: string;
}

export default function PriceChart() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const [chartData, setChartData] = useState<{ date: Date; price: number }[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempStock, setTempStock] = useState<string | null>(null);

  // ✅ Unlock screen rotation on mount
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  // ✅ Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("favorites");
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
      }
    };
    loadFavorites();
  }, []);

  // ✅ Helper: safe JSON
  const safeJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response from API");
    }
  };

  // ✅ Fetch stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://regencyng.net/fs-api/proxy.php?type=stocks");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: Stock[] = await safeJson(res);

        if (Array.isArray(data)) {
          setStocks(data);

          // Default = Accesscorp
          const accesscorp = data.find((s) => s.name?.toUpperCase() === "ACCESSCORP");
          if (accesscorp) {
            setSelectedStock(accesscorp.id);
            setSelectedStockName(accesscorp.name);
          } else if (data.length > 0) {
            setSelectedStock(data[0].id);
            setSelectedStockName(data[0].name);
          }
        } else {
        }
      } catch (err: any) {
        Alert.alert("Error", "Unable to fetch stock list. Try again later.");
      }
    };
    fetchStocks();
  }, []);

  // ✅ Fetch chart data
  useEffect(() => {
    if (!selectedStock) return;

    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const res = await fetch(
          `https://regencyng.net/fs-api/proxy.php?stock=${selectedStock}&type=stock_chart`
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await safeJson(res);

        if (Array.isArray(data)) {
          const parsedData = data
            .map((item: { date: string; price: string }) => {
              try {
                const [day, month, year] = item.date.split("/");
                return {
                  date: new Date(`${year}-${month}-${day}`),
                  price: Number(item.price),
                };
              } catch {
                return null;
              }
            })
            .filter(Boolean) as { date: Date; price: number }[];

          // Filter last 6 months
          const cutoff = new Date();
          cutoff.setMonth(cutoff.getMonth() - 6);
          const recentData = parsedData.filter((d) => d.date >= cutoff);

          setChartData(recentData);

          // ✅ Find highest price (checked if you need this value later, removed unused variable for now)
          if (recentData.length > 0) {
            recentData.reduce((prev, curr) =>
              curr.price > prev.price ? curr : prev
            );
          }
        } else {
          setChartData([]);
        }

        const stockObj = stocks.find((s) => s.id === (selectedStock || ""));
        if (stockObj) setSelectedStockName(stockObj.name);
      } catch (err: any) {
        Alert.alert("Error", "Unable to fetch chart data.");
        setChartData([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [selectedStock]);

  // ✅ Toggle favorite
  const toggleFavorite = async () => {
    try {
      let updated;
      if (favorites.includes(selectedStock!)) {
        updated = favorites.filter((id) => id !== selectedStock);
      } else {
        updated = [...favorites, selectedStock!];
      }
      setFavorites(updated);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    } catch (err: any) {
      Alert.alert("Error", "Unable to update favorites.");
    }
  };

  // ✅ Convert to GiftedCharts format
  const chartPoints = chartData.map((item, index) => ({
    value: item.price,
    // Show a label every 5 trading days (≈ 1 calendar week)
    label: index % 5 === 0 ? item.date.toLocaleDateString("en-US", {
      month: "short" as const,
      day: "numeric" as const,
    }) : "",
  }));

  // ✅ Calculate Y-axis limits
  const prices = chartPoints.map((p) => p.value);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <ScrollView 
      style={{ backgroundColor: "#f5f5f5" }}
      contentContainerStyle={styles.container}
    >
      <StatusBar style="dark" />
      {/* Header */}
      <View style={[styles.header, { marginTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#0033A0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Price Chart</Text>

        {selectedStock && (
          <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: "auto" }}>
            {favorites.includes(selectedStock) ? (
              <Feather name="star" size={22} color="#FFD700" />
            ) : (
              <Ionicons name="star-outline" size={22} color="#0033A0" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Stock Selector Button */}
      <TouchableOpacity
        style={[styles.pickerButton, { width: width * 0.9 }]}
        onPress={() => {
          setTempStock(selectedStock);
          setPickerVisible(true);
        }}
      >
        <Text style={styles.pickerButtonText} numberOfLines={1}>
          {selectedStockName || "Select a stock..."}
        </Text>
        <Feather name="chevron-down" size={18} color="#0033A0" />
      </TouchableOpacity>

      {/* Native Modal Picker */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        />
        <View style={styles.modalSheet}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Stock</Text>
            <TouchableOpacity
              onPress={() => {
                if (tempStock) {
                  setSelectedStock(tempStock);
                  const stockObj = stocks.find((s) => s.id === tempStock);
                  if (stockObj) setSelectedStockName(stockObj.name);
                }
                setPickerVisible(false);
              }}
            >
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>
          {/* Picker Wheel */}
          <Picker
            selectedValue={tempStock}
            onValueChange={(val) => {
              const v = val as string | null;
              setTempStock(v);
            }}
            style={{ width: "100%" }}
          >
            {stocks.map((stock: Stock) => (
              <Picker.Item key={stock.id} label={stock.name} value={stock.id} color="#000" />
            ))}
          </Picker>
        </View>
      </Modal>

      {/* Chart */}
      <View style={[styles.chartCard, { width: width * 0.95 }]}>
        <Text style={styles.chartTitle}>Stock Chart</Text>
        {loadingChart ? (
          <ActivityIndicator size="large" color="#0033A0" style={{ padding: 50 }} />
        ) : chartPoints.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <LineChart
              data={chartPoints}
              height={isLandscape ? height * 0.8 : height * 0.45}
              width={isLandscape ? width * 1.5 : Math.max(width, chartPoints.length * 62)}
              color="crimson"
              thickness={2}
              hideRules={false}
              hideDataPoints={false}
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor="crimson"
              yAxisLabelPrefix=""
              xAxisLabelTextStyle={{ fontSize: 10, color: "#333" }}
              yAxisTextStyle={{ fontSize: 10, color: "#333" }}
              xAxisColor="#ddd"
              yAxisColor="#ddd"
              showVerticalLines
              spacing={40}
              initialSpacing={20}
              formatYLabel={(value) => `${value}`}
              // ✅ Start Y-axis at min value instead of 0
              yAxisOffset={minPrice}
              yAxisExtraHeight={(maxPrice - minPrice) * 0.1}
            />
          </ScrollView>
        ) : (
          <Text style={{ textAlign: "center", padding: 20 }}>
            No chart data available for this stock.
          </Text>
        )}
      </View>

      {/* Stock Info */}
      {selectedStockName ? (
        <Text style={styles.stockInfo}>
          {selectedStockName} — Price (₦) — Last 6 Months
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: "#f5f5f5", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 40,
    marginBottom: 20,
    width: "100%",
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: "600",
    color: "#0033A0",
    marginLeft: 10,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  pickerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: "#0033A0",
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: "700",
    color: "#0033A0",
  },
  modalCancel: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: "#888",
  },
  modalDone: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: "#0033A0",
    fontWeight: "700",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  stockInfo: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: "600",
    color: "#0033A0",
    textAlign: "center",
    marginTop: 10,
  },
});
