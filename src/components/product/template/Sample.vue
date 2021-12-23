<template>
  <div>
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Tool"
        :label="$t('product.fields.tool')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.Platform"
        :label="$t('product.fields.platform')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ParticleSize"
        :label="$t('product.fields.particleSize')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-select
        filled
        v-model="fields.params.Type"
        emit-value
        map-options
        option-value="dictValue"
        option-label="dictKey"
        :label="$t('product.fields.type')"
        :options="typeData"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Machine"
        :label="$t('product.fields.machine')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.Spindle"
        :label="$t('product.fields.spindle')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Material"
        :label="$t('product.fields.material')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.Time"
        :label="$t('product.fields.time')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <q-select
      filled
      :label="$t('product.fields.feature')"
      v-model.trim="fields.params.Feature"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add"
      placeholder="输入后按Enter确认"
    />

    <quasar-editor
      :value="TestText"
      @input="(val)=>{fields.params.TestText=val}"
      :applied="goIntoAction"
      :focus="false"
      placeholder="检测报告"
      class="q-my-md"
    ></quasar-editor>

    <q-field filled>
      <q-checkbox
        v-model="fields.params.isRecommend"
        color="secondary"
        label="是否推荐"
      />
    </q-field>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Sample',
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  },
  props: {
    fields: Object,
    openType: { type: String, default: 'add' }
  },
  data () {
    return {
      goIntoAction: false,
      tableHtml: '',
      TestText: ''
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    typeData () {
      return this.dictionary['sample'] ? this.dictionary['sample']['type'] : []
    }
  },
  mounted () {
    this.TestText = this.fields.params.TestText
    // 从字典中获取加工类型数据
    this.loadDictionarys('sample')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    // 检测报告数据
    changeTest (payload) {
      this.fields.params.Test = payload
    },
    // 加工报告数据
    changeStep (payload) {
      this.fields.params.Step = payload
    }
  }
}
</script>

<style lang="scss" scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
