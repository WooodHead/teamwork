<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page document-file-detail-img"
    :style="haveLeftTree?'width: 100% !important;':''"
  >
    <!-- 菜单区 -->
    <tw-header-detail :noMenu="noMenu">
      <template #menu>
        <file-menu
          :detailModel="cardItem"
          :type="type"
          :category="category"
          :objectID="objectID"
          @updateModel="updateModel"
        ></file-menu>
      </template>
      <template v-slot:titleAppend>
        <q-btn-dropdown
          menu-self="top middle"
          flat
          dense
          :label="cardItemParent?cardItemParent.title:''"
          class="ellipsis document-btn-dropdown"
        >
          <template v-if="cardItemParent.objectType==='productCase'">
            <q-list
              v-for="(dictionary) in dictionarys"
              :key="dictionary.id"
            >
              <q-item class="row items-center">
                <q-item-label header>
                  {{dictionary.dictValue }}
                </q-item-label>
                <q-separator class="fade-line" />
              </q-item>

              <q-item
                v-for="item in _filter(cardItemParent.children, { 'tag':dictionary.dictValue })"
                :key="item.id"
                clickable
                v-close-popup
                @click="onItemClick(item)"
              >
                <q-item-section>
                  <q-item-label>{{item.title}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
          <q-list
            v-else
            dense
            class="q-pa-md q-pl-none"
          >
            <template v-for="(item,index) in cardItemParent.children">
              <q-item
                :key="item.id"
                clickable
                v-close-popup
                @click="onItemClick(item)"
              >
                <q-item-section avatar>
                  <q-icon
                    :style="item.classify==='folder'?'color:#ffc107':'color:#bbc4ca'"
                    :name="item.classify==='folder'?'app:tw-icon-folder':'app:tw-icon-file'"
                  >
                  </q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{item.title}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator
                :key="`${item.id}-${index}`"
                spaced
                inset="item"
              />
            </template>
            <!-- <q-item
              v-for="item in cardItemParent.children"
              :key="item.id"
              clickable
              v-close-popup
              @click="onItemClick(item)"
            >
              <q-item-section>
                <q-item-label>{{item.title}}</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
        </q-btn-dropdown>
      </template>
    </tw-header-detail>
    <div class="q-px-xxl">
      <!-- 归档文件说明区 -->
      <q-card-section
        v-if="haveParentArchive"
        :class="{'q-pt-none':$q.platform.is.desktop}"
      >
        <tw-archive-part-notes
          :category="category"
          :objectID="+objectID"
          :parentID="cardItem.parentId"
          :parentLabel="$t('document.folder')"
          type="document"
        />
      </q-card-section>
      <q-card-section
        v-if="!haveParentArchive&&cardItem.archived"
        :class="{'q-pt-none':$q.platform.is.desktop}"
      >
        <tw-archive-notes
          :id="cardItem.id"
          :type="type"
          :label="$t('document.title')"
          :archiveTime="cardItem.archiveTime"
          :archiveBy="cardItem.archiveBy"
        />
      </q-card-section>
      <!-- 草稿区 -->
      <div
        v-if="cardItem&& cardItem.isPublish===0"
        class="q-pb-lg"
      >
        <edit-draft
          v-if="editDraft&&!saveDraft"
          :model="cardItem"
          :type="type"
          @shareDraft="editDraft=false"
          @saveDraft="showSaveDraft"
        ></edit-draft>
        <share-draft
          v-if="!editDraft&&!saveDraft"
          @close="editDraft=true"
        ></share-draft>
        <save-draft
          v-if="!editDraft&&saveDraft"
          :model="cardItem"
          :type="type"
          @close="closeShareDraft"
        ></save-draft>
      </div>

      <!-- 内容区-->
      <slot name="content">
        <q-card-section class="q-pt-none q-gutter-y-sm">
          <div
            class="column q-gutter-y-sm text-center "
            :style="$q.platform.is.desktop&&'margin-top:-40px;'"
          >
            <div
              style="font-size:12px;"
              :class="{'emoji-font':$q.platform.is.win}"
            >{{cardItem.noticeType}}
            </div>
            <div class="text-h5">
              <span class="text-weight-bold">{{cardItem.title}}</span>
            </div>
            <div
              class="text-caption text-grey-9 "
              v-if="cardItem&& cardItem.isPublish===1"
            >{{$t('document.modify.postedBy',{modifyBy:cardItem.modifyBy})}}
              <q-badge
                v-if="cardItem.onlyICanEdit && cardItem.authorID === $myinfo.id"
                color="grey-7"
                outline
                :label="$t('document.meEdit')"
              /> •
              {{timeAgo({ dateTime :cardItem.modifyTime})}}
            </div>
          </div>
          <!-- markmap 文档内容区域 -->
          <mind-map
            v-if="cardItem.extension==='markmap'"
            :code="cardItem.content"
            :title="cardItem.title"
          />
          <!-- 常规 文档内容区域 -->
          <div
            class="editor__content tiptap"
            v-else
            v-html="cardItem.content"
          >
          </div>
        </q-card-section>
      </slot>

      <q-card-section v-if="cardItem&& cardItem.isPublish===1">
        <tw-boost-pack
          :boostTo="cardItem.modifyBy"
          :objectID="+id"
          :objectType="type"
          :messageTitle="cardItem.title||''"
        />
      </q-card-section>
      <!-- 文档保密区 -->
      <q-card-section v-if="!!cardItem.acl">
        <tw-secrecy-area
          :currentModel="cardItem"
          :parentModel="cardItemParent"
        />
      </q-card-section>

      <q-card-section v-if="cardItem&& cardItem.isPublish===1">
        <discuss-board
          :objectType="type"
          :objectID="+id"
          :objectTitle="cardItem.title||''"
          @submitFinished="submitFinished"
        />
      </q-card-section>

      <!-- 订阅 -->
      <q-card-section v-if="!categoryModel.isTemplate&&cardItem&& cardItem.isPublish===1">
        <tw-subscribe
          :objectType="type"
          :objectID="+id"
          :quickSelected="quickSelected"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { format, date } from 'quasar'
const { capitalize } = format
import { mapState, mapActions } from 'vuex'
import timeAgo from '@/utils/time-ago'
import getCategory from '@/mixins/mixins-get-category'
const { formatDate } = date
export default {
  name: 'DocumentDetail',
  mixins: [getCategory],
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    type: {
      type: String,
      default: 'document' // document.notice
    },
    code: {
      type: String,
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
    }
  },
  data () {
    return {
      quickSelected: null,
      haveParentArchive: false,
      editDraft: true,
      saveDraft: false
    }
  },
  mounted () {
    this.init()
    this.$route.meta.label = this.cardItem.title
    document.title = `${this.cardItem.title} | TeamWork`
    // 1、获取对应的字典类型
    this.loadDictionarys('productCase')
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
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
    elementStyle () {
      return ['q-mt-md', { 'col pageDetailWidth': this.$q.screen.gt.sm }]
    },
    cardItem () {
      return this.$store.getters[`${this.type}/currentModel`](+this.id)
    },
    cardItemParent () {
      return this.cardItem ? _.find(this.$store.state.document.documentList, d => d.id === this.cardItem.parentId) : {}
    },
    noMenu () {
      let nM = false
      // 只有知识空间成员有编辑权限
      if (this.category === 'wiki' && !this.$store.getters['wiki/editWikiAuth'](+this.objectID)) {
        nM = true
      }
      return nM
    }
  },
  watch: {
    id: function (newVal, oldVal) {
      this.init()
    },
    cardItem: {
      deep: true,
      handler (newVal, oldVal) {
        this.$route.meta.label = newVal.title
        document.title = `${newVal.title} | TeamWork`
      }
    }
  },
  methods: {
    _filter: _.filter,
    timeAgo,
    formatDate,
    ...mapActions('member', ['loadMembers']),
    ...mapActions('document', ['isHaveParentArchive']),
    ...mapActions('dictionary', ['loadDictionarys']),
    init () {
      this.$store.dispatch(`${this.type}/load${capitalize(this.type)}`, +this.id)
        .then(res => {
          res.parentId && this.$store.dispatch(`${this.type}/load${capitalize(this.type)}`, +res.parentId)
        })

      if (this.type === 'document') {
        this.isHaveParentArchive(+this.id).then(res => {
          this.haveParentArchive = res
        })
      }

      // 获取资源类型指定的人员(用于订阅组件快捷选中人员)
      this.category && this.objectID && this.loadMembers({ category: this.category, objectID: +this.objectID }).then(ids => {
        if (ids.length) {
          this.quickSelected = {
            title: this.$t(`${this.category}.title`) + '成员',
            personIDs: ids
          }
        }
      })
      recodeVisitMark(this.type, +this.id)
    },
    /***
     *通知调用者，提交处理完毕
     */
    submitFinished (val) {
      this.$emit('submitFinished', val)
    },
    updateModel (item) {
      if (this.type === 'document') {
        this.cardItem = item
      }
    },
    closeShareDraft () {
      this.editDraft = true
      this.saveDraft = false
    },
    showSaveDraft () {
      this.editDraft = false
      this.saveDraft = true
    },
    updateMembers (ids) {
      this.cardItem.whiteList = ids
      this.$store.dispatch(`document/updateDocument`, this.cardItem)
        .then(res => {
          this.$q.notify({ message: '设置成功！', icon: 'check', color: 'positive' })
        })
    },
    cancelSecrecy () {
      if (this.cardItemParent.acl === 2) {
        this.$q.notify({ message: '无法解除保密，请先设置父级文件夹为公开状态！', icon: 'check', color: 'purple' })
        return
      }
      this.$q.dialog({
        title: '温馨提示',
        message: '确定要公开该文档？',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.cardItem.acl = 0
        this.$store.dispatch(`document/updateDocument`, this.cardItem)
          .then(res => {
            this.$q.notify({ message: '解除成功！', icon: 'check', color: 'positive' })
          })
      }).onCancel(() => { })
    },
    onItemClick (e) {
      this.$router.push({
        name: 'fileDetail',
        params: {
          category: this.category,
          objectID: this.objectID,
          id: e.id
        }
      })
    }
  },
  components: {
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    FileMenu: () => import('components/document/file/FileMenu'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwArchivePartNotes: () => import('components/base/TwArchivePartNotes'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwSubscribe: () => import('components/base/TwSubscribe'),
    EditDraft: () => import('components/draft/EditDraft'),
    ShareDraft: () => import('components/draft/ShareDraft'),
    SaveDraft: () => import('components/draft/SaveDraft'),
    MindMap: () => import('components/document/markmap/MindMap'),
    TwSecrecyArea: () => import('components/base/TwSecrecyArea'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  }
}
</script>

<style lang="scss" scoped>
  .card-grow-in-page img {
    max-width: 100% !important;
  }

  .tiptap-content {
    word-break: break-all;
  }
  /deep/svg[id^="markmap"] {
    min-height: 500px;
  }
  .document-file-detail-img img {
    max-width: 100%;
  }
  /deep/ .document-btn-dropdown .q-btn__content span:first-child {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
