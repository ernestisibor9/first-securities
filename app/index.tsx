import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import { LinearGradient } from 'expo-linear-gradient'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    ScreenOrientation.unlockAsync()

    const subscription = ScreenOrientation.addOrientationChangeListener(
      event => {
        console.log('Orientation changed:', event.orientationInfo.orientation)
      }
    )

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription)
    }
  }, [])

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
            <Text style={styles.heading}>
              <Text style={{ color: '#edb73a' }}>Trade </Text>
              Smarter{'\n'}Grow Your Wealth
            </Text>

            <Text style={styles.subHeading}>
              Your trusted partner for navigating the{'\n'}
              Nigerian Stock Market.
            </Text>

            <TouchableOpacity
              style={styles.textBtn}
              onPress={() => router.push('/marketinsight')}
            >
              <Text style={styles.underlineText}>MARKET INSIGHT</Text>
              <View style={styles.underlineBar} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textBtn}
              onPress={() => router.push('/dailypricelist')}
            >
              <Text style={styles.underlineText}>DAILY PRICE LIST</Text>
              <View style={styles.underlineBar} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Signup */}
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
    fontFamily: 'Inter28Bold', // ✅ Inter Bold
    marginBottom: 8
  },

  subHeading: {
    fontSize: 13,
    lineHeight: 18,
    color: '#fff',
    marginBottom: 50,
    fontFamily: 'Inter24'
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10
  },

  outlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1
  },

  loginBtn: {
    backgroundColor: '#edb73a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20
  },

  loginText: {
    color: '#000',
    fontFamily: 'Inter28Bold',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12
  },

  signupText: {
    color: '#ddd',
    fontSize: 13,
    fontFamily: 'Inter18',
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
    fontFamily: 'Inter28Bold',
  },

  textBtn: {
    alignItems: 'center',
    marginBottom: 42
  },

  underlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700', // makes text bold
    letterSpacing: 1,
    fontFamily: 'Inter18Bold' // ✅
  },

  underlineBar: {
    marginTop: 3,
    height: 1.5, // 👈 thinner (this is the key change)
    width: '41%',
    backgroundColor: '#fff',
    borderRadius: 2
  },

  disclaimer: {
    textAlign: 'center',
    marginTop: 10,
    color: '#edb73a',
    fontSize: 13,
    fontFamily: 'Inter28Bold',
  }
})
