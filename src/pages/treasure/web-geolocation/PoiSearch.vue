<template>
  <q-page>
    <q-card
      flat
      class="card-grow-in-page justify-center q-pa-md"
    >
      <q-input
        outlined
        v-model="search"
        label="搜索附近位置"
        @input="handleSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:after>
          <q-btn
            rounded
            flat
            label="取消"
            @click="$emit('search-cancel')"
          />
        </template>
      </q-input>

      <q-list
        v-if="poiList.length"
        bordered
        padding
        separator
        class="q-mt-md"
      >
        <q-item
          v-for="poi in poiList"
          :key="poi.id"
        >
          <q-item-section>
            <q-item-label>{{poi.name}}</q-item-label>
            <q-item-label
              caption
              lines="1"
            >{{poi.address|filterAddress}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
import { debounce } from 'quasar'
import { loadAMap } from '@/utils/load-amap'
let placeSearch = null
export default {
  name: 'PoiSearch',
  components: {},
  props: {},
  data () {
    return {
      poiList: [],
      search: ''
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
        var geolocation = new AMap.Geolocation()
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

          // 实例化Autocomplete
          placeSearch = new AMap.PlaceSearch({
            // city 限定城市，默认全国
            city: data.addressComponent.citycode
          })
        }
        // 解析定位错误信息
        function onError (data) { }
      })
    },
    handleSearch (val) {
      let that = this
      if (val !== '') {
        placeSearch.search(val, function (status, result) {
          // 搜索成功时，result即是对应的匹配数据
          console.log(result)
          that.poiList = result.poiList.pois
        })
      } else {
        that.poiList = []
      }
    }
  },
  mounted () {
    let that = this
    loadAMap().then(AMap => {
      that.init(AMap)
    })
  },
  created () {
    this.handleSearch = debounce(this.handleSearch, 500)
  }
}
</script>

<style lang='scss' scoped>
</style>
