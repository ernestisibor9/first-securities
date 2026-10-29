import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Linking from 'expo-linking';
import { ThemedText } from '@/components/ThemedText';

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

const PRIMARY = '#0D6338';
const ON_PRIMARY = '#FFFFFF';
const SURFACE = '#FFFFFF';
const TEXT = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E2EAE5';
const DARK_TEXT = '#ECEDEE';
const DARK_TEXT_MUTED = '#9BA1A6';

export function UpdateModal({
  visible,
  manifest,
  onDismiss,
}: UpdateModalProps) {
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
        <View style={[styles.overlay, { zIndex: 0 }]} />
      ) : (
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={[styles.overlay, { zIndex: 0 }]} />
        </TouchableWithoutFeedback>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.sheetContainer, { zIndex: 10 }]}>
          <View style={[styles.sheet, { backgroundColor: SURFACE }]}>
            <View style={styles.header}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                <ThemedText style={[styles.iconText, { color: PRIMARY }]} lightColor={PRIMARY} darkColor={PRIMARY} type="default">
                  ↓
                </ThemedText>
              </View>
              <View style={styles.headerTextContainer}>
                <ThemedText style={[styles.title, { color: TEXT }]} lightColor={TEXT} darkColor={DARK_TEXT} type="title">
                  Update Available
                </ThemedText>
                <ThemedText style={[styles.version, { color: TEXT_MUTED }]} lightColor={TEXT_MUTED} darkColor={DARK_TEXT_MUTED} type="subtitle">
                  New version {manifest.minRequiredVersion}
                </ThemedText>
              </View>
              {!manifest.forceUpdate && (
                <TouchableWithoutFeedback onPress={onDismiss}>
                  <View style={styles.closeBtn}>
                    <ThemedText style={[styles.closeText, { color: TEXT_MUTED }]} lightColor={TEXT_MUTED} darkColor={DARK_TEXT_MUTED} type="defaultSemiBold">
                      ✕
                    </ThemedText>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>

            <ThemedText style={[styles.body, { color: TEXT }]} lightColor={TEXT} darkColor={DARK_TEXT} type="default">
              {manifest.message}
            </ThemedText>

            <View style={styles.actions}>
              {manifest.forceUpdate ? (
                <TouchableWithoutFeedback onPress={handleUpdate}>
                  <View style={[styles.primaryBtn, { backgroundColor: PRIMARY }]}>
                    <ThemedText style={[styles.btnText, { color: ON_PRIMARY }]} lightColor={ON_PRIMARY} darkColor={ON_PRIMARY} type="title">
                      Update now
                    </ThemedText>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <>
                  <TouchableWithoutFeedback onPress={handleSkip}>
                    <View style={[styles.secondaryBtn, { borderColor: BORDER }]}>
                      <ThemedText style={[styles.btnText, { color: TEXT }]} lightColor={TEXT} darkColor={DARK_TEXT} type="default">
                        Skip
                      </ThemedText>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={handleUpdate}>
                    <View style={[styles.primaryBtn, { backgroundColor: PRIMARY }]}>
                      <ThemedText style={[styles.btnText, { color: ON_PRIMARY }]} lightColor={ON_PRIMARY} darkColor={ON_PRIMARY} type="title">
                        Update now
                      </ThemedText>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,20,15,0.45)',
  },
} as Record<string, any>;
