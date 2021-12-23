<template>
  <div>
    <q-select
      :multiple="multiple"
      :option-value="module==='customer' && field ==='customerType'?'dictKey':'dictValue'"
      option-label="dictValue"
      :rounded="rounded"
      :outlined="outlined"
      :filled="filled"
      :clearable="clearable"
      :dense="dense"
      :readonly="readonly"
      :disable="disable"
      :label="label"
      :options="selectOptions"
      :value="selectValue"
      @input="selectHandle"
      map-options
      :lazy-rules="lazyRules"
      :rules="rules"
    >
      <template v-slot:before>
        <slot name="beforeSlot"></slot>
      </template>
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section
            avatar
            :class="{'emoji-font':$q.platform.is.win}"
            v-if="withIcon&&scope.opt.id!==-2"
          >
            {{scope.opt.icon||'😊'}}
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="scope.opt.dictValue" />
            <q-item-label
              caption
              v-html="scope.opt.notes"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-dialog
      v-model="showEditSelect"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      :maximized="$q.screen.lt.sm"
    >
      <options-edit
        :select-options="selectOptions.filter(item=>{return item.id>0})"
        :module="module"
        :field="field"
        :withIcon="withIcon"
        :withDictKey="withDictKey"
        :keys="keys"
        @close="showEditSelect=false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TwSelectEdit',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array],
      default: undefined,
      description: '传空字符换，则取第一个下拉项为默认值，如果不传值（或者传undefined），则不设定默认值'
    },
    label: {
      type: String,
      default: undefined
    },
    module: {
      type: String,
      required: true,
      description: '类型：项目类型、公告类型，例如：project、notice'
    },
    field: {
      type: String,
      required: true,
      description: '加载具体模块下面的具体类型，例如：level、type'
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "readonly" design for the field'
    },
    disable: {
      type: Boolean,
      required: false,
      default: false,
      description: 'Use "disable" design for the field'
    },
    editable: {
      type: Boolean,
      default: false,
      description: '是否可编辑'
    },
    withIcon: {
      type: Boolean,
      default: false
    },
    withDictKey: {
      type: Boolean,
      default: false,
      description: '是否需要添加code字段'
    },
    addAllOption: {
      type: Boolean,
      default: false,
      description: '是否添加所有这一选项，方便将下拉框作为筛选使用'
    },
    lazyRules: {
      type: Boolean,
      default: false
    },
    rules: { type: Array },
    keyToValue: {
      type: Boolean,
      default: false,
      description: '传递的value是dickey，需要通过dickey找到并显示dicvalue。比如机构类型'
    }
  },
  data () {
    return {
      showEditSelect: false,
      keys: ['turntableForm', 'aPositionBrake', 'aSafetyBrake', 'cPositionBrake', 'energyConsume',
        'drillingDepth', 'oilBrand', 'oilAgent', 'chuck', 'applicableChipTypes', 'refrigerantTemperature',
        'applicableShank', 'feedingCycle', 'liquidExchangeCycle', 'cycleInTerminus', 'power',
        'protectionLevel', 'touchingMethod', 'extendedFeatures', 'features', 'shankInterface',
        'airSourceQuality', 'structureType', 'applicableSpindle',
        'organizeType', 'customerType', 'grade', 'infoSource', 'applyIndustry', 'companySize',
        'type', 'level', 'delivery', 'trade', 'shankInfo', 'serviceInfo',
        'category', 'workingYears', 'educationDegree', 'processType', 'classification', 'status', 'projclassify']
    }
  },
  mounted () {
    this.loadDictionarys(this.module)
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    selectOptions () {
      let options = []
      if (this.addAllOption) {
        options.push({
          dictKey: '所有',
          dictValue: '所有',
          id: -1,
          icon: this.withIcon ? '🙌' : ''
        })
      }
      this.dictionary[this.module] && this.dictionary[this.module][this.field] && options.push(...this.dictionary[this.module][this.field])

      if (this.editable) {
        // 此处使用includes查找匹配的key可能错误（如果【type】在前，【applicableChipTypes】会优先匹配【type】），
        // 目前把【'type', 'level', 'delivery', 'trade'】几个简单项后移处理
        let findKey = _.find(this.keys, item => { return this.field.toLowerCase().includes(item.toLowerCase()) })
        options.push({
          dictKey: 'edit',
          dictValue: `<div class="text-center text-primary ">${this.$t('dictionary.edit')}${this.$t('dictionary.' + findKey + '')}</div>`,
          id: -2
        })
      }
      // 客户管理模块表单去除母机构、分机构、子机构的选项
      if (this.module === 'customer' && this.field === 'customerType') {
        options = _.filter(options, o => +o.dictKey !== 1 && +o.dictKey !== 2 && +o.dictKey !== 3)
      }
      return options
    },
    selectValue () {
      let selectValue = null
      // 初始使用value赋值
      if (this.multiple) {
        selectValue = this.value
      } else if (this.value === '' && !(this.editable && this.selectOptions.length === 1)) {
        selectValue = this.selectOptions[0]
        this.$emit('input', selectValue)
      } else {
        if (this.keyToValue) {
          const dictionary = this.selectOptions.find(r => r.dictKey === this.value)
          selectValue = (dictionary && dictionary.dictValue) || this.value
        } else {
          selectValue = this.value
        }
      }
      return selectValue
    }
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    // 此处没有只获取model，为了模块不关联字典，直接取value。方便拼接字段，所以将所以字段传回给父组件
    selectHandle (payload) {
      if (payload) {
        if ((this.multiple && _.some(payload, { dictKey: 'edit' })) || payload.dictKey === 'edit') {
          // 编辑类别
          this.showEditSelect = true
        } else {
          if (this.multiple) {
            // 多选返回简单数组
            payload = _.map(payload, p => { return _.isObject(p) ? p.dictValue : p })
          }
          this.$emit('input', payload)
        }
      } else {
        this.$emit('input', {})
      }
    }
  },
  components: {
    OptionsEdit: () => import('components/base/select-edit/OptionsEdit')
  }
}
</script>

<style lang="scss" scoped>
  .q-item__section--avatar {
    min-width: auto !important;
  }
  /deep/.q-field--auto-height .q-field__native,
  .q-field--auto-height .q-field__prefix,
  .q-field--auto-height .q-field__suffix {
    line-height: initial;
  }
  /deep/.q-field__before {
    padding-right: 0px;
  }
</style>
