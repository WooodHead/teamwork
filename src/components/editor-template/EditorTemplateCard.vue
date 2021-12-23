<template>
  <div>
    <div class="q-px-none">
      <div
        class="row items-center cursor-pointer"
        v-if="!editorTemplateGroupFormShow"
        :title="!selected?'点击可直接编辑模板类别':''"
        @click.stop="!selected?editorTemplateGroupFormShow=true:editorTemplateGroupFormShow=false"
      >
        <div
          class="group-title"
          :class="dictionary.icon"
        >
          {{dictionary.dictKey}}
        </div>
        <q-separator class="col" />
        <q-icon
          name="clear"
          size="xs"
          v-if="!selected"
          @click.stop="deleteEvent(dictionary)"
        />
      </div>
      <div v-else>
        <editor-template-form-group
          :id="dictionary.id"
          @ok="onOk"
          @cancel="onCancel"
        />
      </div>
    </div>
    <q-card-section>
      <editor-template-form
        v-if="editorTemplateFormShow"
        :id="id"
        :type="dictionary.dictKey"
        :editorTemplateFormShow.sync="editorTemplateFormShow"
      ></editor-template-form>
      <div class="row q-col-gutter-md">
        <editor-template
          :class="$q.screen.gt.md?'col-4':'col-6'"
          v-for="editorTemplate in editorTemplates"
          :key="editorTemplate.id"
          :editorTemplate="editorTemplate"
          @openEvent="openEvent"
          @selectedEvent="(val)=>$emit('selectedEvent',val)"
          :selected="selected"
        />
        <div
          v-if="!selected"
          :class="$q.screen.gt.md?'col-4':'col-6'"
        >
          <q-card
            style="height:200px"
            @click.stop="openEvent(0)"
            class="cursor-pointer"
            flat
            bordered
          >
            <q-card-section class="fit flex items-center justify-center">
              <q-icon
                name="add"
                size="lg"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { i18n } from '@/boot/i18n'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  data () {
    return {
      editorTemplateGroupFormShow: false,
      editorTemplateFormShow: false,
      id: 0
    }
  },
  props: {
    dictionary: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    editorTemplates () {
      return this.$store.state.editorTemplate.editorTemplates.filter(a => a.type === this.dictionary.dictKey)
    }
  },
  components: {
    'editor-template': () => import('components/editor-template//EditorTemplate'),
    'editor-template-form-group': () => import('components/editor-template/EditorTemplateFormGroup'),
    'editor-template-form': () => import('components/editor-template/EditorTemplateForm')
  },
  methods: {
    ...mapActions('dictionary', ['deleteDictionary']),
    onOk () {
      this.editorTemplateGroupFormShow = false
    },
    onCancel () {
      this.editorTemplateGroupFormShow = false
    },
    openEvent (id) {
      this.id = id
      this.editorTemplateFormShow = true
    },
    deleteEvent (dictionary) {
      var _this = this
      // 弹出删除弹框
      showConfirm(i18n.t(`editorTemplate.confirmDeleteType`), () => {
        _this.deleteDictionary(dictionary).then(res => {
          showSuccessMessage(i18n.t(`editorTemplate.deleteSuccess`))
        })
      })
    }
  }
}

</script>

<style lang='scss' scoped>
.group-title {
  padding: 0.01em 0.33em;
  border-radius: 0.25em;
  word-break: break-word;
  font-size: 16px;
  font-weight: bold;
}
</style>
