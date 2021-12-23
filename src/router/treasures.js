
/**
 * 应用备用的宝藏
 */
export default [
  {
    path: '/demo',
    name: 'demo',
    meta: {
      icon: 'extension',
      label: '组件实例',
      index: 40,
      group: { index: 98, label: '组件实例' }
    },
    component: () =>
      import(/* webpackChunkName: "feedback" */ 'pages/PageDemo.vue')
  },
  {
    path: '/treasure',
    name: 'treasure',
    meta: {
      icon: 'account_balance',
      label: '应用宝藏',
      index: 99,
      group: { index: 99, label: '应用宝藏' }
    },
    component: () =>
      import(/* webpackChunkName: "treasures" */ 'pages/PageTreasure.vue')
  },
  {
    path: '/treasure/qrcode-reader',
    name: 'qrcodeReader',
    hideInMenu: true,
    component: () =>
      import(/* webpackChunkName: "treasure" */ 'pages/treasure/qrcode-reader/QRCodeReader.vue')
  },
  {
    path: '/treasure/barcode-reader',
    name: 'barcodeReader',
    hideInMenu: true,
    component: () =>
      import(/* webpackChunkName: "treasure" */ 'pages/treasure/barcode-reader/BarcodeReader.vue')
  },
  {
    path: '/treasure/3d-model',
    name: '3dModel',
    hideInMenu: true,
    component: () =>
      import(/* webpackChunkName: "treasure" */ 'pages/treasure/3d-model')
  },
  {
    path: '/treasure/web-apis',
    name: 'webApis',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis')
  },
  {
    path: '/treasure/web-apis/battery',
    name: 'battery',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis/Battery.vue')
  },
  {
    path: '/treasure/web-apis/bluetooth',
    name: 'bluetooth',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis/Bluetooth.vue')
  },
  {
    path: '/treasure/web-apis/camera',
    name: 'camera',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis/Camera.vue')
  },
  {
    path: '/treasure/web-apis/geolocation',
    name: 'geolocation',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis/Geolocation.vue')
  },
  {
    path: '/treasure/web-apis/vibration',
    name: 'vibration',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis/Vibration.vue')
  },
  {
    path: '/treasure/web-apis/notification',
    name: 'notification',
    hideInMenu: true,
    component: () => import('pages/treasure/web-apis/Notification.vue')
  },
  {
    path: '/treasure/web-geolocation/geolocation',
    name: 'geolocationAMap',
    hideInMenu: true,
    component: () => import('pages/treasure/web-geolocation/Geolocation.vue')
  },
  {
    path: '/treasure/web-geolocation/location',
    name: 'location',
    hideInMenu: true,
    component: () => import('pages/treasure/web-geolocation/Location.vue')
  },
  {
    path: '/treasure/web-geolocation/poisearch',
    name: 'poiAMap',
    hideInMenu: true,
    component: () => import('pages/treasure/web-geolocation/PoiSearch.vue')
  },
  {
    path: '/treasure/web-geolocation/districtLayer',
    name: 'districtLayerAMap',
    hideInMenu: true,
    component: () => import('pages/treasure/web-geolocation/DistrictLayer.vue')
  }
]
