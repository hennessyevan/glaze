const {
  getClientStyleLoader,
} = require('next/dist/build/webpack/config/blocks/css/loaders/client');
const withTM = require('next-transpile-modules')(['glaze']);
const TreatPlugin = require('treat/webpack-plugin');

// TODO: Replace with `next-plugin-treat`
const withTreat = ((pluginOptions = {}) => (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config, options) {
      config.plugins.push(
        new TreatPlugin({
          ...pluginOptions,
          outputCSS: !options.isServer,
          outputLoaders: [
            // Extract static CSS in production
            // Logic adopted from https://github.com/zeit/next.js/blob/ee0081356d7ea166dfed4765f134730c11ecaecf/packages/next/build/webpack/config/blocks/css/loaders/global.ts#L13-L22
            !options.isServer
              ? getClientStyleLoader({
                  isDevelopment: options.dev,
                  assetPrefix: options.config.assetPrefix,
                })
              : '',
          ],
        }),
      );

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
})();

module.exports = withTM(withTreat());
