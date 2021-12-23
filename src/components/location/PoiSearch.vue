<template>
  <q-card>
    <q-card
      class="z-top"
      style="position:sticky;top:0;"
    >
      <q-card-section>
        <q-input
          dense
          outlined
          autofocus
          v-model="search"
          label="搜索"
          @input="handleSearch"
        >
          <template v-slot:before>
            <q-btn
              flat
              dense
              round
              icon="arrow_back"
              color="primary"
              class="q-mr-sm"
              @click="$emit('close-poi-search-diglog')"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <q-list
      v-if="poiList.length"
      bordered
      padding
      separator
    >
      <q-item
        v-for="poi in poiList"
        :key="poi.id"
        clickable
        @click="$emit('updateMyLocation', 'poi', poi)"
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
</template>

<script>
import { debounce } from 'quasar'
import { loadAMap } from '@/utils/load-amap'
let placeSearch = null
export default {
  name: 'PoiSearch',
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
      AMap.plugin(['AMap.PlaceSearch'], function () {
        placeSearch = new AMap.PlaceSearch({
          // city 不限定城市，默认全国
          // city: data.addressComponent.citycode
        })
      })
    },
    handleSearch (val) {
      let that = this
      if (val !== '') {
        placeSearch.search(val, function (status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // console.log(result)
          that.poiList = result.poiList ? result.poiList.pois : []
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
