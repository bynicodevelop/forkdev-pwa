// import colors from 'vuetify/es5/util/colors'

// export default {
// const colors = require('vuetify/es5/util/colors').default
console.log(process.env.NODE_ENV)

module.exports = {
  mode: 'universal',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - forkdev',
    title: 'forkdev',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'simplemde/dist/simplemde.min.css',
    'github-markdown-css/github-markdown.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/editor.client.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/firebase',
    '@nuxtjs/dotenv',
    '@nuxtjs/markdownit',
    '@nuxtjs/dayjs',
    'cookie-universal-nuxt',
  ],

  firebase: {
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
    services: {
      auth: {
        persistence: 'local', // default
        initialize: {
          // onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
          onAuthStateChangedAction: 'onAuthStateChangedAction',
          // subscribeManually: false,
        },
        ssr: true, // default
        emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : null,
        emulatorHost:
          process.env.NODE_ENV === 'development' ? 'http://localhost' : null,
        disableEmulatorWarnings: true,
      },
      firestore:
        process.env.NODE_ENV === 'development'
          ? {
              emulatorPort: 8080,
              emulatorHost: 'localhost',
            }
          : {},
      storage:
        process.env.NODE_ENV === 'development'
          ? {
              emulatorPort: 9199,
              emulatorHost: 'localhost',
            }
          : {},
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: false,
    icon: false,

    workbox: {
      autoRegister: true,
      importScripts: ['/firebase-auth-sw.js'],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === 'development',
    },

    manifest: {
      lang: 'en',
    },
  },

  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    // use: ['markdown-it-div', 'markdown-it-attrs'],
  },

  dayjs: {
    locales: ['fr'],
    defaultLocale: 'fr',
    // defaultTimeZone: 'French/Paris',
    plugins: [
      'duration', // import 'dayjs/plugin/utc'
      'relativeTime', // import 'dayjs/plugin/timezone'
    ], // Your Day.js plugin
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        // dark: {
        //   primary: colors.blue.darken2,
        //   accent: colors.grey.darken3,
        //   secondary: colors.amber.darken3,
        //   info: colors.teal.lighten1,
        //   warning: colors.amber.base,
        //   error: colors.deepOrange.accent4,
        //   success: colors.green.accent3,
        // },
      },
    },
  },

  router: {
    middleware: ['auth'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
  },
}
