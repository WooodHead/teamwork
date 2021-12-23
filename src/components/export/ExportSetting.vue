<template>
  <q-card
    flat
    style="min-width: 350px;"
  >
    <q-card-section>
      <q-input
        filled
        :value="exportPdfName"
        @input="setFileName($event)"
        dense
      >
        <template v-slot:before>
          <span class="text-subtitle2">导出名称</span>
        </template>
      </q-input>

    </q-card-section>
    <template v-if="haveSelfSetting.includes(moduleType)">
      <component
        :is="`${capitalize(moduleType)}Setting`"
        :needSettingProperty="cloneDeep(this.needSettingProperty)"
        @apply="apply"
      ></component>
    </template>
  </q-card>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format
const haveSelfSetting = ['task']
export default {
  name: 'ExportSetting',
  props: {
    moduleType: {
      type: String,
      required: true,
      description: '模块类型,例如：document.notice'
    },
    fileName: {
      type: String,
      default: '',
      required: false,
      description: '导出文件名称。默认为：模块名+列表信息，例如项目列表信息，团队列表信息'
    },
    needSettingProperty: {
      type: Object,
      default: () => { return {} },
      required: false,
      description: '需要更新的内容'
    }
  },
  data () {
    return {
      haveSelfSetting,
      exportPdfName: ''
    }
  },
  mounted () {
    this.exportPdfName = _.cloneDeep(this.fileName)
  },
  methods: {
    capitalize,
    cloneDeep: _.cloneDeep,
    apply (info) {
      this.$emit('update:needSettingProperty', info)
    },
    setFileName (name) {
      // 修改文件名称
      !this.exportPdfName && (this.exportPdfName = this.fileName)
      this.$emit('update:fileName', name)
    }
  },
  components: {
    TaskSetting: () => import('components/export/export-task/TaskSetting')
  }
}
</script>
