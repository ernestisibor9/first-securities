const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function (config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('setWebContentsDebuggingEnabled(false)')) {
      contents = contents.replace(
        /onCreate\(\)[\s\S]*?super\.onCreate\(.*?\);/,
        match =>
          `${match}\n    try { android.webkit.WebView.setWebContentsDebuggingEnabled(false); } catch (e) {}`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};