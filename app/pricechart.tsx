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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-gifted-charts";
import * as ScreenOrientation from "expo-screen-orientation";

export default function PriceChart() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const router = useRouter();

  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>("");
  const [chartData, setChartData] = useState<{ date: Date; price: number }[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

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
        console.error("❌ Failed to load favorites:", err);
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
      console.error("❌ Invalid JSON response:", text);
      throw new Error("Invalid JSON response from API");
    }
  };

  // ✅ Fetch stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://regencyng.net/fs-api/proxy.php?type=stocks");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await safeJson(res);

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
          console.error("❌ Stocks API did not return an array:", data);
        }
      } catch (err: any) {
        console.error("❌ Failed to fetch stocks:", err);
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
            .map((item) => {
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

          // ✅ Find highest price
          if (recentData.length > 0) {
            const highest = recentData.reduce((prev, curr) =>
              curr.price > prev.price ? curr : prev
            );
            console.log("📈 Highest Price:", highest.price, "on", highest.date);
          }
        } else {
          console.error("❌ Chart API did not return an array:", data);
          setChartData([]);
        }

        const stockObj = stocks.find((s) => s.id === selectedStock);
        if (stockObj) setSelectedStockName(stockObj.name);
      } catch (err: any) {
        console.error("❌ Failed to fetch chart data:", err);
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
      console.error("❌ Failed to toggle favorite:", err);
      Alert.alert("Error", "Unable to update favorites.");
    }
  };

  // ✅ Convert to GiftedCharts format
  const chartPoints = chartData.map((item) => ({
    value: item.price,
    label: item.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // ✅ Calculate Y-axis limits
  const prices = chartPoints.map((p) => p.value);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#002B5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Price Chart</Text>

        {selectedStock && (
          <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: "auto" }}>
            {favorites.includes(selectedStock) ? (
              <Feather name="star" size={22} color="#FFD700" />
            ) : (
              <Ionicons name="star-outline" size={22} color="#002B5B" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Stock Picker */}
      <View style={[styles.pickerContainer, { width: width * 0.9 }]}>
        <Picker
          selectedValue={selectedStock}
          onValueChange={(itemValue) => {
            setSelectedStock(itemValue);
            const stockObj = stocks.find((s) => s.id === itemValue);
            if (stockObj) setSelectedStockName(stockObj.name);
          }}
          style={{ width: "100%", height: 50 }}
        >
          {stocks.map((stock) => (
            <Picker.Item key={stock.id} label={stock.name} value={stock.id} />
          ))}
        </Picker>
      </View>

      {/* Chart */}
      <View style={[styles.chartCard, { width: width * 0.95 }]}>
        <Text style={styles.chartTitle}>Stock Chart</Text>
        {loadingChart ? (
          <ActivityIndicator size="large" color="#002B5B" style={{ padding: 50 }} />
        ) : chartPoints.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <LineChart
              data={chartPoints}
              height={isLandscape ? height * 0.8 : height * 0.45}
              width={isLandscape ? width * 1.5 : Math.max(width, chartPoints.length * 60)}
              color="crimson"
              thickness={2}
              hideRules={false}
              hideDataPoints={false}
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor="crimson"
              yAxisLabel=""
              xAxisLabelTextStyle={{ fontSize: 10 }}
              yAxisTextStyle={{ fontSize: 10 }}
              xAxisColor="#ddd"
              yAxisColor="#ddd"
              showVerticalLines
              spacing={10}
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
  container: { padding: 16, backgroundColor: "#f5f5f5", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 40,
    marginBottom: 20,
    width: "100%",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002B5B",
    marginLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  stockInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#002B5B",
    textAlign: "center",
    marginTop: 10,
  },
});
