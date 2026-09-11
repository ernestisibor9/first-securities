import { IPO_PORTAL_URL } from '@/constants/Urls'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function PublicOffersScreen () {
  const webviewRef = useRef<WebView>(null)
  const [orientation, setOrientation] = useState('PORTRAIT')
  const [webError, setWebError] = useState(false)
  const [webLoading, setWebLoading] = useState(true)
  const router = useRouter()
  const WEB_TIMEOUT = 15000

  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {})

    const onChange = ({ orientationInfo }: any) => {
      const o = orientationInfo.orientation
      setOrientation(
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
          ? 'LANDSCAPE'
          : 'PORTRAIT'
      )
    }

    const subscription =
      ScreenOrientation.addOrientationChangeListener(onChange)
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription)
    }
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const isLandscape = orientation === 'LANDSCAPE'

  useEffect(() => {
    const timer = setTimeout(() => {
      if (webLoading) setWebError(true)
    }, WEB_TIMEOUT)
    return () => clearTimeout(timer)
  }, [webLoading])

  const retryWeb = () => {
    setWebError(false)
    webviewRef.current?.reload()
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isLandscape ? '#fff' : '#f9f9f9' }
      ]}
    >
      {!isLandscape && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name='arrow-left' size={22} color='#002B5B' />
            <Text style={styles.backText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => webviewRef.current && webviewRef.current.reload()}
          >
            <Text style={styles.headerTitle}>Public Offers</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }}>
        {webError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to load page</Text>
            <Text style={styles.errorMessage}>
              Please check your internet connection and try again.
            </Text>
            <TouchableOpacity onPress={retryWeb} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webviewRef}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              borderRadius: isLandscape ? 0 : 8
            }}
            source={{ uri: IPO_PORTAL_URL }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size='large' color='#002B5B' />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['https://*']}
            cacheEnabled
            cacheMode='LOAD_DEFAULT'
            incognito={false}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            mixedContentMode='always'
            setBuiltInZoomControls={Platform.OS === 'android'}
            setDisplayZoomControls={false}
            onError={() => setWebError(true)}
            onHttpError={() => setWebError(true)}
            onLoadEnd={() => setWebLoading(false)}
            onLoadStart={() => setWebLoading(true)}
          />
        )}

        <Text style={styles.footerText}>
          First Securities is registered as a broker dealer{'\n'}
          and regulated by the Securities and Exchange{'\n'}
          Commission, Nigeria.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 3,
    zIndex: 10
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6
  },

  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#002B5B'
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002B5B'
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9'
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c00',
    marginBottom: 12
  },

  errorMessage: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24
  },

  retryButton: {
    backgroundColor: '#0A1E3C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },

  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },

  loadingText: {
    marginTop: 10,
    color: '#444',
    fontSize: 14
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9'
  }
})
