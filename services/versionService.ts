import Constants from 'expo-constants';
import { storage } from '@/services/storage';

export interface VersionManifest {
  minRequiredVersion: string;
  forceUpdate: boolean;
  message: string;
  iosStoreUrl: string;
  androidStoreUrl: string;
}

const DISMISSED_VERSION_KEY = 'update_dismissed_version';
const FETCH_TIMEOUT_MS = 8000;

export function compareVersions(a: string, b: string): number {
  const pa = (a || '0').split('.').map((s) => Number(s) || 0);
  const pb = (b || '0').split('.').map((s) => Number(s) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}

function fallbackManifest(): VersionManifest {
  return {
    minRequiredVersion: '2.2.2',
    forceUpdate: false,
    message: 'A new version of First Securities is available. Please update to keep trading.',
    iosStoreUrl: 'https://apps.apple.com/app/id6753149633',
    androidStoreUrl: 'https://play.google.com/store/apps/details?id=com.ernzo.firstsecurities',
  };
}

async function fetchManifestWithTimeout(): Promise<VersionManifest> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(
      'https://firstsecurities-update-manifest.uncs.workers.dev',
      { signal: controller.signal, headers: { Accept: 'application/json' } },
    );
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    const data = (await response.json()) as Partial<VersionManifest>;
    return {
      minRequiredVersion: data.minRequiredVersion ?? fallbackManifest().minRequiredVersion,
      forceUpdate: Boolean(data.forceUpdate),
      message: data.message ?? fallbackManifest().message,
      iosStoreUrl: data.iosStoreUrl ?? fallbackManifest().iosStoreUrl,
      androidStoreUrl: data.androidStoreUrl ?? fallbackManifest().androidStoreUrl,
    };
  } catch {
    return fallbackManifest();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkForUpdate(): Promise<{
  shouldShow: boolean;
  manifest: VersionManifest | null;
}> {
  const currentVersion = Constants.expoConfig?.version;
  if (!currentVersion) return { shouldShow: false, manifest: null };

  const dismissed = await storage.getItem(DISMISSED_VERSION_KEY);
  if (dismissed === currentVersion) {
    return { shouldShow: false, manifest: null };
  }

  const manifest = await fetchManifestWithTimeout();
  const shouldShow = compareVersions(currentVersion, manifest.minRequiredVersion) < 0;
  return { shouldShow, manifest: shouldShow ? manifest : null };
}

export async function dismissUpdate(version: string): Promise<void> {
  await storage.setItem(DISMISSED_VERSION_KEY, version);
}
