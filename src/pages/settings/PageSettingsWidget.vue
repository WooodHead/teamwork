<!-- 资源工具包配置页面 -->
<template>
  <q-card
    class="card-grow-in-page tw-bg-grid"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card :title="$t('settings.widget.pageTitle',
     {name: $t(`${category}.module`)})" />
    <!-- 已启用卡片 -->
    <draggable
      v-if="usedWidgets.length"
      @change="onDrag"
      v-model="usedWidgets"
      v-bind="dragOptions"
      handle=".handle"
      class="row q-gutter-md justify-center q-pt-md"
    >
      <widget-setting-card
        v-for="widget in usedWidgets"
        :key="widget.value"
        :widget="widget"
        :categoryName="category"
        @update="updateWidget"
        @remove="removeWidget"
      >
        <template slot="moveBtn">
          <!-- 移动按钮 -->
          <q-btn
            dense
            flat
            rounded
            icon="drag_handle"
            color="grey-5"
            class="widget-move-btn handle"
            style="cursor: move;"
            title="拖动排序"
          />
        </template>
      </widget-setting-card>
    </draggable>
    <!-- 未启用卡片提示 -->
    <q-item-label
      v-if="usedWidgets.length"
      class="text-h5 text-center q-my-lg"
    >{{$t('widget.noUsedWidgetsInfo')}}</q-item-label>
    <!-- 未启用卡片列表 -->
    <draggable
      v-if="noUsedWidgets.length"
      @change="onDrag"
      v-model="noUsedWidgets"
      v-bind="dragOptions"
      handle=".handle"
      class="row q-gutter-md justify-center q-mb-md"
    >
      <widget-setting-card
        v-for="widget in noUsedWidgets"
        :key="widget.value"
        :widget="widget"
        :categoryName="category"
        @update="updateWidget"
        @remove="removeWidget"
      >
        <template slot="moveBtn">
          <!-- 移动按钮 -->
          <q-btn
            dense
            flat
            rounded
            icon="drag_handle"
            color="grey-5"
            class="widget-move-btn handle"
            style="cursor: move;"
            title="拖动排序"
          />
        </template>
      </widget-setting-card>
    </draggable>
    <!-- 添加工具包 -->
    <div class="column items-center q-mb-md">
      <!-- 无默认工具包 -->
      <q-item-label
        v-if="!widgets.length"
        class="text-h6 text-center q-mb-lg"
      >
        {{$t('settings.widget.noDefault',{name: $t(`${category}.module`)})}}
      </q-item-label>
      <!-- 添加其他工具包 -->
      <q-card
        class="widget-card"
        @click="toPageResourceAdd"
      >
        <div
          style="height:100%;"
          class="widget-card-section"
        >
          <q-btn
            class="full-width"
            style="height:100%;"
          >
            <div class="text-center">
              <q-icon name="add" />
              <div>
                {{$t('settings.widget.addOther')}}
              </div>
            </div>
          </q-btn>
        </div>
      </q-card>
    </div>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import draggable from 'vuedraggable'
export default {
  name: 'PageSettingsWidget',
  props: {
    category: {
      type: String,
      required: true,
      default: 'project'
    }
  },
  data () {
    return {
      model: {},
      dragOptions: {
        delay: '100'
      }
    }
  },
  computed: {
    widgets () {
      let array = _.map(this.model.widgets, item => item)
      return array.filter(w => !w.deleted).sort((a, b) => a.order - b.order)
    },
    usedWidgets: {
      get () {
        let widgets = this.widgets.filter(w => w.default)
        return widgets.sort((a, b) => a.order - b.order)
      },
      set (val) {
        val.map((widget, index) => {
          widget.order = index + 1
          this.model.widgets[widget.value] = widget
        })
      }
    },
    noUsedWidgets: {
      get () {
        let widgets = _.without(this.widgets, ...this.usedWidgets)
        return widgets.sort((a, b) => a.order - b.order)
      },
      set (val) {
        val.map((widget, index) => {
          widget.order = this.usedWidgets.length + index + 1
          this.model.widgets[widget.value] = widget
        })
      }
    }
  },
  components: {
    draggable,
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    WidgetSettingCard: () => import('components/settings/WidgetSettingCard')
  },
  methods: {
    ...mapActions('resource', ['loadCategory', 'updateCategory']),
    onDrag (event) {
      this.updateModel(this.model)
    },
    updateWidget (widget) {
      // 选中状态改变
      if (widget.default !== this.model.widgets[widget.value].default) {
        this.model.widgets[widget.value] = widget
        this.$store.commit('resource/updateCategory', this.model)
        // 更新排序字段
        if (widget.default) {
          widget.order = this.usedWidgets.length
          this.resortNoUsedWidgets()
        } else {
          widget.order = this.widgets.length + 1
          this.resortUsedWidgets()
          this.resortNoUsedWidgets()
        }
      } else {
        this.model.widgets[widget.value] = widget
      }
      // 更新model
      this.updateModel(this.model)
    },
    resortUsedWidgets () {
      this.usedWidgets.map((widget, index) => {
        widget.order = index + 1
      })
    },
    resortNoUsedWidgets () {
      this.noUsedWidgets.map((widget, index) => {
        widget.order = this.usedWidgets.length + index + 1
      })
    },
    removeWidget (widget) {
      this.model.widgets[widget.value].deleted = true
      this.$store.commit('resource/updateCategory', this.model)
      this.resortUsedWidgets()
      this.resortNoUsedWidgets()
      this.updateModel(this.model)
    },
    updateModel (model) {
      let that = this

      this.updateCategory(model).then(category => {
        that.model = category
      })
    },
    toPageResourceAdd () {
      this.$router.push({
        name: 'settingsWidgetSelect',
        params: { category: this.category }
      })
    }
  },
  created () {
    let that = this
    this.loadCategory(this.category).then(res => {
      that.model = res
    })
  }
}

</script>

<style lang='scss' scoped>
.widget-move-btn {
  position: absolute;
  top: -7px;
  left: -10px;
}
</style>
