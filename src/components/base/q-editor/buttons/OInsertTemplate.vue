<template>
  <o-menubar-btn
    icon="style"
    :tooltip="$t('editor.insertTemplate')"
    @click.native="selectableTemplateEvent"
  >
    <q-dialog v-model="selectableTemplate">
      <q-card style="width: 112vh;max-width: unset;max-height:90vh">
        <div class="text-h6 q-px-md q-py-sm text-center">
          {{$t('base.selectEditorTemplate')}}
        </div>
        <q-separator />
        <q-card-section
          class="scroll"
          style="height: 80vh;"
        >
          <div
            v-for="dictionary in dictionarys"
            :key="dictionary.id"
          >
            <editor-template-card
              :dictionary="dictionary"
              :selected="true"
              @selectedEvent="selectTemplate"
            ></editor-template-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </o-menubar-btn>
</template>

<script>
import OMenubarBtn from '@/components/base/q-editor/buttons/OMenubarBtn'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'o-link-btn',
  data () {
    return {
      selectableTemplate: false// 模板选择弹框是否显示
    }
  },
  props: {
    editor: {
      type: Object
    },
    commands: {
      type: Object
    },
    isActive: {
      type: Object
    },
    getMarkAttrs: {
      type: Function
    }
  },
  components: {
    OMenubarBtn,
    'editor-template-card': () => import('components/editor-template/EditorTemplateCard')

  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapActions('editorTemplate', ['loadEditorTemplates']),
    selectableTemplateEvent () {
      this.$nextTick(() => {
        this.loadEditorTemplates().then(res => {
          this.selectableTemplate = true
        })
      })
    },
    selectTemplate (val) {
      this.editor.focus()
      this.editor.setContent(val)
      this.$emit('input', val)
      this.selectableTemplate = false
      return true
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    dictionarys () {
      return this.dictionary['editorTemplate'] ? this.dictionary['editorTemplate']['editorTemplate'] : []
    }
  },
  created () {
    this.loadDictionarys('editorTemplate')
  }
}
</script>
