import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

// Subtle mount stagger, UI-thread only (opacity + translateY support native driver)
const FadeUp = ({
  delay = 0,
  children
}: {
  delay?: number
  children: React.ReactNode
}) => {
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 500,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    })
    animation.start()
    return () => animation.stop()
  }, [progress, delay])

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [24, 0]
            })
          }
        ]
      }}
    >
      {children}
    </Animated.View>
  )
}

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    ScreenOrientation.unlockAsync()
    // Pre-render the portal route so it opens instantly on tap
    router.prefetch('/publicoffers')

    const subscription = ScreenOrientation.addOrientationChangeListener(
      event => {
        console.log('Orientation changed:', event.orientationInfo.orientation)
      }
    )

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription)
    }
  }, [router])

  const openIpoPortal = () => {
    router.push('/publicoffers')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='light-content'
      />

      <ImageBackground
        source={require('../assets/images/customer.png')}
        style={styles.bg}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.4)', 'rgba(0,53,160,0.45)', '#79B076']}
          locations={[0, 0.2, 1]}
          style={styles.gradient}
        >
          {/* Logo */}
          <View style={styles.headerLogo}>
            <Image
              source={require('../assets/images/logo2.png')}
              style={styles.logo}
            />
          </View>

          {/* Bottom Content */}
          <View style={styles.content}>
            <FadeUp delay={0}>
              <Text style={styles.heading}>
                <Text style={{ color: '#edb73a' }}>Trade </Text>
                Smarter{'\n'}Grow Your Wealth
              </Text>

              <Text style={styles.subHeading}>
                Your trusted partner for navigating the{'\n'}
                Nigerian Stock Market
              </Text>
            </FadeUp>

            <FadeUp delay={100}>
              <View style={styles.insightRow}>
              <TouchableOpacity
                style={styles.textBtn}
                onPress={() => router.push('/marketinsight')}
                accessibilityRole='link'
                accessibilityLabel='Market insight'
              >
                <Text style={styles.underlineText}>MARKET INSIGHT</Text>
                <View style={styles.underlineBar} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textBtn}
                onPress={() => router.push('/dailypricelist')}
                accessibilityRole='link'
                accessibilityLabel='Daily price list'
              >
                <Text style={styles.underlineText}>DAILY PRICE LIST</Text>
                <View style={styles.underlineBar} />
              </TouchableOpacity>
            </View>
            </FadeUp>

            {/* Proposal A: Dangote IPO banner (visual, no link) */}
            <FadeUp delay={200}>
            <View style={styles.ipoBanner} accessibilityRole='header'>
              <View style={styles.ipoLeft}>
                <MaterialCommunityIcons
                  name='medal-outline'
                  size={20}
                  color='#edb73a'
                />
                <Text style={styles.ipoTitle}>DANGOTE IPO</Text>
              </View>
              <View style={styles.offerPill}>
                <Text style={styles.offerPillText}>OFFER OPEN</Text>
              </View>
            </View>
            </FadeUp>

            {/* Proposal A: Public Offers Portal -> IPO site */}
            <FadeUp delay={300}>
            <TouchableOpacity
              style={styles.portalBtn}
              onPress={openIpoPortal}
              accessibilityRole='link'
              accessibilityLabel='Open Public Offers Portal'
            >
              <MaterialCommunityIcons
                name='view-grid-outline'
                size={18}
                color='#fff'
              />
              <Text style={styles.portalText}>PUBLIC OFFERS PORTAL</Text>
              <Ionicons name='arrow-forward' size={18} color='#fff' />
            </TouchableOpacity>
            </FadeUp>

            {/* Proposal A: Outline Trade Login */}
            <FadeUp delay={400}>
            <TouchableOpacity
              style={styles.tradeLoginBtn}
              onPress={() => router.push('/login')}
              accessibilityRole='button'
              accessibilityLabel='Trade login'
            >
              <Text style={styles.tradeLoginText}>TRADE LOGIN</Text>
            </TouchableOpacity>
            </FadeUp>

            {/* Signup */}
            <FadeUp delay={500}>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Links */}
            <View style={styles.bottomLinks}>
              <TouchableOpacity onPress={() => router.push('/pricechart')}>
                <Text style={styles.link}>Price Chart</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/pricealert')}>
                <Text style={styles.link}>Price Alert</Text>
              </TouchableOpacity>
            </View>

            {/* Disclaimer */}
            <TouchableOpacity onPress={() => router.push('/disclaimer')}>
              <Text style={styles.disclaimer}>DISCLAIMER</Text>
            </TouchableOpacity>
            </FadeUp>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Index

const NAVY = '#0A1E3C'
const GOLD = '#edb73a'
const OFFER_GREEN = '#16A34A'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between'
  },

  headerLogo: {
    alignItems: 'flex-end'
  },

  logo: {
    width: 170,
    height: 90,
    resizeMode: 'contain'
  },

  content: {
    marginBottom: 10
  },

  heading: {
    fontSize: 33,
    color: '#fff',
    lineHeight: 40,
    fontFamily: 'Inter28Bold',
    marginBottom: 8
  },

  subHeading: {
    fontSize: 13,
    lineHeight: 18,
    color: '#fff',
    marginBottom: 24,
    fontFamily: 'Inter24'
  },

  insightRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    marginBottom: 20
  },

  ipoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NAVY,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    minHeight: 48
  },

  ipoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },

  ipoTitle: {
    color: GOLD,
    fontSize: 13,
    fontFamily: 'Inter28Bold',
    letterSpacing: 1
  },

  offerPill: {
    backgroundColor: OFFER_GREEN,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8
  },

  offerPillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },

  portalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: NAVY,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 48
  },

  portalText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter28Bold',
    letterSpacing: 1
  },

  tradeLoginBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 48
  },

  tradeLoginText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter28Bold',
    letterSpacing: 1
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4
  },

  signupText: {
    color: '#ddd',
    fontSize: 13,
    fontFamily: 'Inter18'
  },

  signupLink: {
    color: '#fff',
    fontFamily: 'Inter28Bold',
    fontSize: 13
  },

  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10
  },

  link: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter28Bold'
  },

  textBtn: {
    alignItems: 'center'
  },

  underlineText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'Inter18Bold'
  },

  underlineBar: {
    marginTop: 3,
    height: 1.5,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 2
  },

  disclaimer: {
    textAlign: 'center',
    marginTop: 10,
    color: '#edb73a',
    fontSize: 13,
    fontFamily: 'Inter28Bold'
  }
})
