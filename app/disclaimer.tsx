import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

const Disclaimer = () => {
  const router = useRouter();

  // Allow auto-rotation
  useEffect(() => {
    ScreenOrientation.unlockAsync();

    // Optional: lock back to portrait when leaving screen
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Disclaimer */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}   // 👈 FIX: prevents hidden text
      >
        <Text style={styles.title}>Important Notice to Clients</Text>

        <Text style={styles.paragraph}>
          By accessing and using the First Invest mobile and online trading
          application provided by First Securities Brokers Limited, you acknowledge
          and agree to the following risks associated with electronic trading:
        </Text>

        <Text style={styles.sectionTitle}>System & Connectivity Risks</Text>
        <Text style={styles.bullet}>• Online trading through First Invest depends on internet connectivity, computer systems, and third-party networks. Interruptions, delays, or failures may prevent you from placing, modifying, or cancelling orders.</Text>
        <Text style={styles.bullet}>• Hardware or software malfunctions, power outages, or cyber incidents may result in incomplete or delayed transactions.</Text>

        <Text style={styles.sectionTitle}>Market Risks</Text>
        <Text style={styles.bullet}>• Prices of securities and other financial instruments can fluctuate rapidly. Orders placed via First Invest may be executed at prices different from those displayed at the time of entry.</Text>
        <Text style={styles.bullet}>• Market volatility may lead to partial fills, rejections, or execution at unfavorable prices.</Text>

        <Text style={styles.sectionTitle}>Execution Risks</Text>
        <Text style={styles.bullet}>• Orders submitted electronically through First Invest are subject to system availability and market conditions.</Text>
        <Text style={styles.bullet}>• There is no guarantee that orders will be executed immediately or at the requested price.</Text>

        <Text style={styles.sectionTitle}>Security Risks</Text>
        <Text style={styles.bullet}>• While First Securities Brokers Limited employs robust security measures, trading via First Invest carries inherent risks of unauthorized access, hacking, phishing, or data breaches.</Text>
        <Text style={styles.bullet}>• Clients are responsible for safeguarding login credentials and ensuring secure access to their accounts.</Text>

        <Text style={styles.sectionTitle}>Regulatory & Compliance Risks</Text>
        <Text style={styles.bullet}>• Transactions executed through First Invest are subject to applicable laws, regulations, and exchange rules.</Text>
        <Text style={styles.bullet}>• Clients must ensure compliance with all trading and reporting obligations.</Text>

        <Text style={styles.sectionTitle}>Client Responsibility</Text>
        <Text style={styles.bullet}>• You are solely responsible for verifying trade confirmations, monitoring account activity, and maintaining adequate risk controls.</Text>
        <Text style={styles.bullet}>• First Securities Brokers Limited is not liable for losses arising from technical failures, connectivity issues, or misuse of the First Invest application.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Disclaimer;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 70,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#002B5B",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
});
