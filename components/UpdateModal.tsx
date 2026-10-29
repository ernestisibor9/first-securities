import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Linking from 'expo-linking';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface UpdateModalProps {
  visible: boolean;
  manifest: {
    message: string;
    forceUpdate: boolean;
    iosStoreUrl: string;
    androidStoreUrl: string;
    minRequiredVersion: string;
  };
  onDismiss: () => void;
}

export function UpdateModal({
  visible,
  manifest,
  onDismiss,
}: UpdateModalProps) {
  const surfaceColor = useThemeColor(
    { light: '#FFFFFF', dark: '#0E1712' },
    'background',
  );
  const textColor = useThemeColor({ light: '#0F1713', dark: '#F1F7F3' }, 'text');
  const borderColor = useThemeColor({ light: '#E2EAE5', dark: '#1C2E24' }, 'tabIconDefault');
  const primaryColor = useThemeColor({ light: '#0D6338', dark: '#10B981' }, 'tint');

  const storeUrl = Platform.OS === 'ios' ? manifest.iosStoreUrl : manifest.androidStoreUrl;

  const handleUpdate = () => {
    Linking.openURL(storeUrl).catch(() => {});
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={manifest.forceUpdate ? undefined : onDismiss}
      statusBarTranslucent
    >
      {manifest.forceUpdate ? (
        <View style={styles.overlay} />
      ) : (
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.sheetContainer}>
          <View style={[styles.sheet, { backgroundColor: surfaceColor }]}>
            <View style={styles.header}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                <ThemedText type="defaultSemiBold" style={styles.iconText} lightColor="#0D6338" darkColor="#10B981">
                  ↓
                </ThemedText>
              </View>
              <View style={styles.headerTextContainer}>
                <ThemedText type="title" style={styles.title} lightColor="#0D6338" darkColor="#10B981">
                  Update Available
                </ThemedText>
                <ThemedText type="subtitle" style={styles.version} lightColor="#3E4D44" darkColor="#94A89D">
                  New version {manifest.minRequiredVersion}
                </ThemedText>
              </View>
              {!manifest.forceUpdate && (
                <TouchableWithoutFeedback onPress={onDismiss}>
                  <View style={styles.closeBtn}>
                    <ThemedText type="defaultSemiBold" style={styles.closeText} lightColor="#3E4D44" darkColor="#94A89D">
                      ✕
                    </ThemedText>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>

            <ThemedText style={[styles.body, { color: textColor }]}>{manifest.message}</ThemedText>

            <View style={styles.actions}>
              {manifest.forceUpdate ? (
                <TouchableWithoutFeedback onPress={handleUpdate}>
                  <View style={[styles.primaryBtn, { backgroundColor: primaryColor }]}>
                    <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Update now</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <>
                  <TouchableWithoutFeedback onPress={handleSkip}>
                    <View style={[styles.secondaryBtn, { borderColor }]}>
                      <Text style={[styles.btnText, { color: primaryColor }]}>Skip</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={handleUpdate}>
                    <View style={[styles.primaryBtn, { backgroundColor: primaryColor }]}>
                      <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Update now</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = {
  sheetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sheet: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 4,
  },
  version: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,20,15,0.45)',
  },
} as Record<string, any>;
