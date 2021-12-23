<!--
@Name：导入excel的第一环节上传文档组件
@Author：陆欢
@date：2020/12/31
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <span>{{$t('excelImport.pleasePrapareImportData')}}</span>

    <div style="margin-left: 30px;">
      <a :href="href">{{$t('excelImport.downloadTemplate')}}</a>
    </div>

    <div
      style="margin-left: 30px;"
      class="q-py-lg text-grey-7 cursor-pointer"
      v-if="!showAtention"
      @click="()=>{showAtention=true}"
    >
      {{$t('excelImport.viewAttention')}}
    </div>

    <div
      v-if="showAtention"
      style="margin-left: 30px;"
      class="q-mt-md q-mb-xl text-grey-7 cursor-pointer bg-grey-2 q-pa-md"
      v-html="$t('excelImport.viewAttentionDetail')"
    >
    </div>

    <template v-if="showChoiceRepeatWay">
      <span>{{$t('excelImport.pleaseChoiceWayOfRepeatData')}}</span>
      <div
        class="row q-mb-xl"
        style="margin-left: 30px;"
      >
        <q-select
          :class="$q.screen.lt.md?'col-10':'col-6'"
          dense
          outlined
          :value="repeatDataWay"
          @input="($event)=>{repeatDataWay =$event, $emit('update:repeatDataWay',$event)}"
          emit-value
          map-options
          options-dense
          :options="options"
        />
      </div>
    </template>
    <span>{{$t('excelImport.pleaseChoiceExcelFile',{number:showChoiceRepeatWay?'三':'二'})}}</span>
    <div style="margin-left: 30px;">
      <input
        type="file"
        @change="onChange"
      />
      <span
        v-if="successaddTemplate"
        class="text-orange-4 text-italic"
      >成功</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'ImportAndDownloadTemplate',
  props: {
    importType: {
      type: String,
      default: '',
      required: false,
      description: '导入模块,例如：person、doc'
    },
    showChoiceRepeatWay: {
      type: Boolean,
      default: true,
      required: false,
      description: '是否展示数据重复方式'
    }
  },
  data () {
    return {
      repeatDataWay: 'none',
      showAtention: false,
      successaddTemplate: false,
      options: [
        {
          label: '不导入',
          value: 'none'
        },
        {
          label: '新增',
          value: 'add'
        },
        {
          label: '更新',
          value: 'update'
        }
      ]
    }
  },
  computed: {
    href () {
      return `${process.env.API_HOST}/excelTemplate/${this.$t(`${this.importType}.title`)}导入模板.xlsx`
    }
  },
  methods: {
    onChange (event) {
      this.$emit('update:file', event.target.files ? event.target.files[0] : null)
      this.successaddTemplate = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
