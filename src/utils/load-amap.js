// 动态引入高德地图
export function loadAMap () {
  if (window.AMap) {
    return Promise.resolve(window.AMap)
  } else {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script')

      script.onload = function () {
        resolve(AMap)
      }

      script.onerror = function (error) {
        reject(error)
      }

      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=9b100b4bc25583c30c22e19ea8011fe3'
      document.body.appendChild(script)
    })
  }
}
