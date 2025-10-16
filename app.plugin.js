const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function (config) {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application[0];
    app.$['android:allowBackup'] = 'false';
    app.$['android:usesCleartextTraffic'] = 'false';
    // Disable WebView debugging globally
    app.$['android:debuggable'] = 'false';
    return config;
  });
};
