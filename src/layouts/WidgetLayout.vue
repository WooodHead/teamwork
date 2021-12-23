<template>
  <q-card
    class="cursor-pointer text-center widget-card"
    @click="cardClick&&routeWidget({widget:widget,category:category,objectID:Number(id)})"
  >
    <div class="widget-card-section fit">
      <q-card-section class="q-pt-sm q-pb-xs">
        <div class="text-subtitle2 text-weight-bold">
          <slot name="header">
            {{objWidget.label}}
          </slot>
        </div>
      </q-card-section>

      <q-card-section
        class="q-py-none"
        v-if="$q.screen.gt.xs"
      >
        <q-separator />
      </q-card-section>
      <template v-if="isEmpty">
        <q-card-section :class="$q.screen.gt.xs?'q-py-md':'q-py-xs'">
          <slot name="check">
            <q-avatar
              :size="$q.screen.gt.xs?'80px':'60px'"
              :font-size="$q.screen.gt.xs?'50px':'37px'"
              :color="objWidget.color"
              text-color="white"
              :icon="objWidget.icon"
            />
          </slot>
          <div v-if="isSetting&&objWidget.setting&&(Object.keys(objWidget.setting).length)">
            <component
              v-if="categorys&&categorys[category]"
              :is="`Setting${capitalize(widget)}`"
              :category="category"
              :objectID="id"
              :widget="categorys[category].widgets[widget]"
              @update="updateWidgetSetting"
            />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-9">
          <slot name="notes">
            {{objWidget.notes}}
          </slot>
        </q-card-section>
      </template>
      <slot
        name="content"
        class="no-pointer-events"
      ></slot>
    </div>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'WidgetLayout',
  props: {
    category: { type: String, required: true },
    id: { type: [Number, String], required: true },
    widget: { type: String, required: true },
    isEmpty: { type: Boolean, required: true },
    cardClick: { type: Boolean, default: true },
    isSetting: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否自定义。资源详情页不需要显示自定义'
    }
  },
  data () {
    return {
      objWidget: {}
    }
  },
  computed: {
    ...mapState('resource', ['categorys']),
    objCategory () {
      return this.$store.getters['resource/category'](this.category)
    }
  },
  mounted () {
    if (this.objCategory) {
      this.objWidget = this.objCategory.widgets[this.widget]
    } else {
      this.loadCategory(this.category).then((res) => {
        if (res) {
          this.objWidget = res.widgets[this.widget]
        }
      })
    }
  },
  methods: {
    capitalize,
    ...mapActions('resource', ['loadCategory', 'updateCategory']),
    ...mapActions('widget', ['routeWidget']),
    updateWidgetSetting (type, widget) {
      // 该页面目前有两部分调用且共用自定义组件，所以自定义变更后需判断
      if (type === 'resource') {
        let model = _.cloneDeep(this.objCategory)
        model.widgets[widget.value] = widget
        this.updateCategory(model)
      } else {
        this.$store.dispatch(`${this.category}/update${this.capitalize(this.category)}Field`,
          { id: +this.id, widgets: widget }
        )
      }
    }
  },
  components: {
    SettingWorkHour: () => import('components/widget/setting/SettingWorkHour'),
    SettingTask: () => import('components/widget/setting/SettingTask'),
    SettingChat: () => import('components/widget/setting/SettingChat')
  }
}
</script>

<style lang="scss" scoped>
</style>
