<template>
  <q-page>
    <q-card
      flat
      class="card-grow-in-page justify-center q-pa-md"
    >
      <q-list
        bordered
        padding
        separator
        class="q-mt-md"
      >
        <q-item>
          <q-item-section>{{pointRes.addressComponent&&pointRes.addressComponent.city}}</q-item-section>
        </q-item>

        <q-item
          clickable
          v-for="poi in poiList"
          :key="poi.id"
          @click="poiId=poi.id"
        >
          <q-item-section>
            <q-item-label>{{poi.name}}</q-item-label>
            <q-item-label
              caption
              lines="1"
            >{{poi.district}}{{poi.address|filterAddress}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
import { loadAMap } from '@/utils/load-amap'
export default {
  name: 'Location',
  data () {
    return {
      pointRes: {},
      poiList: []
    }
  },
  filters: {
    filterAddress (address) {
      return _.isArray(address || '') ? address[0] : address
    }
  },
  methods: {
    init (AMap) {
      let that = this
      AMap.plugin(['AMap.Geolocation', 'AMap.PlaceSearch'], function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: 'RB', // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        })
        geolocation.getCurrentPosition(function (status, result) {
          if (status === 'complete') {
            onComplete(result)
          } else {
            onError(result)
          }
        })

        // 解析定位结果
        function onComplete (data) {
          that.pointRes = data
          // alert(JSON.stringify(data))

          // 获取周边位置
          // 构造地点查询类
          var placeSearch = new AMap.PlaceSearch(
            {
              type: '', // 兴趣点类别
              pageSize: 20, // 单页显示结果条数
              pageIndex: 1, // 页码
              city: '', // 兴趣点城市
              citylimit: false // 是否强制限制在设置的城市内搜索
              // map: map, // 展现结果的地图实例
              // panel: '', // 结果列表将在此容器中进行展示。
              // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            }
          )
          var cpoint = [that.pointRes.position.lng, that.pointRes.position.lat] // 中心点坐标
          placeSearch.searchNearBy('', cpoint, 200, function (status, result) {
            that.poiList = result.poiList.pois
            // console.log(JSON.stringify(result))
          })
        }
        // 解析定位错误信息
        function onError (data) { }
      })
    }
  },
  mounted () {
    let that = this
    loadAMap().then(AMap => {
      that.init(AMap)
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
