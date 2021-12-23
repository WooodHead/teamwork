<template>
  <q-card
    flat
    bordered
    class="q-mb-md"
  >
    <q-form
      autofocus
      ref="myForm"
      class="q-pa-md"
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <div>
        {{id!==0?'编辑模板':'添加模板'}}
      </div>
      <div class="q-gutter-y-md q-mt-lg">
        <q-input
          filled
          v-model="model.title"
          :placeholder="$t('editorTemplate.editorTemplateTitle')"
          lazy-rules
          :rules="[val => !!val && !!val.trim() || $t('editorTemplate.editorTemplateTitle')]"
          autofocus
          debounce="500"
        />
        <q-input
          filled
          v-model="model.description"
          :placeholder="$t('editorTemplate.editorTemplateDescription')"
          debounce="500"
        />
        <quasar-editor
          @input="(val)=>{model.content=val}"
          :value="oldContent"
          folder="editorTemplate"
          :applied="goIntoAction"
          :placeholder="$t('editorTemplate.editorTemplateContent')"
        ></quasar-editor>
      </div>
      <!-- 按钮 -->
      <q-card-actions
        align="center"
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
import EditorTemplate from '@/store/editor-template/model'
import { mapActions } from 'vuex'
export default {
  props: {
    // 模板ID
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    type: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      model: new EditorTemplate(),
      oldContent: '',
      goIntoAction: false
    }
  },
  mounted () {
    let that = this
    if (+that.id !== 0) {
      that.loadEditorTemplate(+that.id).then(editorTemplate => {
        that.model = _.clone(editorTemplate)
        that.oldContent = that.model.content
      })
    }
  },
  methods: {
    ...mapActions('editorTemplate', ['loadEditorTemplate', 'addEditorTemplate', 'updateEditorTemplate']),
    onSubmit () {
      this.goIntoAction = true
      this.$nextTick(() => {
        if (!!this.model.content && !!this.model.content.trim()) {
          if (+this.id !== 0) {
            this.updateEditorTemplate(this.model)
          } else {
            this.model.type = this.type
            this.addEditorTemplate(this.model)
          }
          this.$emit('update:editorTemplateFormShow', false)
        } else {
          this.$q.notify({ message: '请输入模板内容', icon: 'warning', color: 'purple' })
        }
      })
    },
    onReset () {
      this.$nextTick(() => {
        this.$emit('update:editorTemplateFormShow', false)
      })
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  }
}
</script>

<style scoped lang="scss">
</style>
