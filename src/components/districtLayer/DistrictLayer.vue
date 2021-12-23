<template>
  <div>
    <div class="row q-gutter-md q-px-md">
      <span>工时统计：</span>
      <div
        class="column items-center"
        style="width:40px"
      >
        <q-separator style="height:2px;background-color:#ADD8E6;" />
        <span>1~100</span>
      </div>
      <div
        class="column items-center"
        style="width:60px"
      >
        <q-separator style="height:2px;background-color:#B0C4DE;" />
        <span>501~1000</span>
      </div>
      <div
        class="column items-center"
        style="width:60px"
      >
        <q-separator style="height:2px;background-color:#4682B4;" />
        <span>1001~1500</span>
      </div>
      <div
        class="column items-center"
        style="width:60px"
      >
        <q-separator style="height:2px;background-color:#00BFFF;" />
        <span>1501~2000</span>
      </div>
      <div
        class="column items-center"
        style="width:60px"
      >
        <q-separator style="height:2px;background-color:#1E90FF;" />
        <span>>2000</span>
      </div>
    </div>
    <div
      id="container"
      class="map"
      style="height:82vh;"
    >
    </div>
  </div>
</template>

<script>
import { loadAMap } from '@/utils/load-amap'
export default {
  name: 'DistrictLayer',
  props: {
    dataSource: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      disCountry: {},
      map: {},
      labelsData: [],
      currentProvinceCode: '',
      initDataSource:
        [
          {
            citycode: [],
            adcode: '440000',
            name: '广东',
            center: '113.280637,23.125178',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '410000',
            name: '河南',
            center: '113.665412,34.757975',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '150000',
            name: '内蒙古',
            center: '111.670801,40.818311',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '230000',
            name: '黑龙江',
            center: '126.642464,45.756967',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '650000',
            name: '新疆',
            center: '87.617733,43.792818',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '420000',
            name: '湖北',
            center: '114.298572,30.584355',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '210000',
            name: '辽宁',
            center: '123.429096,41.796767',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '370000',
            name: '山东',
            center: '117.000923,36.675807',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '610000',
            name: '陕西',
            center: '108.948024,34.263161',
            level: 'province',
            districts: []
          },
          {
            citycode: '021',
            adcode: '310000',
            name: '上海',
            center: '121.472644,31.231706',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '520000',
            name: '贵州',
            center: '106.713478,26.578343',
            level: 'province',
            districts: []
          },
          {
            citycode: '023',
            adcode: '500000',
            name: '重庆',
            center: '106.504962,29.533155',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '540000',
            name: '西藏',
            center: '91.132212,29.660361',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '340000',
            name: '安徽',
            center: '117.283042,31.86119',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '350000',
            name: '福建',
            center: '119.306239,26.075302',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '430000',
            name: '湖南',
            center: '112.982279,28.19409',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '460000',
            name: '海南',
            center: '110.33119,20.031971',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '320000',
            name: '江苏',
            center: '118.767413,32.041544',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '630000',
            name: '青海',
            center: '101.778916,36.623178',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '450000',
            name: '广西',
            center: '108.320004,22.82402',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '640000',
            name: '宁夏',
            center: '106.278179,38.46637',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '360000',
            name: '江西',
            center: '115.892151,28.676493',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '330000',
            name: '浙江',
            center: '120.153576,30.287459',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '130000',
            name: '河北',
            center: '114.502461,38.045474',
            level: 'province',
            districts: []
          },
          {
            citycode: '1853',
            adcode: '820000',
            name: '澳门',
            center: '113.54909,22.198951',
            level: 'province',
            districts: []
          },
          {
            citycode: '1886',
            adcode: '710000',
            name: '台湾',
            center: '121.509062,25.044332',
            level: 'province',
            districts: []
          },
          {
            citycode: '1852',
            adcode: '810000',
            name: '香港',
            center: '114.173355,22.320048',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '620000',
            name: '甘肃',
            center: '103.823557,36.058039',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '510000',
            name: '四川',
            center: '104.065735,30.659462',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '220000',
            name: '吉林',
            center: '125.3245,43.886841',
            level: 'province',
            districts: []
          },
          {
            citycode: '022',
            adcode: '120000',
            name: '天津',
            center: '117.190182,39.125596',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '530000',
            name: '云南',
            center: '102.712251,25.040609',
            level: 'province',
            districts: []
          },
          {
            citycode: '010',
            adcode: '110000',
            name: '北京',
            center: '116.405285,39.904989',
            level: 'province',
            districts: []
          },
          {
            citycode: [],
            adcode: '140000',
            name: '山西',
            center: '112.549248,37.857014',
            level: 'province',
            districts: []
          }],
      config: {
        name: '',
        position: [116.12, 39.11],
        zIndex: 2,
        opacity: 1,
        text: {
          content: '',
          direction: 'center',
          offset: [0, 0],
          style: {
            fontSize: 10,
            fontWeight: 'normal',
            strokeWidth: 2
          }
        }
      }
    }
  },
  methods: {
    init (AMap) {
      let that = this
      that.map = new AMap.Map('container', {
        zoom: that.$q.screen.lt.sm ? 3 : 4,
        // center: [106.122082, 33.719192],
        isHotspot: false,
        defaultCursor: 'pointer',
        viewMode: '2D',
        resizeEnable: true
      })

      //   var options = {
      //     'showButton': false, // 是否显示定位按钮
      //     'showMarker': false // 是否显示定位点
      //   }

      AMap.plugin(['Map3D', 'AMap.DistrictLayer', 'AMap.Scale', 'AMap.ToolBar', 'AMap.Geocoder', 'AMap.Geolocation'], function () {
        that.newCountry()
        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        that.map.addControl(new AMap.Scale())
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        that.map.addControl(new AMap.ToolBar({ liteStyle: true }))
        // 定位
        // var geolocation = new AMap.Geolocation()
        // that.map.addControl(geolocation)
        // geolocation.getCurrentPosition(function (status, result) {
        //   if (status === 'complete') {
        //     onComplete(result)
        //   }
        // })
      })
      that.map.on('complete', onComplete)
      function onComplete (data) {
        let layer = new AMap.LabelsLayer({
          // 开启标注避让，默认为开启，v1.4.15 新增属性
          collision: false,
          // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
          animation: true
        })
        _.forEach(that.labelsData, t => {
          layer.add(new AMap.LabelMarker(t))
        })
        that.map.add(layer)
        // 点击事件
        setTimeout(function () {
          // 模拟触发地图click事件
          that.map.emit('click', {
            lnglat: that.map.getCenter()// that.map.getCenter()// data.position
          })
        }, 1000)
      }
      that.map.on('click', clickHandler)
      function clickHandler (e) {
        // 选中点的地址
        let geocoder = new AMap.Geocoder()
        let x = e.lnglat.getLng()
        let y = e.lnglat.getLat()
        geocoder.getAddress([x, y], function (status, result) {
          if (status === 'complete' && result.regeocode) {
            let currentProvience = result.regeocode.addressComponent.province
            let sumByPcode = 0
            that.currentProvinceCode = result.regeocode.addressComponent.adcode.substring(0, 2) + '0000'
            let pcodeSource = {}
            if (that.currentProvinceCode) {
              pcodeSource = that.dataSource.find(r => r.pcode && r.pcode === that.currentProvinceCode)
              if (pcodeSource && Object.keys(pcodeSource).length) {
                currentProvience = pcodeSource.pname
                sumByPcode = pcodeSource.sumByPcode
              }
            }
            new AMap.InfoWindow({
              content: '<div>' + currentProvience + '</div><hr/><div>工作总用时：' + sumByPcode + '</div>'
            }).open(that.map, e.lnglat)
          }
        })
      };
    },
    labelData () {
      let configCopy = {}
      _.forEach(this.initDataSource, t => {
        configCopy = _.cloneDeep(this.config)
        Object.assign(configCopy,
          {
            name: t.name,
            position: t.center.split(',')
          })
        configCopy.text.content = t.name
        this.labelsData.push(configCopy)
      })
    },
    fillColor (value) {
      let pcodeSource = this.dataSource.find(r => r.pcode && r.pcode === _.toString(value))
      if (pcodeSource && pcodeSource.sumByPcode) {
        // 区间目前写的定值，后续要改成按照数据等分
        if (pcodeSource.sumByPcode >= 1 && pcodeSource.sumByPcode <= 500) {
          return 'rgb(173, 216, 230)'// LightBlue
        } else if (pcodeSource.sumByPcode >= 501 && pcodeSource.sumByPcode <= 1000) {
          return 'rgb(176, 196 ,222)'// LightSteelBlue
        } else if (pcodeSource.sumByPcode >= 1001 && pcodeSource.sumByPcode <= 1500) {
          return 'rgb(70, 130, 180)'// SteelBlue
        } else if (pcodeSource.sumByPcode >= 1501 && pcodeSource.sumByPcode <= 2000) {
          return 'rgb(0 ,191 ,255)'// DeepSkyBlue
        } else if (pcodeSource.sumByPcode >= 2001) {
          return 'rgb(30,144,255)'// DodgerBlue
        }
      }
    },
    newCountry () {
      let that = this
      this.disCountry = new AMap.DistrictLayer.Country({
        zIndex: 10,
        SOC: 'CHN',
        depth: 1,
        styles: {
          'nation-stroke': '#ff0000',
          'coastline-stroke': '#0088ff',
          'province-stroke': '#888888',
          'fill': function (props) {
            return that.fillColor(props.adcode_pro)
          }
        }
      })
      let layers = [this.disCountry]
      // 地图上设置图层
      this.map.setLayers(layers)
    }
  },
  mounted () {
    this.labelData()
    let that = this
    loadAMap().then(AMap => {
      that.init(AMap)
    })
  },
  watch: {
    dataSource: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal && oldVal && Object.keys(this.disCountry).length) {
          let that = this
          this.map.remove([this.disCountry])
          this.newCountry()
          setTimeout(function () {
            that.map.emit('complete')
          }, 100)
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.map {
  width: 100%;
  background: white !important;
}
</style>
