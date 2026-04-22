import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useOrientation } from '@/hooks/useOrientation';

const Disclaimer = () => {
  const router = useRouter();
  const { scale } = useOrientation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { fontSize: Typography.sizes.md * scale }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}   // 👈 FIX: prevents hidden text
      >
        <Text style={[styles.title, { fontSize: Typography.sizes.xxl * scale }]}>Important Notice to Clients</Text>

        <Text style={styles.paragraph}>
          By accessing and using the FirstInvest mobile and online trading
          application provided by First Securities Brokers Limited, you acknowledge
          and agree to the following terms and conditions:
        </Text>

        <Text style={styles.sectionTitle}>System & Connectivity Risks</Text>
        <Text style={styles.bullet}>• Online trading through FirstInvest depends on internet connectivity, computer systems, and third-party networks. Interruptions, delays, or failures may prevent you from placing, modifying, or cancelling orders.</Text>
        <Text style={styles.bullet}>• Hardware or software malfunctions, power outages, or cyber incidents may result in incomplete or delayed transactions.</Text>

        <Text style={styles.sectionTitle}>Market Risks</Text>
        <Text style={styles.bullet}>• Prices of securities and other financial instruments can fluctuate rapidly. Orders placed via FirstInvest may be executed at prices different from those displayed at the time of entry.</Text>
        <Text style={styles.bullet}>• Market volatility may lead to partial fills, rejections, or execution at unfavorable prices.</Text>

        <Text style={styles.sectionTitle}>Execution Risks</Text>
        <Text style={styles.bullet}>• Orders submitted electronically through FirstInvest are subject to system availability and market conditions.</Text>
        <Text style={styles.bullet}>• There is no guarantee that orders will be executed immediately or at the requested price.</Text>

        <Text style={styles.sectionTitle}>Security Risks</Text>
        <Text style={styles.bullet}>• While First Securities Brokers Limited employs robust security measures, trading via FirstInvest carries inherent risks of unauthorized access, hacking, phishing, or data breaches.</Text>
        <Text style={styles.bullet}>• You are responsible for maintaining the confidentiality of your login credentials and ensuring the security of your device. Any transactions executed using your credentials will be deemed authorized by you.</Text>

        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.bullet}>• First Securities Brokers Limited is not liable for losses arising from technical failures, connectivity issues, or misuse of the First Securities application.</Text>
        <Text style={styles.bullet}>• Clients must ensure compliance with all trading and reporting obligations.</Text>

        <Text style={styles.sectionTitle}>Regulatory & Compliance Risks</Text>
        <Text style={styles.bullet}>• Transactions executed through FirstInvest are subject to applicable laws, regulations, and exchange rules.</Text>
        <Text style={styles.bullet}>• Clients must ensure compliance with all trading and reporting obligations.</Text>

        <Text style={styles.sectionTitle}>Client Responsibility</Text>
        <Text style={styles.bullet}>• You are solely responsible for verifying trade confirmations, monitoring account activity, and maintaining adequate risk controls.</Text>
        <Text style={styles.bullet}>• First Securities Brokers Limited is not liable for losses arising from technical failures, connectivity issues, or misuse of the First Securities application.</Text>
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
    width: 80,
    paddingVertical: 6,
  },
  backText: {
    fontFamily: Typography.fonts.semiBold,
    fontWeight: "600",
    color: Colors.brand.primary,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontWeight: '700',
    marginBottom: 15,
    color: Colors.brand.yellow,
  },
  paragraph: {
    fontFamily: Typography.fonts.regular,
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 8,
    color: Colors.brand.primary,
  },
  bullet: {
    fontFamily: Typography.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
    color: '#333',
  },
});
