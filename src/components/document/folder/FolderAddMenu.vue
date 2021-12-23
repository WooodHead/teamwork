<!--
@Name：文档中心文件夹新增菜单
@Author：陆欢
@date：2021/02/26
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-btn
      :unelevated="unelevated"
      icon="add"
      :label="label"
      :title="title"
      class="cursor-pointer"
      :color="color"
      :text-color="textColor"
      :rounded="rounded"
      :round="round"
      :flat="flat"
      :dense="dense"
    >
      <q-menu auto-close>
        <q-list>
          <div
            v-for="item in addListCanSee"
            :key="item.key"
          >
            <q-separator
              v-if="item.key==='linkdoc'"
              spaced
            />
            <q-item
              clickable
              v-close-popup
              @click="item.click"
              color="primary"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{item.label}}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-menu>
    </q-btn>
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card style="background:none">
        <folder-add
          :category="category"
          :objectID="objectID"
          :id="id"
          class="q-mr-md span-stype handle"
          @closeAddFolder="showDialog=false"
        ></folder-add>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { i18n } from '@/boot/i18n'
export default {
  name: 'FolderAddMenu',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    },
    excludeMenus: {
      type: Array,
      default: () => []
    },
    unelevated: { type: Boolean, default: true },
    label: { type: String, default: i18n.t('action.add') },
    title: { type: String, default: '' },
    color: { type: String, default: 'positive' },
    textColor: { type: String, default: 'white' },
    rounded: { type: Boolean, default: true },
    round: { type: Boolean, default: false },
    flat: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  },
  data () {
    return {
      showDialog: false,
      addList: [
        {
          key: 'doc',
          icon: 'note_add',
          label: this.$t('document.action.add.Doc'),
          click: () => { this.openEditPage('docAdd') }
        },
        {
          key: 'folder',
          icon: 'create_new_folder',
          label: this.$t('document.action.add.Folder'),
          click: () => { this.addFolder() }
        },
        {
          key: 'upload',
          icon: 'file_upload',
          label: this.$t('document.action.add.Upload'),
          click: () => { this.openEditPage('fileUpload') }
        },
        {
          key: 'linkdoc',
          icon: 'insert_link',
          label: this.$t('document.action.add.LinkDoc'),
          click: () => { this.openEditPage('linkAdd') }
        },
        {
          key: 'markmap',
          icon: 'all_inclusive',
          label: this.$t('document.action.add.Markmap'),
          click: () => { this.openEditPage('markmapAdd') }
        }
      ]
    }
  },
  computed: {
    ...mapState('document', ['emptyFolder', 'listType']),
    model () {
      if (this.category && this.objectID && this.id === 0) {
        if (this.category === 'product') {
          return this.$store.getters['document/productDocument'](+this.objectID)
        } else {
          return this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
        }
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    },
    addListCanSee () {
      let that = this
      return _.filter(this.addList, add => !that.excludeMenus.includes(add.key))
    }
  },
  methods: {
    ...mapActions('document', ['addEmptyFolder']),
    addFolder () {
      this.addEmptyFolder()
      if (this.listType !== 'card') {
        this.showDialog = true
      }
    },
    openEditPage (name) {
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      let params = inDocumentCenter
        ? { id: +this.model.id }
        : { category: this.category, objectID: this.objectID, id: +this.model.id }

      this.$router.push({
        name: name,
        params
      })
    }
  },
  components: {
    FolderAdd: () => import('components/document/folder/FolderAdd')
  }
}
</script>

<style scoped lang="scss">
</style>
