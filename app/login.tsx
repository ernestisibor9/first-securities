import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'

const LOGIN_URL = 'https://alabiansolutions.com/client-mobile-app1/redirect.php'

export default function LoginScreen () {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    const openLogin = async () => {
      try {
        await WebBrowser.openBrowserAsync(LOGIN_URL, {
          controlsColor: '#002B5B',
          toolbarColor: '#fff'
        })
      } catch (e) {
        console.log('[WebBrowser] open failed', e)
      } finally {
        if (!cancelled) {
          router.back()
        }
      }
    }

    openLogin()

    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- router is stable from expo-router, re-triggering would re-open browser
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: '#f9f9f9' }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Feather name='arrow-left' size={22} color='#002B5B' />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <ActivityIndicator size='large' color='#002B5B' />
        <Text style={styles.loadingText}>Opening login...</Text>
      </View>

      <Text style={styles.footerText}>
        First Securities is registered as a broker dealer{'\n'}
        and regulated by the Securities and Exchange{'\n'}
        Commission, Nigeria.
      </Text>
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
