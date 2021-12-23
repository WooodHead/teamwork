
<template>
  <q-btn
    dense
    flat
    round
    title="扫描二维码"
    @click="qrscan"
    to="/qrcode"
  >
    <q-icon
      size="sm"
      name="img:icons/qr-scanner.svg"
      class="no-pointer-events"
    />

    <!-- 二维码扫描结果 -->
    <q-dialog v-model="showScanResult">
      <q-card
        style="min-width:300px"
        class="text-center"
      >
        <q-card-section>
          <p>
            扫描结果
          </p>
          <p v-if="scanResult.islink">
            <a
              :href="scanResult.result"
              target="_blank"
              rel="noopener noreferrer"
              style="word-break: break-all;"
            >
              {{scanResult.result}}
            </a>
          </p>
          <p v-else>
            <b>
              {{ scanResult.result }}
            </b>
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'TwQrscan',
  methods: {
    // 二维码扫描
    qrscan () {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          this.qrscanResult(res)
        },
        fail: function (res) {
          console.log(JSON.stringify(res))
        }
      })
    },
    // 处理二微码扫描结果
    qrscanResult (res) {
      let result = res.resultStr
      // eslint-disable-next-line no-useless-escape
      let urlregex = new RegExp('^(http|https):\/\/')
      // 是否为网址
      if (urlregex.test(result)) {
        // 内部网址
        if (_.includes(result, window.location.host)) {
          let path = _.drop(result.split('/'), 3).join('/')
          this.$router.push({
            path: path
          })
        } else {
          // 外部网址
          openURL(result)
          this.showScanResult = true
          this.scanResult = {
            result: result,
            islink: true
          }
        }
      } else {
        if (_.isEmpty(result)) {
          this.scanResult = {
            result: '',
            islink: false
          }
        } else {
          // 后台查询
          this.queryMaterialCode(result)
            .then(res => {
              // 处理查询结果
              if (res) {
                this.$router.push(res.route)
              } else {
                this.showScanResult = true
                this.scanResult = {
                  result: result,
                  islink: false
                }
              }
            })
        }
      }
    }
  }
}
</script>

<style>
</style>
