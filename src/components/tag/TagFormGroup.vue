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
          :placeholder="$t('tag.module.placeholder')"
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
  name: 'TagFormGroup',
  props: {
    bordered: {
      type: String,
      required: false,
      default: 'bordered'
    },
    // 标签模块ID
    id: {
      type: [Number, String],
      required: false,
      default: 0
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
      ]
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('tag', ['loadTags']),
    ...mapActions('dictionary', ['editDictionary', 'loadDictionary']),
    // 提交
    onSubmit () {
      this.model.module = 'tag'
      this.model.field = 'tag'
      this.model.dictValue = this.model.dictKey
      this.model.icon = this.background
      this.editDictionary(this.model).then(res => { this.loadTags(false) })
      this.$emit('close', this.model)
    },
    onReset () {
      this.$emit('close')
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
    }
  },
  mounted () {
    if (+this.id !== 0) {
      let that = this
      this.loadDictionary(+this.id).then(dictionary => {
        Object.assign(this.model, _.cloneDeep(dictionary))
        that.initModel()
      })
    } else {
      this.initModel()
    }
  }

}
</script>

<style>
</style>
