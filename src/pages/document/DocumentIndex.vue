<template>
  <q-page>
    <tw-breadcrumbs :style="addWidth"></tw-breadcrumbs>
    <!-- 1、PC端从文档中心、知识库中进入有左侧树结构
    2、从各个资源模块进入文档中心无左侧树结构 -->
    <left-right-card-layout
      v-if="haveLeftTree"
      :showLeft="showLeft"
    >
      <template #left>
        <div class="left-container relative-position">
          <!-- 收缩左侧目录按钮 -->
          <q-btn
            color="grey-2"
            text-color="grey-5"
            size="md"
            icon="chevron_left"
            dense
            padding="none"
            class="absolute-top-right hide-left-btn z-top q-mt-md left-tree-btn"
            style="margin-right: 5px;"
            @click="showLeft=false"
          />
          <!-- 滚动区域 -->
          <q-scroll-area
            :thumb-style="thumbStyle"
            id="scroll-area-with-virtual-scroll-1"
            style="height: 90vh;"
          >
            <!-- 收藏树 -->
            <bookmark-tree
              class="q-pt-sm"
              :type="category||'document'"
              :id="+objectID"
            />
            <!-- 目录树 -->
            <document-tree
              :category="category"
              :objectID="objectID"
              :rootId="rootId"
              :wikiAuth="hasWikiSettingAuth"
              class="q-pt-sm"
            />
            <!-- 废纸篓 -->
            <q-btn
              class="q-pt-sm"
              style="width:100%"
              flat
              align="left"
              :label="$t('document.trash')"
              icon="delete"
              @click.stop="toTrash()"
              :color="$route.path.includes('trash')?'primary':'grey-9'"
            />
            <!-- 管理 -->
            <q-btn
              class="q-pt-sm"
              v-if="hasWikiSettingAuth"
              style="width:100%"
              flat
              align="left"
              :label="$t('document.manage')"
              icon="settings"
              @click.stop="toWikiManage()"
              color="grey-9"
            />
          </q-scroll-area>
        </div>
      </template>
      <template #right>
        <!-- 临时展开左侧目录树 -->
        <q-btn
          v-if="!showLeft"
          color="grey-2"
          text-color="grey-5"
          size="md"
          icon="chevron_right"
          dense
          padding="none"
          class="absolute-top-left z-top q-pa-none q-mt-md left-tree-btn"
          @click="showLeft=true"
        />
        <router-view :style="$q.screen.lt.sm?'':minHeight"></router-view>
      </template>
    </left-right-card-layout>
    <template v-else>
      <router-view></router-view>
    </template>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'DocumentIndex',
  props: {
    category: {
      type: String,
      default: undefined,
      required: false,
      description: '模块类型：project、team、product'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    },
    id: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '文件夹的根级Id'
    }
  },
  data () {
    return {
      rootId: 0,
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#cccccc',
        width: '5px',
        opacity: 0.75
      },
      showLeft: true
    }
  },
  mounted () {
    this.initRootId()
    this.setInitListType()
    if (+this.id) {
      this.loadModel({ id: +this.id, fields: 'DocID,ObjectType,ObjectID' })
        .then(res => {
          res.objectType === 'wiki' && this.inMembers(+res.objectID)
          res.objectType === 'wiki' && this.haveVisitAuth(+res.objectID)
        })
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    ...mapState('breadcrumbs', ['moduleBreadcrumbs', 'widgetBreadcrumbs']),
    ...mapState('document', ['documentList', 'listType']),
    ...mapState('dictionary', ['dictionary']),
    minHeight () {
      if (document.getElementsByTagName('main').length) {
        return { 'min-height': document.getElementsByTagName('main')[0].style['min-height'] }
      } else {
        return { 'min-height': '707px' }
      }
    },
    addWidth () {
      if (this.$q.screen.gt.sm) {
        if (['markmapEdit', 'markmapAdd'].includes(this.$route.name)) {
          return { maxWidth: 'calc(100vw - 96px)' }
        } else {
          if (this.haveLeftTree) {
            return { width: 'calc(100vw - 96px)' }
          } else {
            return {}
          }
        }
      } else {
        return { maxWidth: '100%' }
      }
    },
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    },
    dictionarys () {
      return this.dictionary['productCase']
        ? this.dictionary['productCase']['type']
        : []
    },
    haveLeftTree () {
      // 1、PC端从文档中心、知识库中进入有左侧树结构
      // 2、从各个资源模块进入文档中心无左侧树结构
      return !(this.$q.platform.is.mobile || this.$route.name === 'documentCenter')
    },
    hasWikiSettingAuth () {
      return this.category === 'wiki' && this.$store.getters['wiki/editWikiAuth'](+this.objectID)
    }
  },
  beforeRouteEnter (to, from, next) {
    var myinfo = LocalStorage.getItem('myself')
    if (to.name === 'documentCenter' && myinfo && !(myinfo.auth.role.isSystemAdministrator || myinfo.auth.role.isSeniorManager)) {
      next(vm => {
        if (!vm.category) {
          vm.$router.push({ path: '/' })
        }
      })
    } else {
      next()
    }
  },
  watch: {
    rootId (newVal, old) {
      if (newVal !== old) {
        this.setInitListType()
      }
    },
    resource: {
      handler (newVal, oldVal) {
        if (newVal.category && Number(newVal.objectID) && this.category !== 'wiki') {
          // 系统的文档中心的“文档中心”路由为WidgetBreadcrumbs[0],就不用ModuleBreadcrumb了
          this.setModuleBreadcrumbs()
        } else {
          this.clearModuleBreadcrumbs()
        }
        this.initRootId()
      },
      immediate: true,
      deep: true
    },
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        if (this.$q.platform.is.mobile) return
        let newRoute = newVal
        let rootFolder = {}
        if (this.category && Number(this.objectID) && this.category !== 'wiki') {
          if (this.category === 'product') {
            rootFolder = await this.loadProductDocument({ objectID: +this.objectID })
          } else {
            rootFolder = await this.loadResourceDocument({ objectType: this.category, objectID: +this.objectID })
          }
        } else if (this.category && ['selfService'].includes(this.category)) {
          rootFolder = { id: -99, level: 0 }
        } else {
          rootFolder = _.find(this.documentList, { id: 0 })
        }
        const isDocumentCenter = this.$route.path.split('/')[1] === 'document'
        const id = +this.$route.params.id || rootFolder.id
        let document = null
        if (id === -99) {
          let query = [
            { Key: 'ObjectType', Value: 'selfService', Oper: 'eq' },
            'and',
            { Key: 'Level', Value: 1, Oper: 'eq' },
            'and',
            { Key: 'ObjectID', Value: 0, Oper: 'eq' }]
          document = await this.loadDocumentByQuery(
            {
              frontQuery: (m) => {
                return m.objectType === 'selfService' && m.level === 1 && m.objectID === 0
              },
              endQuery: query
            })
        } else {
          document = await this.loadDocumentWithoutChildren(id)
        }

        // 系统或某资源的文档中心，系统文档中心的根文件夹id=0，资源的文档中心文件夹id通过category,objectID获取
        // 有了文件夹就可以获取文件夹model
        // 根文件夹面包屑：当路由name不是documentCenter/documentIndex时（复制根文件夹，根文件夹草稿箱，根文件夹归档箱）加入根文件夹面包屑（>文档中心）
        // 文件夹的各级父文件夹：当文件夹下添加文档（doc，file，link）时，或当一个文档（folder,doc，file，link）有各级parenrId时，加入各级父文件夹名称直到根文件夹为止
        // 文件夹草稿箱面包屑：当一个文件（doc，file，link）isPublish===0时加入草稿箱面包屑（>草稿箱）
        // 文件夹归档箱面包屑：当一个文件（doc，file，link）archived===1时加入归档箱面包屑（>归档箱）
        // 文档面包屑：当文档edit,copy,move,send,// TODO publicLink,history时，加入文档面包屑

        // 根文件夹面包屑：当路由name不是documentCenter/documentIndex时（复制根文件夹，根文件夹草稿箱，根文件夹归档箱）加入根文件夹面包屑（>文档中心）
        this.clearWidgetBreadcrumbs()
        !['document', 'documentCenter'].includes(newRoute.name) &&
          !['selfService', 'product', 'wiki'].includes(this.category) &&
          !(this.dictionarys && this.dictionarys.length && _.map(this.dictionarys, 'dictValue').includes(document.tag)) &&
          this.pushWidgetBreadcrumb({
            id: rootFolder.id,
            title: this.widgets.document.label,
            to: {
              name: 'document',
              params: isDocumentCenter
                ? undefined
                : { category: this.category, objectID: +this.objectID }
            }
          })
        // : this.clearWidgetBreadcrumbs()
        // 系统文档中心面包屑已由setModuleBreadcrumbs加入
        newRoute.name === 'document' && !this.objectID &&
          this.clearWidgetBreadcrumbs()

        // 文件夹的各级父文件夹：当文件夹下添加文档（doc，file，link）时，
        // 或当一个文档（folder,doc，file，link）有各级parenrId时，加入各级父文件夹名称直到根文件夹为止
        // 产品选型不要各级父文件夹
        if (document && document.id !== 0 && this.category !== 'product') {
          let parentFolders = await this.loadFolders(document.path)
          if (parentFolders && parentFolders.length) {
            parentFolders = _.sortBy(
              _.filter(parentFolders, doc =>
                doc.level > rootFolder.level &&
                doc.level < document.level),
              doc => doc.level)
            let element = _.find(parentFolders, { objectType: 'productCase' })
            if (element) {
              this.clearWidgetBreadcrumbs()
              for (const folder of parentFolders) {
                if (element.id === folder.id) {
                  this.pushWidgetBreadcrumb({
                    id: folder.id,
                    title: folder.title,
                    to: { name: 'productCaseHome' }
                  })
                } else {
                  this.pushWidgetBreadcrumb({
                    id: folder.id,
                    title: folder.title,
                    to: {
                      name: 'productCaseDetail',
                      params: { id: folder.id }
                    }
                  })
                }
              }
            } else {
              for (const folder of parentFolders) {
                if (folder.classify === 'folder') {
                  if (this.category === 'selfService' &&
                    folder.level === 1 &&
                    folder.objectType === 'selfService' &&
                    folder.objectID === 0) {
                    this.pushWidgetBreadcrumb({
                      id: folder.id,
                      title: folder.title,
                      to: {
                        name: 'serviceHome'
                      }
                    })
                  } else {
                    let name = 'folder'
                    let params = isDocumentCenter
                      ? { id: folder.id }
                      : { category: this.category, objectID: +this.objectID, id: folder.id }
                    if ((folder.objectType === 'wiki' && folder.parentId === 0 && folder.level === 1) && this.category) {
                      name = 'wikiHome'
                      params = {}
                    }
                    this.pushWidgetBreadcrumb({
                      id: folder.id,
                      title: folder.title,
                      to: {
                        name,
                        params
                      }
                    })
                  }
                }
              }
            }
          }
        }
        if (!document.classify) {
          return
        }
        if (document.classify === 'folder') {
          if (['docAdd', 'fileUpload', 'linkAdd', 'markmapAdd'].includes(newRoute.name)) {
            if (this.category === 'selfService' &&
              document.level === 1 &&
              document.objectType === 'selfService' &&
              document.objectID === 0) {
              this.pushWidgetBreadcrumb({
                id: document.id,
                title: document.title,
                to: {
                  name: 'serviceHome'
                }
              })
            } else {
              let params = isDocumentCenter
                ? { id: document.id }
                : { category: this.category, objectID: +this.objectID, id: document.id }

              this.pushWidgetBreadcrumb({
                id: document.id,
                title: document.title,
                to: {
                  name: document.objectType === 'productCase' ? 'productCaseDetail' : 'folder',
                  params
                }
              })
            }
          } else {
            this.deleteWidgetBreadcrumb(document.id)
          }
        }
        // 文件夹草稿箱面包屑：当一个文件（doc，file，link）!isPublish时加入草稿箱面包屑（>草稿箱）
        if (document.classify !== 'folder' && !document.isPublish) {
          let params = isDocumentCenter
            ? { id: document.parentId }
            : { category: this.category, objectID: +this.objectID, id: document.parentId }

          this.pushWidgetBreadcrumb({
            id: 'draftDocuments',
            title: '草稿箱',
            to: {
              name: 'draftDocuments',
              params
            }
          })
        } else {
          this.deleteWidgetBreadcrumb('draftDocuments')
        }

        // 文件夹归档箱面包屑：当一个文件（doc，file，link）!archived时加入归档箱面包屑（>归档箱）
        if (document.classify !== 'folder' && document.archived) {
          let params = isDocumentCenter
            ? { id: document.parentId }
            : { category: this.category, objectID: +this.objectID, id: document.parentId }
          this.pushWidgetBreadcrumb({
            id: 'archivedDocuments',
            title: '归档箱',
            to: {
              name: 'archivedDocuments',
              params
            }
          })
        } else {
          this.deleteWidgetBreadcrumb('archivedDocuments')
        }
        // 文档面包屑：当文档edit,copy,move,send,// TODO publicLink,history时，加入文档面包屑
        const name = _.last(newRoute.path.split('/'))
        if (document.classify !== 'folder' && ['edit', 'copy', 'move', 'send', 'history', 'versions', 'record'].includes(name)) {
          let params = { id: document.id }
          if (this.category) {
            Object.assign(params, { category: this.category, objectID: +this.objectID })
          }
          +this.objectID === 0 && (params = _.omit(params, ['objectID']))
          this.pushWidgetBreadcrumb({
            id: document.id,
            title: document.title,
            to: {
              name: `${document.classify}Detail`,
              params
            }
          })
        } else if (document.classify !== 'folder') {
          this.deleteWidgetBreadcrumb(document.id)
        }
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    DocumentTree: () => import('components/document/DocumentTree'),
    BookmarkTree: () => import('components/document/BookmarkTree'),
    LeftRightCardLayout: () => import('layouts/LeftRightCardLayout')
  },
  methods: {
    ...mapActions('document', ['loadModel', 'loadFolders', 'loadResourceDocument', 'loadProductDocument', 'loadDocumentWithoutChildren', 'loadDocumentByQuery', 'loadFileByObjectTypeAndObjectId']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapActions('wiki', ['inMembers', 'haveVisitAuth']),
    ...mapMutations('document', ['setListType']),
    ...mapMutations('breadcrumbs', [
      'clearModuleBreadcrumbs',
      'pushWidgetBreadcrumb',
      'clearWidgetBreadcrumbs',
      'deleteWidgetBreadcrumb'
    ]),
    setInitListType () {
      this.setListType('card')
    },
    initRootId () {
      if (['wiki', 'select-product-case'].includes(this.category)) {
        this.loadModel({ id: +this.id, fields: 'DocID,Path' })
          .then(res => {
            this.rootId = +res.path.split(',')[1]
          })
      } if (this.category && +this.objectID) {
        this.loadFileByObjectTypeAndObjectId({ objectType: this.category, objectID: +this.objectID })
          .then(res => {
            this.rootId = +res.id
          })
      } else {
        this.rootId = 0
      }
    },
    toWikiManage () {
      this.$router.push({
        name: 'wikiManage',
        params: { id: +this.objectID }
      })
    },
    toTrash () {
      this.$router.push({
        name: 'documentTrash',
        params: { 
          category: this.category,
          objectID: +this.objectID,
          id: +this.rootId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  :deep(.q-tree__node-header) {
    min-height: 2.572em;
  }
  .hide-left-btn {
    display: none;
  }
  .left-container:hover .hide-left-btn {
    display: block;
  }
  .left-tree-btn {
    width: 18px;
  }
</style>
