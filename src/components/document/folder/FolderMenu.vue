<template>
  <div>
    <tw-menu
      :flat="flat"
      :size="size"
      :menus="menuListFilter"
      @rename="showRenameDialog = true"
      @move="moveItem()"
      @delete="deleteItem()"
      @publish="publishItem()"
      @dropPublish="dropPublishItem()"
      @changeCover="uploadSnapshotPathConfirm()"
      @archive="archiveDocument(model.id)"
      @copy="copyItem()"
      @bookmark="bookmark()"
      @deleteBookmark="removeBookmark()"
      @secrecy="updateSecrecy()"
    />
    <!-- 重命名弹出内容 -->
    <q-dialog v-model="showRenameDialog">
      <q-card
        :style="$q.platform.is.mobile?'':'min-width:500px'"
        :class="{ 'full-width': $q.platform.is.mobile }"
      >
        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            ref="folderTitle"
            v-model="title"
            @keyup.enter="updateName"
            :hint="!$q.platform.is.mobile&&$t('document.field.hint.title')"
            :rules="[val => !!val.trim() || $t('document.field.rule.title')]"
            input-class="text-center"
          >
          </q-input>
          <div
            v-if="$q.platform.is.mobile"
            class="row q-gutter-md justify-center"
          >
            <q-btn
              color="primary"
              :label="$q.lang.label.ok"
              @click="updateName"
            />
            <q-btn
              color="primary"
              :label="$q.lang.label.cancel"
              @click="showRenameDialog = false"
              outline
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <upload-file
      v-show="false"
      class="q-py-md"
      ref="uploadFile"
      folder="document"
      @uploaded="uploaded"
      accept=".jpg, image/*"
    >
    </upload-file>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
import { documentMenuList } from '@/components/document/file/public-file-menuList.js'
export default {
  name: 'FolderMenu',
  props: {
    model: {
      type: Object,
      required: true
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    },
    excludeButton: {
      type: Array,
      default: () => { return [] },
      required: false,
      description: '排除的按钮'
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    }
  },
  data () {
    return {
      showRenameDialog: false,
      title: '',
      myself: LocalStorage.getItem('myself'),
      isBookmark: false
    }
  },
  mounted () {
    this.title = this.model.title
    this.isExistBookmark()
  },
  watch: {
    'model.title' () {
      this.title = this.model.title
    }
  },
  computed: {
    ...mapGetters('file', ['canPreviewExts']),
    menuListFilter () {
      return documentMenuList(this, 'folder')
    }
  },
  methods: {
    ...mapActions('document', ['updateDocumentField', 'deleteDocument', 'archiveDocument']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    deleteItem () {
      let that = this
      let message = this.$t('message.reallyDelete')
      if (this.model.children.length > 0) {
        message = this.$t('document.warning.hasChildrenDocument')
      }
      showConfirm(message, () => {
        if (this.isBookmark) {
          this.removeBookmark()
        }
        this.deleteDocument(that.model.id)
      })
    },
    publishItem () {
      // 发布前先判断是否已有封面
      if (!this.model.snapshotPath) {
        showWarningMessage('请先上传封面再发布')
        return false
      }
      showConfirm(this.$t('message.reallyPublish'), () => {
        this.directPublish()
      })
    },
    dropPublishItem () {
      showConfirm('确定撤销发布吗？', () => {
        this.dropPublish()
      })
    },
    uploadSnapshotPathConfirm () {
      this.$refs.uploadFile.$refs.qUploader.pickFiles()
    },
    uploaded (file) {
      let fields = {
        DocID: +this.model.id,
        SnapshotPath: file[0].PathName
      }
      // 更新视频封面
      this.updateDocumentField(fields)
        .then(() => {
          showSuccessMessage('封面添加成功')
        })
    },
    dropPublish () {
      let fields = {
        DocID: +this.model.id,
        IsPublish: 0
      }
      this.updateDocumentField(fields)
        .then(() => {
          showSuccessMessage('撤销发布成功')
        })
    },
    directPublish () {
      let fields = {
        DocID: +this.model.id,
        IsPublish: 1
      }
      this.updateDocumentField(fields)
        .then(() => {
          showSuccessMessage('发布成功')
        })
    },
    updateName () {
      if (this.$refs.folderTitle.validate()) {
        this.updateDocumentField({ DocID: this.model.id, Title: this.title })
        this.showRenameDialog = false
      }
    },
    moveItem () {
      let params = { id: +this.model.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: +this.objectID })
      }
      this.$router.push({ name: 'folderMove', params })
    },
    copyItem () {
      let params = { id: +this.model.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: +this.objectID })
      }
      this.$router.push({ name: 'folderCopy', params })
    },
    // 添加书签
    bookmark () {
      const { name, params, path } = this.$route
      let bookmark = new Bookmark({
        module: {
          id: +this.objectID,
          title: '',
          type: this.category
        },
        route: { name, params, path },
        objectID: +this.model.id,
        objectType: this.model.classify,
        objectTitle: this.model.title,
        owner: this.myself.id
      })
      this.addBookmark(bookmark).then(res => {
        if (res) {
          this.isBookmark = true
          showSuccessMessage(this.$t(`bookmark.addBookmarkSuccess`))
        } else {
          showWarningMessage(this.$t(`bookmark.addBookmarkFail`))
        }
      })
    },
    // 移除书签
    removeBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.model.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.model.classify, Oper: 'eq' }
      ]
      this.deleteBookmark(query).then(res => {
        if (res) {
          this.isBookmark = false
          showSuccessMessage(this.$t(`bookmark.delBookmarkSuccess`))
        } else {
          showWarningMessage(this.$t(`bookmark.delBookmarkFail`))
        }
      })
    },
    // 判断当前页面是否存在书签
    isExistBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.model.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.model.classify, Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    },
    updateSecrecy () {
      this.model.acl = 2
      this.model.whiteList = [...this.model.whiteList, this.$myinfo.id]
      let createPerson = _.find(this.$store.getters['person/selectPersonsSorted'], p => p.name === this.model.createBy)
      let createByID = createPerson ? createPerson.id : 0
      createByID && this.model.whiteList.push(createByID)
      this.model.whiteList = _.uniq(this.model.whiteList)
      this.$store.dispatch(`document/updateDocument`, this.model)
        .then(res => {
          this.$q.notify({ message: '设置成功！', icon: 'check', color: 'positive' })
        })
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    UploadFile: () => import('components/file/UploadFile')
  }
}
</script>

<style scoped>
  .q-item__section--avatar {
    min-width: 30px;
  }
</style>
