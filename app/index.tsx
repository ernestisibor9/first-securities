import * as SystemUI from 'expo-system-ui'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


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

  useFocusEffect(
    React.useCallback(() => {
      const NAVY = '#0A1E3C'

      StatusBar.setBarStyle('light-content')
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('transparent', true)

      if (Platform.OS === 'android') {
        SystemUI.setBackgroundColorAsync(NAVY)
      }

      return () => {
        StatusBar.setBarStyle('default')
        StatusBar.setTranslucent(false)

        if (Platform.OS === 'android') {
          SystemUI.setBackgroundColorAsync(null)
        }
      }
    }, [])
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    resizeMode: 'contain',
    marginTop: 30
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

  tradeLoginBtn: {
    backgroundColor: '#edb73a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 48
  },

  tradeLoginText: {
    color: '#000',
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
