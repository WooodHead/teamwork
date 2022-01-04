<template>
  <tw-menu
    :flat="flat"
    :size="size"
    :menus="menuList"
    :bgColor="bgColor"
    :anchor="anchor"
    :self="self"
    @edit="editItem()"
    @move="moveOrCopyItem('Move')"
    @copy="moveOrCopyItem('Copy')"
    @delete="deleteItem()"
    @archive="archiveItem()"
    @bookmark="bookmark()"
    @deleteBookmark='removeBookmark()'
    @publicLink="openPublicLink()"
    @history="onHistory('History')"
    @send="sendItem()"
    @secrecy="updateSecrecy()"
    @preview="previewItem()"
    @download="downloadItem()"
    @viewDocumentCount="viewDocumentCount()"
  />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { format, LocalStorage } from 'quasar'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
const { capitalize } = format
import { download } from '@/boot/file'
import { documentMenuList } from '@/components/document/file/public-file-menuList.js'
export default {
  name: 'FileMenu',
  props: {
    detailModel: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'document',
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
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
    },
    bgColor: {
      type: String,
      required: false,
      default: 'bg-blue-1'
    },
    anchor: {
      type: String,
      required: false,
      default: 'top left'
    },
    self: {
      type: String,
      required: false,
      default: 'top right'
    },
    excludeButton: {
      type: Array,
      default: () => { return [] },
      required: false,
      description: '排除的按钮'
    }
  },
  data () {
    return {
      showFileMove: false,
      showCopyDialog: false,
      myself: LocalStorage.getItem('myself'),
      isBookmark: false
    }
  },
  mounted () {
    if (!(this.excludeButton.includes('deleteBookmark') ||
    this.excludeButton.includes('deleteBookmark'))) {
      this.isExistBookmark()
    }
    // 1、获取对应的字典类型
    this.loadDictionarys('productCase')
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('file', ['canPreviewExts']),
    dictionarys () {
      return this.dictionary['productCase']
        ? this.dictionary['productCase']['type']
        : []
    },
    menuList () {
      return documentMenuList(this, 'file')
    }
  },
  methods: {
    ...mapActions('bookmark', ['loadBookmark', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    ...mapActions('dictionary', ['loadDictionarys']),
    editItem () {
      let params = { id: +this.detailModel.id }
      if (this.category) {
        Object.assign(params, {
          category: this.category === 'productCase' ? 'select-product-case' : this.category,
          objectID: this.objectID
        })
        this.detailModel.objectID === 0 && (params = _.omit(params, ['objectID']))
      }

      if (this.detailModel.extension === 'markmap') {
        this.$router.push({ name: 'markmapEdit', params })
      } else {
        this.$router.push({ name: `${this.type === 'notice' ? 'notice' : this.detailModel.classify}Edit`, params })
      }
    },
    deleteItem () {
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.$store.dispatch(`${this.type}/delete${capitalize(this.type)}`, this.detailModel.id)
          .then(res => {
            if (this.isBookmark) {
              this.removeBookmark()
            }
          })
      })
    },
    archiveItem () {
      this.$store.dispatch(`${this.type}/archive${capitalize(this.type)}`, this.detailModel.id)
        .then(item => {
          this.$emit('updateModel', item)
        })
    },
    bookmark () {
      const { name, params, path } = this.$route
      let bookmark = new Bookmark({
        module: {
          id: +this.objectID,
          title: '',
          type: this.category
        },
        route: { name, params, path },
        objectID: +this.detailModel.id,
        objectType: this.type,
        objectTitle: this.detailModel.title,
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
    removeBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.detailModel.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.type, Oper: 'eq' }
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
    isExistBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.detailModel.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.type, Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    },
    openPublicLink () {
      let params = { id: this.detailModel.id }
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: this.type,
          param: encodeURIComponent(JSON.stringify(params)),
          title: this.detailModel.title
        }
      })
    },
    moveOrCopyItem (type) {
      let params = { id: +this.detailModel.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: this.objectID })
      }
      this.$router.push({ name: `${this.type === 'notice' ? 'notice' : this.detailModel.classify}${type}`, params })
    },
    onHistory (type) {
      let params = { id: +this.detailModel.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: this.objectID })
      }
      this.$router.push({ name: `${this.type === 'notice' ? 'notice' : this.detailModel.classify}${type}`, params })
    },
    sendItem () {
      let params = { id: +this.detailModel.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: +this.objectID })
      }
      if (this.type === 'document') {
        Object.assign(params, { classify: this.detailModel.classify })
      }
      this.$router.push({ name: `${this.type}Send`, params })
    },
    updateSecrecy () {
      this.detailModel.acl = 2
      this.detailModel.whiteList = [...this.detailModel.whiteList, this.$myinfo.id]
      let createPerson = _.find(this.$store.getters['person/selectPersonsSorted'], p => p.name === this.detailModel.createBy)
      let createByID = createPerson ? createPerson.id : 0
      createByID && this.detailModel.whiteList.push(createByID)
      this.detailModel.whiteList = _.uniq(this.detailModel.whiteList)
      this.$store.dispatch(`document/updateDocument`, this.detailModel)
        .then(res => {
          this.$q.notify({ message: '设置成功！', icon: 'check', color: 'positive' })
        })
    },
    previewItem () {
      previewFile(
        this.detailModel.filePath,
        this.detailModel.title,
        this.detailModel.extension,
        this
      )
    },
    downloadItem () {
      download(this.detailModel.filePath)
    },
    viewDocumentCount () {
      let params = { id: +this.detailModel.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: this.objectID })
      }
      this.$router.push({ name: `${this.type === 'notice' ? 'notice' : this.detailModel.classify}Count`, params })
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu')
    // TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  }
}
</script>

<style scoped>
  .q-item__section--avatar {
    min-width: 30px;
  }
</style>
