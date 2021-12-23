<template>
  <q-page>
    <q-card
      flat
      class="card-grow-in-page justify-center"
    >
      <div
        id="container"
        style="height:250px;"
      >
      </div>

      <q-list
        bordered
        padding
        separator
        class="rounded-borders"
      >
        <location-select
          showSearch
          :mylocation.sync="mylocation"
        />

        <q-item>
          <q-item-section>当前城市：{{pointRes.addressComponent&&pointRes.addressComponent.city}}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>当前位置：{{pointRes.formattedAddress}}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>选中位置：{{selectedAddress}}</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item-label header>可选周边：</q-item-label>

        <q-item
          v-for="poi in poiList"
          :key="poi.id"
        >
          <q-item-section>{{poi.name}}</q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
import { loadAMap } from '@/utils/load-amap'
export default {
  name: 'GeolocationAMap',
  components: {
    LocationSelect: () => import('components/location/LocationSelect')
  },
  props: {},
  data () {
    return {
      pointRes: {},
      selectedAddress: '',
      poiList: [],
      // 所在位置
      mylocation: {
        type: 'none', // 三个值可选，none、cityname、poi
        value: '' // 与type关联，type=none是''，type=cityname是城市名，type=poi是地点对象
      }
    }
  },
  methods: {
    init (AMap) {
      let that = this
      var map = new AMap.Map('container', {
        resizeEnable: true
      })
      AMap.plugin(['AMap.Geolocation', 'AMap.PlaceSearch'], function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: 'RB', // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition(function (status, result) {
          if (status === 'complete') {
            onComplete(result)
          } else {
            onError(result)
          }
        })
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
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: '', // 兴趣点城市
            citylimit: false, // 是否强制限制在设置的城市内搜索
            map: map, // 展现结果的地图实例
            panel: '', // 结果列表将在此容器中进行展示。
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          }
        )
        var cpoint = [that.pointRes.position.lng, that.pointRes.position.lat] // 中心点坐标
        placeSearch.searchNearBy('', cpoint, 100, function (status, result) {
          that.poiList = result.poiList.pois
          // console.log(JSON.stringify(result))
        })
      }
      // 解析定位错误信息
      function onError (data) { }

      map.on('click', function (e) {
        map.clearMap()
        var x = e.lnglat.getLng()
        var y = e.lnglat.getLat()
        var marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: [x, y]
        })
        marker.setMap(map)

        // 选中点的地址
        var geocoder = new AMap.Geocoder({
          city: '010', // 城市设为北京，默认：“全国”
          radius: 1000 // 范围，默认：500
        })
        geocoder.getAddress([x, y], function (status, result) {
          if (status === 'complete' && result.regeocode) {
            that.selectedAddress = result.regeocode.formattedAddress
            // console.log(result)
          } else {
            // console.log('根据经纬度查询地址失败')
          }
        })
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
