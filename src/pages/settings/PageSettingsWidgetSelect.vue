<!-- 资源工具包添加页面 -->
<template>
  <q-card class="card-grow-in-page" :flat="$q.screen.lt.sm">
    <tw-header-card
      :title="
        $t('settings.widget.addWidget', { name: $t(`${category}.module`) })
      "
    />
    <q-card-section>
      <q-list separator padding class="q-px-xxl">
        <q-item v-ripple v-for="widget in widgets" :key="widget.value">
          <!-- 图标 -->
          <q-item-section avatar>
            <q-btn round :icon="widget.icon" :color="widget.color" />
          </q-item-section>
          <!-- 标题 -->
          <q-item-section>
            <q-item-label>{{ widget.label }}</q-item-label>
            <q-item-label caption>{{ widget.notes }}</q-item-label>
          </q-item-section>
          <!-- 选中 -->
          <q-item-section side>
            <q-checkbox v-model="widget.default" @input="checkWidget(widget)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'PageSettingsWidgetSelect',
  props: {
    category: {
      type: String,
      required: true,
      default: 'project'
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  data () {
    return {
      widgets: {},
      check1: true
    }
  },
  computed: {
    objCategory () {
      return this.$store.getters['resource/category'](this.category)
    },
    widgetsArr () {
      return _.map(this.objCategory.widgets, item => item).filter(w => !w.deleted)
    }
  },
  methods: {
    ...mapActions('resource', ['loadCategory', 'updateCategory']),
    checkWidget (widget) {
      if (widget.default) {
        // order
        widget.order = this.widgetsArr.length + 1
        // deleted
        widget.deleted = false
        // setting
        !_.has(widget, 'setting') && (widget.setting = {})
        this.objCategory.widgets[widget.value] = _.clone(widget)
        this.objCategory.widgets[widget.value].default = false
      } else {
        this.objCategory.widgets[widget.value].deleted = true
        this.updateOrder()
      }
      let that = this
      this.updateCategory(this.objCategory).then(category => {
        that.updateCheck(category)
      })
    },
    updateOrder () {
      let used = this.widgetsArr.filter(w => w.default)
      let noUsed = _.without(this.widgetsArr, ...used)
      used.map((widget, index) => {
        widget.order = index + 1
      })
      noUsed.map((widget, index) => {
        widget.order = used.length + index + 1
      })
    },
    updateCheck (category) {
      Object.keys(this.widgets).forEach(index => {
        this.$set(this.widgets[index], 'default', false)
      })
      // 初始化
      Object.keys(category.widgets).forEach(index => {
        if (!category.widgets[index].deleted) {
          this.widgets[index].default = true
        }
      })
    },
    // 资源支持个性化设置，如修改名称、简介等，这里统一处理添加页面的数据映射
    // 映射 label,color,icon,notes
    updateWidgetInfo (currentWidgets, widgets) {
      Object.keys(currentWidgets).forEach(index => {
        let item = currentWidgets[index]
        let widget = _.find(widgets, w => w.value === item.value)
        if (widget) {
          widget.label = item.label
          widget.color = item.color
          widget.icon = item.icon
          widget.notes = item.notes
        }
      })
    }
  },
  mounted () {
    let data = this.$store.getters['widget/widgets']
    this.$delete(data, 'action')
    this.widgets = data
    if (!this.objCategory) {
      let that = this
      this.loadCategory(this.category).then(category => {
        if (category) {
          that.updateWidgetInfo(category.widgets, that.widgets)
          that.updateCheck(category)
        }
      })
    } else {
      this.updateWidgetInfo(this.objCategory.widgets, this.widgets)
      this.updateCheck(this.objCategory)
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
