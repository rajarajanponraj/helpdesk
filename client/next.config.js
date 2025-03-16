// next.config.js
const withPlugins = require('next-compose-plugins');
const removeImports = require('next-remove-imports')();
const nextTranslate = require('next-translate');
const { I18NProvider } = require('next/dist/server/future/helpers/i18n-provider');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
});

module.exports = withPlugins(
  [removeImports, nextTranslate, withPWA],
  {
    reactStrictMode: false,
    swcMinify: true,
    output: 'standalone',

    async rewrites() {
      return [
        {

          source: '/api/v1/:path*',
          destination: 'http://host.docker.internal:5003/api/v1/:path*',
        },
      ];
    },
  }
);
