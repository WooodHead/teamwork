
function resolve (dir) {
  return require('path').join(__dirname, dir)
}
const { appUrl, thirdparty = {}, extranet, name, oss } = require('./app.config.js')
ins = name.includes('jd') ? '' : `-${name}`

const logo = {
  'apple-icon-120x120.png': `icons${ins}/logo/apple-icon-120x120.png`,
  'apple-icon-152x152.png': `icons${ins}/logo/apple-icon-152x152.png`,
  'apple-icon-167x167.png': `icons${ins}/logo/apple-icon-167x167.png`,
  'favicon-16x16.png': `icons${ins}/logo/favicon-16x16.png`,
  'favicon-32x32.png': `icons${ins}/logo/favicon-32x32.png`,
  'favicon-96x96.png': `icons${ins}/logo/favicon-96x96.png`,
  'favicon-120x120.png': `icons${ins}/logo/favicon-120x120.png`,
  'favicon-128x128.png': `icons${ins}/logo/favicon-128x128.png`,
  'favicon-in-toolbar.png': `icons${ins}/logo/favicon-in-toolbar.png`,
  'favicon-login.png': `icons${ins}/logo/favicon-login.png`,
  'favicon.ico': `icons${ins}/logo/favicon.ico`,
  'icon-128x128.png': `icons${ins}/logo/icon-128x128.png`,
  'icon-192x192.png': `icons${ins}/logo/icon-192x192.png`,
  'icon-256x256.png': `icons${ins}/logo/icon-256x256.png`,
  'icon-384x384.png': `icons${ins}/logo/icon-384x384.png`,
  'favicon-512x512.png': `icons${ins}/logo/favicon-512x512.png`,
  'ms-icon-144x144.png': `icons${ins}/logo/ms-icon-144x144.png`,
  'logo.png': `icons${ins}/logo/logo.png`
}

const boots = [
  'i18n',
  'axios',
  'auth',
  'router-guard',
  'indexed-db',
  'websocket',
  // 'im',
  'file',
  'workflow',
  'echarts',
  'history',
  'global-use',
  'logo',
  'custom'
]
extranet && boots.push(...['outsource-acl'])
oss && oss.enable && boots.push(...['oss'])

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
module.exports = function (ctx) {
  return {
    htmlVariables: {
      productName: 'JDSoft TeamWork',
      productDescription: '精雕企业协同工作平台，它的使命是让工作简单点儿',
      logo: logo
    },
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: boots,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ['app.scss', 'tw-icon.css', 'quasar-tiptap.styl'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v4',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
      'mdi-v5'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {
        loadingBar: {
          skipHijack: true, // 关闭监听Ajax流量
          color: 'cyan-12',
          size: '3px',
          position: 'top'
        }
      },
      iconSet: 'material-icons', // Quasar icon set
      lang: 'zh-hans', // （en-us，zh-hans） Quasar language pack

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:

      components: [],
      directives: ['ClosePopup'],

      // Quasar plugins
      plugins: ['Dialog', 'Notify', 'LocalStorage', 'SessionStorage', 'Loading', 'LoadingBar', 'AppFullscreen', 'BottomSheet']
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      env: ctx.prod
        ? {
          // prod env vars here, for example:
          // API_HOST: 'http://teamworkservertest.jingdiao.com:9097;'
          API_HOST: appUrl.server
          // API_HOST: 'http://172.18.20.1:9090'
          // API_HOST: 'https://172.18.20.2:10020'
        }
        : {
          // dev env vars here, for example:
          API_HOST: process.env.API_HOST || 'http://localhost:60179'
        },
      version: require('./package.json').version,
      // scopeHoisting: true,
      vueRouterMode: 'history', // available values: 'hash', 'history'
      transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [
      //   'vue-echarts',
      //   'resize-detector'
      // ],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      showProgress: true,
      gzip: true,
      analyze: false,
      // webpack性能分析工具
      // analyze: {
      //   // 默认：server模式下，会启动HTTP服务器来显示软件包报告
      //   // static模式下，会生成带有报告的单个HTML文件
      //   // json模式会生成一个JSON文件
      //   // 在disabled模式需要同时设置generateStatsFile:true,只会生成一个JSON文件
      //   analyzerMode: 'disabled',
      //   // Default: 127.0.0.1. Host that will be used in server mode to start HTTP server.
      //   analyzerHost: '127.0.0.1',
      //   // Default: 8888. Port that will be used in server mode to start HTTP server.
      //   analyzerPort: 8888,
      //   // 默认是true,是否默认在浏览器打开打包结果页面
      //   openAnalyzer: true,
      //   // 默认是false,是否生成打包结果的JSON文件
      //   generateStatsFile: true,
      //   // 默认是stats.json,生成打包结果的JSON文件的文件名
      //   statsFilename: 'stats.json',
      //   defaultSizes: 'gzip'
      // },

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,
      // 扩展由Quasar CLI生成的Webpack配置

      minify: true,
      // devtool: 'source-map',
      chainWebpack: chain => {
        // 关闭包大小告警提示
        chain.performance
          .set('hints', false)
        // 设置别名
        chain.resolve.alias
          .set('@', resolve('src')) // alias 配置
          .set('@c', resolve('src/components'))
      },
      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
        cfg.module.rules.push({
          test: /\.(html|md)$/i,
          loader: 'html-loader'
        })
        cfg.module.rules.push({
          test: /\.md$/,
          loader: 'markdown-loader'
        })
        // cfg.module.rules.push({
        //   test: /\.(png|svg|jpg|gif|blob)$/,
        //   use: [{
        //     loader: 'file-loader',
        //     options: {
        //       name: `$(filename)img/[name]$[hash].[ext]`
        //     }
        //   },
        //   {
        //     loader: 'image-webpack-loader',
        //     options: {
        //       mozjpeg: {
        //         progressive: true,
        //         quality: 65
        //       },
        //       optipng: {
        //         enabled: false
        //       },
        //       pngquant: {
        //         quality: '65-90',
        //         speed: 4
        //       },
        //       // gifsicle: {
        //       //   interlaced: false
        //       // },
        //       webp: {
        //         quality: 75
        //       }
        //     }
        //   }
        //   ]
        // })
      }
    },
    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // https: false,
      port: 8081,
      open: true, // opens browser window automatically
      proxy: {
        '/api': {
          target: appUrl.server, // teamwork接口服务地址
          ws: false, // 是否启用websockets
          changeOrigin: true // 是否跨域
        },
        '/ifactory/api': {
          target: thirdparty.ifactory, // DNC接口服务地址
          ws: false, // 是否启用websockets
          changeOrigin: true, // 是否跨域
          pathRewrite: { '^/ifactory/api': '' }
        }
      },
      // 开启单页应用
      historyApiFallback: true
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [
      'zoomIn',
      'slideInUp',
      'bounceInUp',
      'bounceOutUp',
      'fadeInDown',
      'fadeOutUp',
      'fadeIn',
      'fadeOut',
      'flipInX',
      'flipOutX',
      'slideInLeft'
    ],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'teamwork',
        short_name: 'teamwork',
        description: 'teamwork project',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: logo['icon-128x128.png'],
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: logo['icon-192x192.png'],
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: logo['icon-256x256.png'],
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: logo['icon-384x384.png'],
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: logo['icon-512x512.png'],
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      id: 'org.cordova.quasar.app'
    },
    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'teamwork'
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    }
  }
}
