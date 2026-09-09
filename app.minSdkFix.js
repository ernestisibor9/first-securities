const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function (config) {
  return withAndroidManifest(config, (config) => {
    // Floor only: target/compile SDK are owned by expo-build-properties.
    config.modResults.manifest['uses-sdk'] = [{
      $: {
        'android:minSdkVersion': '26'
      }
    }];
    return config;
  });
};