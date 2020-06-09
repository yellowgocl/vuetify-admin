import colors from 'vuetify/es5/util/colors'
const { axios, proxy, auth } = require("./config");
const env = require("./env");
export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  env,
  axios,
  proxy,
  auth,
  router: {
    middleware: ["auth"]
  },
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/app', '~/plugins/axios', '~/plugins/vuetify',
    { src: '~/plugins/video-player.js', ssr: false }, 
    { src: '~/plugins/sortable.js', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
    // Doc: https://github.com/nuxt-community/dotenv-module
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    defaultAssets: {
      font: true,
      icons: 'md'
    },
    icons: {
        iconfont: 'md', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.lightBlue.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ['@nuxtjs/auth'],
    extend(config, ctx) {}
  }
}
