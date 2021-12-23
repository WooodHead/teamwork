<template>
  <div>
    <q-btn
      flat
      color="primary"
      :label="$t('widget.moreSetting')"
      @click="showDialog=true"
    />
    <q-dialog v-model="showDialog">
      <q-card style="min-width:25%">
        <q-card-section class="q-gutter-md">
          <div class="row no-wrap">
            <span class="text-h6">{{$t('widget.setting')}}{{widget.label}}</span>
            <q-space />
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              @click.stop="showDialog=false"
            />
          </div>
          <div>
            <q-option-group
              :options="options"
              type="checkbox"
              v-model="group"
            />
          </div>
          <q-btn
            class="q-px-sm"
            rounded
            :label="$t('action.save')"
            color="primary"
            @click="updateWidget"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'SettingTask',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: [Number, String],
      required: true
    },
    widget: {
      type: Object,
      required: true,
      descripton: '系统设置资源的widget'
    }
  },
  data () {
    return {
      showDialog: false,
      type: '', // 更新哪种类型的自定义
      widgetObj: {},
      group: [],
      options: [
        { label: '预计工时', value: 'predictHour' },
        { label: '实际工时', value: 'actualHour' }
        // { label: '任务来源', value: 'source' },
        // { label: '任务类型', value: 'businessType' }
      ]
    }
  },
  methods: {
    capitalize,
    init () {
      if (this.$route.name === 'settingsWidget') {
        this.type = 'resource'
        if (this.widget.setting.taskForm) this.group = this.widget.setting.taskForm
        this.widgetObj = _.cloneDeep(this.widget)
      } else if (this.$route.name === 'widgetSetting') {
        this.type = this.category
        this.$store.dispatch(`${this.category}/load${this.capitalize(this.category)}`, +this.objectID).then(res => {
          if (res.widgets && res.widgets.task && res.widgets.task.taskForm) this.group = res.widgets.task.taskForm
          this.widgetObj = _.cloneDeep(res.widgets)
        })
      }
    },
    updateWidget () {
      if (this.type) {
        if (this.type === 'resource') {
          this.widgetObj.setting.taskForm = this.group
        } else {
          this.widgetObj.task.taskForm = this.group
        }
        this.$emit('update', this.type, this.widgetObj)
      }
      this.showDialog = false
    }
  },
  watch: {
    'showDialog' (value) {
      value && this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
