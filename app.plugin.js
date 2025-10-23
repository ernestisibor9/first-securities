const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function (config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // 🧹 Remove unsafe or unnecessary permissions
    manifest['uses-permission'] = (manifest['uses-permission'] || []).filter(
      (perm) =>
        ![
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.WRITE_EXTERNAL_STORAGE',
          'android.permission.SYSTEM_ALERT_WINDOW',
          'com.ernzo.firstsecurities.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION',
        ].includes(perm.$['android:name'])
    );

    // ✅ Secure application flags
    const app = manifest.application?.[0];
    if (app) {
      app.$['android:allowBackup'] = 'false'; // Prevents data extraction
      app.$['android:usesCleartextTraffic'] = 'false'; // Force HTTPS only
      app.$['android:supportsRtl'] = 'true';
      app.$['android:extractNativeLibs'] = 'false';
      // Do not set android:debuggable manually (handled by Expo)
    }

    return config;
  });
};
