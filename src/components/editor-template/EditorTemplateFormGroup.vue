<template>
  <q-card
    flat
    bordered
  >
    <q-form
      autofocus
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <!-- 表单 -->
      <q-card-section :class="background">
        <q-input
          :dense="false"
          stack-label
          v-model="model.dictKey"
          :placeholder="$t('editorTemplate.editorTemplateGroupTitle')"
          lazy-rules
          :rules="[ val => val&&val.trim().length>0|| $t('rule.fieldIsRequired')]"
        />
        <div class="q-gutter-xs">
          <q-avatar
            v-for="option in colorOptions"
            :key="option.value"
            clickable
            size='sm'
            :icon="option.state===1?'done':''"
            :class="option.value"
            @click.stop="selectColor(option.value)"
            :style="option.state===1 ? 'border:0.5px solid #283c46;':'border:0.5px solid #bfbfbf'"
          ></q-avatar>
        </div>
      </q-card-section>
      <!-- 按钮 -->
      <q-card-actions
        align="left"
        class="q-px-md"
      >
        <q-btn
          :label="$q.lang.label.ok"
          type="submit"
          color="primary"
        />
        <q-btn
          outline
          :label="$q.lang.label.cancel"
          type="reset"
          color="primary"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import Dictionary from '@/store/dictionary/model'
export default {
  name: 'EditorTemplateFormGroup',
  props: {
    // 模板类型ID
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    addGroupFormShow: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      // 新建标签类别
      model: new Dictionary(),
      // 背景颜色
      background: '',
      // 颜色选项
      colorOptions: [
        {
          state: 0,
          value: 'bg-white'
        },
        {
          state: 0,
          value: 'bg-green-2'
        },
        {
          state: 0,
          value: 'bg-blue-2'
        },
        {
          state: 0,
          value: 'bg-yellow-2'
        },
        {
          state: 0,
          value: 'bg-grey-4'
        },
        {
          state: 0,
          value: 'bg-pink-2'
        },
        {
          state: 0,
          value: 'bg-brown-2'
        }
      ],
      oldModelType: ''
    }
  },
  computed: {
    editorTemplates () {
      return this.$store.state.editorTemplate.editorTemplates.filter(a => a.type === this.oldModelType)
    }
  },
  methods: {
    ...mapActions('dictionary', ['editDictionary', 'loadDictionary']),
    ...mapActions('editorTemplate', ['loadEditorTemplates', 'updateEditorTemplateFields']),
    // 提交
    onSubmit () {
      this.$nextTick(() => {
        // 维护富文本字典数据
        this.model.module = 'editorTemplate'
        this.model.field = 'editorTemplate'
        this.model.dictValue = this.model.dictKey
        this.model.icon = this.background
        // 维护模板类型字典数据
        this.editDictionary(this.model).then(res => {
          // 同步维护其下的富文本模板类别
          if (this.editorTemplates && this.editorTemplates.length) {
            _.forEach(this.editorTemplates, et => {
              this.updateEditorTemplateFields({ Id: et.id, Type: this.model.dictKey })
            })
          }
        })
        this.$emit('update:addGroupFormShow', false)
        this.$emit('ok')
      })
    },
    onReset () {
      this.$nextTick(() => {
        this.$emit('update:addGroupFormShow', false)
        this.$emit('cancel')
      })
    },
    // 选择颜色
    selectColor (value) {
      this.background = value
      Object.keys(this.colorOptions).forEach(key => {
        if (this.colorOptions[key].value === value) {
          this.colorOptions[key].state = 1
        } else {
          this.colorOptions[key].state = 0
        }
      })
    },
    // 初始化model
    initModel () {
      // 初始化背景色
      if (this.model.icon) {
        this.colorOptions.map(color => {
          if (color.value === this.model.icon) {
            color.state = 1
            this.selectColor(color.value)
          }
        })
      }
      if (this.id !== 0) {
        Object.keys(this.colorOptions).forEach(key => {
          if (this.colorOptions[key].value === this.model.icon) {
            this.colorOptions[key].state = 1
          }
        })
      } else {
        this.colorOptions[0].state = 1
      }
      this.oldModelType = _.cloneDeep(this.model.dictKey)
    }
  },
  mounted () {
    let that = this
    that.loadEditorTemplates()
    if (+that.id !== 0) {
      that.loadDictionary(+that.id).then(dictionary => {
        that.model = _.clone(dictionary)
        that.initModel()
      })
    } else {
      that.initModel()
    }
  }

}
</script>

<style>
</style>
