const { withProjectBuildGradle } = require("@expo/config-plugins");

module.exports = function withJitpack(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("https://www.jitpack.io")) {
      return config;
    }

    config.modResults.contents = config.modResults.contents.replace(
      /repositories\s*{/,
      `repositories {
        maven { url 'https://www.jitpack.io' }`
    );

    return config;
  });
};
