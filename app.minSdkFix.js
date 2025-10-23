const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function (config) {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest['uses-sdk'] = [{
      $: {
        'android:minSdkVersion': '29',
        'android:targetSdkVersion': '34'
      }
    }];
    return config;
  });
};