let baseRoutes = [
  '/', '/zh', '/en',
  '/zh/lottery',
  '/en/lottery'
]
let routes = baseRoutes.concat(['/zh/status', '/en/status'])
module.exports = {
  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://mixin.bet',
    cacheTime: 1000 * 60 * 15,
    generate: true,
    routes: baseRoutes
  },
  head: {
    title: 'LOTTERY - Fast CLAM Cryptocurrency LOTTERY Game - Multiple coins/tokens support',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Lottery' },
      { hid: 'og-type', property: 'og:type', content: 'Website' },
      { hid: 'og-site-name', property: 'og:site_name', content: 'Lottery - A CLAM Lottery Game' },
      { hid: 'robots', name: 'robots', content: 'index,follow' },
      { hid: 'mobile-web-app-capable', name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'apple-mobile-web-app-capable', name: 'apple-mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/lottery-64.png' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', href: '/lottery-512.png' }
    ]
  },
  css: [
    '~/assets/scss/index.scss'
  ],
  env: {
    maintenance: false,
    maintenanceEndTime: Date.now() + 1000 * 60 * 60,
  },
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/vue-qr.js',
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/vue-tabs.js', ssr: false },
    { src: '~/plugins/vue-modal.js', ssr: false },
    { src: '~/plugins/vue-notification.js', ssr: false },
    { src: '~/plugins/storage.js', ssr: false }
  ],
  router: {
    middleware: ['i18n']
  },
  generate: {
    routes: routes
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'axios',
      'fingerprintjs2'
    ],
    ssr: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
