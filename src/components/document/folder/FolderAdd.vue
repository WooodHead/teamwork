<template>
  <transition
    appear
    enter-active-class="animated zoomIn"
  >
    <q-form>
      <q-card
        class="cursor-pointer text-center widget-card full-width"
        style="overflow:hidden"
      >
        <div class="widget-card-section">
          <!-- title -->
          <q-card-section
            :class="['q-pb-none toolsCardStyle',{'q-pt-md':$q.screen.lt.sm}]"
            style="margin: 1em 0em 0em;"
          >
            <q-input
              outlined
              ref="editorTitle"
              v-model="editor"
              dense
              @keyup.enter="submitOnFolder({target:{innerText:$q.lang.label.ok}})"
              :rules="[val => !!val.trim() || $t('productCase.formCerifyRule.title')]"
            />
            <q-list
              style="margin-top: -15px;"
              dense
            >
              <q-item>
                <q-item-section>
                  <q-checkbox
                    v-if="!model.acl&&$route.name!=='productCaseHome'"
                    :true-value="2"
                    :false-value="0"
                    v-model="acl"
                    label="保密"
                  >
                  </q-checkbox>
                </q-item-section>
              </q-item>
              <q-item style="margin-top: -15px;">
                <q-item-section>
                  <!-- 仅自己可编辑 -->
                  <q-checkbox
                    v-if="$route.name!=='productCaseHome'"
                    :true-value="1"
                    :false-value="0"
                    v-model="onlyICanEdit"
                    label="仅自己可编辑"
                  >
                  </q-checkbox>
                </q-item-section>
              </q-item>
            </q-list>

          </q-card-section>
        </div>
        <!-- 底部栏 -->
        <q-card-actions
          vertical
          class="absolute-bottom"
          @click.stop="submitOnFolder($event)"
        >
          <q-btn
            dense
            rounded
            class="bg-primary text-white q-mb-md"
          >{{$q.lang.label.ok}}</q-btn>
          <q-btn
            dense
            rounded
            outline
            color="primary"
          >{{$q.lang.label.cancel}}</q-btn>
        </q-card-actions>
      </q-card>
    </q-form>
  </transition>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
// import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'FolderAdd',
  props: {
    category: {
      type: String,
      default: 'document'
    },
    objectID: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      editor: '',
      acl: 0,
      onlyICanEdit: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.editorTitle.focus()
    }, 100)
  },
  computed: {
    model () {
      if (this.category && this.objectID && this.id === 0) {
        return this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    }
  },
  components: {
    // TwOnlyICanHandle: () => import('components/base/TwOnlyICanHandle')
  },
  methods: {
    ...mapActions('document', ['submitFolder']),
    ...mapMutations('document', ['cancleEmptyFolder']),
    submitOnFolder (event) {
      let clickText = event.target.innerText
      if (clickText === this.$q.lang.label.ok) {
        if (this.editor.trim()) {
          // 封装文档对象
          const my = this.$q.localStorage.getItem('myself')
          let newFolder = {
            acl: this.acl,
            whiteList: this.acl ? [this.$myinfo.id] : [],
            title: this.editor,
            parentId: +this.model.id,
            authorID: my.id,
            authorName: my.name,
            isPublish: this.$route.name === 'productCaseHome' ? 0 : 1,
            classify: 'folder',
            objectType: this.category || this.model.objectType || 'document',
            objectID: this.objectID || this.model.objectID || 0,
            onlyICanEdit: this.onlyICanEdit
          }
          const { category, objectID } = this.$router.currentRoute.params
          if (category) {
            Object.assign(newFolder, { objectID: objectID || 0, objectType: category })
          }
          this.submitFolder(newFolder)
        }
      } else if (clickText === this.$t('label.cancel')) {
        this.cancleEmptyFolder()
        this.editor = ''
      }
      this.$emit('closeAddFolder')
    }
  }
}
</script>

<style lang="scss" scoped>
  .widget-card {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C255%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E");
    background-size: cover;
    background-color: #e6e6e6;
  }
  .widget-card:before {
    content: "";
    display: block;
    padding-top: 128% !important;
  }
  @media (min-width: $breakpoint-xs-max) {
    .widget-card {
      width: 12rem !important;
      display: block;
    }
  }
</style>
