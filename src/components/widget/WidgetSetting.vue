<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm || guide"
  >
    <tw-header-card :title="$t('widget.cardSettingTitle')">
    </tw-header-card>
    <q-card-section>
      <!-- 已启用卡片列表 -->
      <div class="row q-gutter-md justify-center">
        <widget-layout
          :isEmpty="true"
          :widget="widget"
          :category="category"
          :id="objectID"
          :cardClick="false"
          v-for="widget in usedWidgets"
          :key="widget"
        >
          <template slot="check">
            <q-toggle
              color="blue"
              v-model="usedWidgets"
              :val="widget"
              @input="saveSettingWidgets"
            />
          </template>
        </widget-layout>
      </div>
      <!-- 未启用卡片提示 -->
      <div class="row items-center text-h6 q-py-md">
        <q-separator class="col gradient-right-to-left" />
        <span class="q-px-md text-amber-14">{{$t('widget.noUsedWidgetsInfo')}}</span>
        <q-separator class="col gradient-left-to-right" />
      </div>
      <tw-banner-no-result
        v-if="!noUsedWidgets.length"
        class="q-mx-lg q-mb-lg"
        info="所有工具都已被选用。"
      />
      <!-- 未启用卡片列表 -->
      <div class="row q-gutter-md justify-center">
        <widget-layout
          :isSetting="false"
          :isEmpty="true"
          :widget="widget"
          :category="category"
          :id="Number(objectID)"
          v-for="widget in noUsedWidgets"
          :key="widget"
          :cardClick="false"
        >
          <template #check>
            <q-toggle
              color="blue"
              v-model="usedWidgets"
              :val="widget"
              @input="saveSettingWidgets"
            />
          </template>
        </widget-layout>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { format } from 'quasar'
export default {
  name: 'WidgetSetting',
  props: {
    category: { type: String, required: true },
    objectID: { type: [Number, String], required: true },
    widgets: { type: Object, required: false, description: '当前资源的widget' },
    guide: { type: Boolean, default: false }
  },
  data () {
    return {
      allWidgets: [],
      usedWidgets: [],
      categoryModel: {}, // 当前资源widget的model
      allCagoryModel: {}
    }
  },
  mounted () {
    // 获取当前卡片选择范围
    let that = this
    this.$store.dispatch('resource/loadCategory', this.category).then(res => {
      this.allCagoryModel = _.cloneDeep(res.widgets)
      let widgets = _.values(res.widgets).filter(w => !w.deleted)     
      that.allWidgets = _.map(widgets, function (item) {
        return item.value
      })
      let arr = that.allWidgets
      arr.splice(arr.findIndex(item => item === 'opportunityAssess'), 1)
      that.allWidgets = arr
      console.log(arr)
    })
    // 获取当前已启用的卡片列表
    if (this.widgets && Object.keys(this.widgets).length) {
      this.usedWidgets = _.keys(this.widgets)
      this.categoryModel = _.cloneDeep(this.widgets)
    } else {
      this.$store.dispatch(`${this.category}/load${this.capitalize(this.category)}`, +this.objectID).then(res => {       
        that.usedWidgets = _.keys(res.widgets)
        // let arr = _.keys(res.widgets)
        // arr.splice(arr.findIndex(item => item === 'opportunityAssess'), 1)
        // that.usedWidgets = arr
        // console.log(arr)
        that.categoryModel = _.cloneDeep(res.widgets)
        // // 如果资源时模板，则目前模板可选的工具包有：任务、公告、文档、自动提问
        // if (res.isTemplate) {
        //   that.allWidgets = ['task', 'document', 'notice', 'checkins']
        // }
      })
    }
  },
  computed: {
    // 获取当前未启用的卡片列表
    noUsedWidgets () {
      return _.without(this.allWidgets, ...this.usedWidgets)
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  methods: {
    ...format,
    // 保存配置
    saveSettingWidgets (val) {
      let widgetObj = {}
      _.forEach(this.usedWidgets, r => {
        widgetObj[r] = this.categoryModel[r] || _.assign({}, this.allCagoryModel[r].setting || {}, { order: this.allCagoryModel[r].order })
      })
      this.$store.dispatch(`${this.category}/update${this.capitalize(this.category)}Field`,
        { id: +this.objectID, widgets: widgetObj }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
