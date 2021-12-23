<template>
  <q-card>
    <q-card>
      <q-card-section class="row items-center q-px-md q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          color="primary"
          @click="$emit('update:showLocationDialog', false)"
        />
        <div class="q-ml-sm text-bold">位置</div>
        <q-space />
        <q-btn
          v-if="showSearch"
          flat
          dense
          round
          icon="search"
          @click="showPoiSearchDialog=true"
        />
        <q-btn
          dense
          outline
          label="在公司"
          color="primary"
          class="q-ml-md q-px-sm"
          @click="setInCompany"
        />
        <q-btn
          dense
          label="确定"
          color="primary"
          class="q-ml-md q-px-sm"
          @click="onSave"
        />
      </q-card-section>

      <div class="relative-position">
        <div
          id="container"
          style="height:300px;"
        ></div>

        <q-img
          src="pin-location.png"
          width="32px"
          height="32px"
          class="absolute-center"
          style="margin-top:-16px;"
        />
      </div>
    </q-card>

    <q-card
      ref="scrollTargetRef"
      :style="listStyle"
    >
      <q-infinite-scroll
        @load="onLoad"
        :offset="250"
        :scroll-target="$refs.scrollTargetRef"
        ref="scrollRef"
      >
        <q-list
          bordered
          separator
        >
          <q-item
            clickable
            v-for="poi in poiList"
            :key="poi.id"
            @click="emitMyLocation('poi', poi)"
          >
            <q-item-section>
              <q-item-label>{{poi.name}}</q-item-label>
              <q-item-label
                caption
                lines="1"
              >{{poi.district}}{{poi.address|filterAddress}}</q-item-label>
            </q-item-section>
            <q-item-section
              v-if="poi.id===selectedLocation.value.id"
              side
            >
              <q-radio
                v-model="selectedLocation.value.id"
                :val="poi.id"
                dense
              />
            </q-item-section>
          </q-item>
        </q-list>

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </q-card>

    <q-dialog
      v-model="showPoiSearchDialog"
      position="bottom"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <poi-search
        @updateMyLocation="emitMyLocation"
        @close-poi-search-diglog="showPoiSearchDialog=false"
        :style="dialogStyle"
      />
    </q-dialog>
  </q-card>
</template>

<script>
// 注意：通过map.setFitView()调整视野位置会导致中心点变更，可能导致地图的moveend事件死循环
import { mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
import { loadAMap } from '@/utils/load-amap'
export default {
  name: 'LocationList',
  components: {
    PoiSearch: () => import('components/location/PoiSearch')
  },
  props: {
    showSearch: { type: Boolean, default: false },
    mylocation: {
      type: Object,
      default: () => {
        return {
          type: 'none', // 两个值可选，none、poi
          value: ''
        }
      }
    },
    showLocationDialog: { type: Boolean }
  },
  data () {
    return {
      map: null,
      centerMakerFirstChange: true, // 视图中心点首次变更
      selectedLocation: {}, // 选中位置
      lng: 0, // 中心点经度
      lat: 0, // 中心点纬度
      poiList: [], // 可选位置列表
      ignoreMoveEndEvent: false, // 是否忽略地图中心点变更事件
      showPoiSearchDialog: false,
      listStyle: {
        height: `Calc(85vh - 352px)`,
        overflow: 'auto'
      },
      dialogStyle: {
        height: '85vh',
        width: '850px',
        maxWidth: '850px'
      }
    }
  },
  filters: {
    filterAddress (address) {
      return _.isArray(address || '') ? address[0] : address
    }
  },
  methods: {
    ...mapActions('organize', ['loadCompany']),
    init (AMap) {
      let that = this
      this.map = new AMap.Map('container', {
        // animateEnable: false, // 是否开启动画
        resizeEnable: true
      })

      // 地图中心点变更监听
      this.map.on('moveend', onMoveEnd)
      function onMoveEnd (ev) {
        if (that.ignoreMoveEndEvent) {
          that.ignoreMoveEndEvent = false
        } else {
          that.setCenterMaker()
          that.resetPoiList()
        }
      }

      AMap.plugin(['AMap.Geolocation', 'AMap.PlaceSearch'], function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })
        that.map.addControl(geolocation)
        // 如果是poi，不再获取定位，使用poi作为视图中心
        if (that.selectedLocation.type === 'poi') {
          that.setCenterMaker(that.selectedLocation.value.location, 18)
          that.resetPoiList([that.selectedLocation.value])
        } else {
          geolocation.getCurrentPosition(function (status, result) {
            if (status === 'complete') {
              onComplete(result)
            } else {
              onError(result)
            }
          })
        }

        // 解析定位结果
        function onComplete (data) {
          // alert(JSON.stringify(data))
          that.setCenterMaker(data.position, 18)
          that.resetPoiList()
        }
        // 解析定位错误信息
        function onError (data) { console.log(data) }
      })
    },
    onLoad (index, done) {
      (this.lng && this.lat) ? this.loadPoiSearch(index, done) : done(true)
    },
    onSave () {
      Object.assign(this.mylocation, this.selectedLocation)
      this.$emit('update:showLocationDialog', false)
    },
    emitMyLocation (type, value) {
      switch (type) {
        case 'none':
          Object.assign(this.selectedLocation, { type, value: '' })
          break
        case 'poi':
          Object.assign(this.selectedLocation, { type, value })
          break
      }

      // 地图中心点移动至选中位置
      this.setCenterMaker(value.location)

      // 如果数据来自搜索，则关闭搜索窗口，重置列表
      if (this.showPoiSearchDialog) {
        this.showPoiSearchDialog = false
        this.resetPoiList([this.selectedLocation.value])
      }
    },
    loadPoiSearch (index, done) {
      let that = this
      // 获取周边位置
      // 构造地点查询类
      var placeSearch = new AMap.PlaceSearch(
        {
          type: '公司企业|商务住宅|生活服务',
          pageSize: 20, // 单页显示结果条数
          pageIndex: index // 页码
          // map: this.map, // 展现结果的地图实例
          // autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        }
      )
      var cpoint = [this.lng, this.lat] // 中心点坐标
      placeSearch.searchNearBy('', cpoint, 200, function (status, result) {
        // console.log(JSON.stringify(result))
        if (result.poiList === void 0) {
          done(true)
        } else {
          // 如果查询结果有当前选中项，则剔除
          if (that.selectedLocation.type === 'poi' && that.selectedLocation.value &&
            _.indexOf(result.poiList.pois, poi => poi.id === that.selectedLocation.value.id) > -1) {
            _.remove(result.poiList.pois, poi => poi.id === that.selectedLocation.value.id)
          }
          // 查询结果合并到列表
          const newPoiList = _.differenceBy(result.poiList.pois, that.poiList, 'id')
          that.poiList = [...that.poiList, ...newPoiList]
          // 如果初始未选中任何位置，默认选中第一项
          if (index === 1 && that.poiList.length > 0) {
            if (that.centerMakerFirstChange) {
              that.centerMakerFirstChange = false
              if (that.selectedLocation.type !== 'poi') {
                Object.assign(that.selectedLocation, { type: 'poi', value: that.poiList[0] })
              }
            } else {
              Object.assign(that.selectedLocation, { type: 'poi', value: that.poiList[0] })
            }
          }
          done()
        }
      })
    },
    resetPoiList (curPoiList) {
      this.poiList = curPoiList || []
      if (this.$refs.scrollRef) {
        this.$refs.scrollRef.reset()
        this.$refs.scrollRef.resume()
        this.$refs.scrollRef.trigger()
      }
    },
    setCenterMaker (currentCenter, level) {
      // 获取地图中心点
      if (!currentCenter) {
        currentCenter = this.map.getCenter()
      } else {
        // 移动到中心点
        this.ignoreMoveEndEvent = true
        level !== void 0
          ? this.map.setZoomAndCenter(level, [currentCenter.lng, currentCenter.lat])
          : this.map.setCenter(currentCenter)
        // this.map.panTo([currentCenter.lng, currentCenter.lat])
      }

      this.lng = currentCenter.lng
      this.lat = currentCenter.lat
    },
    setInCompany () {
      if (this.$myinfo.organizeId > 0) {
        this.loadCompany(this.$myinfo.organizeId)
          .then(org => {
            if (org.organizeAddress && org.organizeAddress.type === 'poi') {
              Object.assign(this.mylocation, org.organizeAddress)
            } else {
              // 提醒用户尚未设置公司地址
              showWarningMessage('尚未设置公司地址，无法定位公司位置')
            }
            this.$emit('update:showLocationDialog', false)
          })
      }
    }
  },
  mounted () {
    this.selectedLocation = _.cloneDeep(this.mylocation)

    let that = this
    loadAMap().then(AMap => {
      that.init(AMap)
    })
  }
}
</script>

<style lang='scss' scoped>
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
