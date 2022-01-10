<template>
  <q-card
    class="card-grow-in-page"
    :style="{ 'position:relative': !$q.screen.lt.sm }"
    :flat="$q.screen.lt.sm"
    :class="{
      'card-is-template': model.isTemplate,
      'q-ma-none': $q.platform.is.mobile,
    }"
  >
    <tw-header-detail
      :title="titleVisible ? '' : model.title"
      :noMenu="!showMenu || model.archived"
    >
      <template #menu>
        <slot name="menu">
          <tw-menu
            v-if="showMenu && !model.archived"
            :menus="menus"
            @edit="editItem()"
            @setWidgets="setWidgets()"
            @delete="deleteItem()"
            @archive="archive()"
            @publicLink="openPublicLink()"
            @bookmark="bookmark()"
            @deleteBookmark="removeBookmark()"
            @start="approvalItem('Start')"
            @done="approvalItem('Done')"
            @suspended="approvalItem('Suspended')"
            @activate="approvalItem('Activate')"
            @trash="toTrash()"
          />
        </slot>
      </template>
    </tw-header-detail>

    <!-- 归档说明区 -->
    <q-card-section v-if="model.archived" class="q-px-xxl">
      <tw-archive-notes
        :id="model.id"
        :type="category"
        :label="$t(`${category}.title`)"
        :archiveTime="model.archiveTime"
        :archiveBy="model.archiveBy"
      />
    </q-card-section>

    <q-card-section class="text-center q-px-xxl q-gutter-y-xs">
      <!-- 标题的上面 -->
      <div>
        <slot name="aboveTitle"></slot>
      </div>
      <!-- 标题 -->
      <div v-intersection="onIntersection"></div>
      <div class="text-title" style="word-wrap: break-word">
        <!-- <slot name="titleLeftBadge"></slot> -->
        {{ model.title }}
        <slot name="titleBadge"></slot>
      </div>
      <div class="text-subtitle1" style="word-wrap: break-word">
        <slot name="subtitle"></slot>
      </div>
      <!-- 描述 -->
      <!-- 请注意：notes建议使用<q-input/>，可参考项目描述，存入数据时使用trim();-->
      <div
        v-if="category !== 'organize'"
        class="text-subtitle1"
        style="word-wrap: break-word; white-space: normal"
        v-html="htmlToText(model.notes)"
      ></div>
      <!-- 团队成员 -->
      <resource-team-view
        v-if="model && !model.isTemplate && model.members"
        :category="category"
        :objectID="Number(objectID)"
        :members.sync="members"
        @updateMembers="updateMembers"
        :showPanel="showPanel"
        :showButton="showButton"
      />
    </q-card-section>
    <slot name="prepend" />
    <!-- 卡片列表 -->
    <q-card-section class="q-py-none">
      <widget-kit
        :category="category"
        :objectID="objectID"
        :model="model"
        class="row q-gutter-md"
        :class="widgetJustify"
      />
    </q-card-section>
    <slot name="append" />
    <!-- 动态信息 -->
    <q-card-section class="q-px-xxl">
      <tw-activity :category="category" :objectID="+objectID" />
    </q-card-section>

    <!-- 底部logo -->
    <q-separator inset />
    <q-card-section class="text-center">
      <q-icon
        :name="`img:${$logo['favicon-96x96.png']}`"
        size="80px"
        class="cursor-pointer"
        @click="$router.push('/')"
      />
      <div class="text-bold q-pt-sm">
        {{ $t('widget.welcomeTo') }} {{ model.title }}!
      </div>
      <div class="text-grey-7" v-if="model.acl">
        {{ $t('widget.this') }}{{ $t(`${category}.title`)
        }}{{ model.isTemplate ? $t('template.template') : ''
        }}{{
          model.isTemplate && model.acl === 2
            ? $t('auth.acl.templateSecret')
            : acl[model.acl]
        }}
      </div>
      <!-- 团队成员 -->
      <resource-team-view
        v-if="model.isTemplate && model.acl === 2"
        :category="category"
        :objectID="Number(objectID)"
        :members.sync="model.whiteList"
        :showButton="false"
      />
      <div class="text-grey-7">
        <slot name="logo"></slot>
        <div v-if="!['organize', 'wiki'].includes(category)">
          {{ $t('base.resourceOrganize') }}：{{ organize.name }}
        </div>
        <slot name="orgBottom"></slot>
        {{ model.createBy }}
        {{ $t('widget.create') }}
        {{
          model.createTime &&
          formatDate(model.createTime.replace(/-/g, '/'), 'YYYY-MM-DD HH:mm')
        }}
      </div>
    </q-card-section>
    <!-- 创建项目引导步骤 -->
    <q-dialog
      v-model="seamless"
      seamless
      :position="$q.screen.gt.xs ? 'left' : 'bottom'"
    >
      <guide-helper
        :model="guideModule"
        :categoryModel="model"
        :category="category"
        :objectID="objectID"
        @hiddenHelper="seamless = false"
      ></guide-helper>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { format, date, LocalStorage } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import htmlToText from '@/utils/html-to-text'
import promptDelete from '@/utils/prompt-delete'
import Bookmark from '@/store/bookmark/model'
const { capitalize } = format
const { formatDate } = date
export default {
  name: 'ResourceLayout',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: [String, Number],
      required: true
    },
    categoryModel: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    showMenu: {
      type: Boolean,
      default: true
    },
    widgetJustify: {
      type: String,
      required: false,
      default: 'justify-center',
      notes: '工具卡片的排布方样式'
    }
  },
  components: {
    ResourceTeamView: () => import('components/resource/ResourceTeamView'),
    WidgetKit: () => import('components/widget/WidgetKit'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    TwMenu: () => import('components/base/TwMenu'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwActivity: () => import('components/activity/TwActivity'),
    GuideHelper: () => import('components/guide/GuideHelper')
  },
  data () {
    return {
      titleVisible: false,
      scopePersonIds: null,
      acl: {
        0: this.$t('auth.acl.public'),
        1: this.$t('auth.acl.restrict'),
        2: this.$t('auth.acl.secret', { category: this.$t(`${this.category}.title`) })
      },
      myself: LocalStorage.getItem('myself'),
      isBookmark: false,
      seamless: false
    }
  },
  created () {
    if (Object.keys(this.categoryModel).length === 0) {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, this.objectID)
    }
  },
  mounted () {
    this.isExistBookmark()
    this.$route.meta.label = this.model.title
    document.title = `${this.model.title} | TeamWork`
    this.showGuideHelper()
  },
  computed: {
    ...mapGetters('member', ['membersFilterInService']),
    ...mapState('guide', ['guideModule']),
    model () {
      if (Object.keys(this.categoryModel).length > 0) {
        return this.categoryModel
      } else {
        return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
      }
    },
    menus () {
      const getMenus = this.$store.getters[`${this.category}/menus`] || this.defaultMenus
      return getMenus(this.isBookmark, this.model.status)
    },
    organize () {
      return this.$store.state.organize.selectOrganizes[this.model.organizeID] || {}
    },
    members () {
      if (['project', 'team', 'productDev', 'customer'].includes(this.category) && Object.keys(this.model).length) {
        return this.membersFilterInService(this.model.members)
      } else {
        return this.model.members
      }
    },
    showPanel () {
      if (['project', 'team', 'productDev', 'service', 'customer', 'opportunity', 'order', 'wiki'].includes(this.category)) {
        // 如果资源是项目，则点击添加/移除人员打开人员职位页面
        return 'memberIdentify'
      } else {
        // 其他的则默认打开用户选择面板界面
        return 'personSelect'
      }
    },
    showButton () {
      return !['organize', 'recruitPlan', 'manufacturer'].includes(this.category)
    }
  },
  watch: {
    showPersonSelect (newVal, oldVal) {
      if (newVal) { this.scopePersonIds = _.map(this.$store.getters['person/selectPersonsOfRoleCode']('ServiceConnector'), 'id') }
    },
    'model': {
      deep: true,
      handler (newVal, oldVal) {
        if (Object.keys(newVal).length > 0) {
          this.$route.meta.label = newVal.title
          document.title = `${newVal.title} | TeamWork`
        }
      }
    }
  },
  methods: {
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    ...mapActions('guide', ['loadGuide']),
    htmlToText,
    formatDate,
    onIntersection (entry) {
      this.titleVisible = entry.isIntersecting
    },
    defaultMenus (isBookmark) {
      let menus = ['edit', 'setWidgets', 'delete', 'trash']
      if (!['customer'].includes(this.category)) menus.push('archive')
      menus.push(isBookmark ? 'deleteBookmark' : 'bookmark')
      return menus
    },
    editItem () {
      this.$router.push({
        name: this.model.isTemplate ? `${this.category}TemplateEdit` : `${this.category}Edit`,
        params: { id: Number(this.objectID), openType: 'edit', category: this.category }
      })
    },
    approvalItem (approvalType) {
      this.$router.push({
        name: `${this.category}${approvalType}`,
        params: { id: Number(this.objectID) }
      })
    },
    setWidgets () {
      this.$router.push({
        name: 'widgetSetting',
        params: { objectID: Number(this.objectID), category: this.category }
      })
    },
    deleteItem () {
      let that = this
      if (this.model.status) {
        // 凡是有进度状态的，都不能轻易删除，删除时要填写删除原因
        promptDelete.call(this, { category: this.category, id: this.objectID })
      } else {
        showConfirm(this.$t('action.reallyDelete'), () => {
          that.$store.dispatch(`${that.category}/delete${capitalize(that.category)}`, that.objectID)
            .then(res => {
              if (this.isBookmark) {
                this.removeBookmark()
              }
            })
        }, () => { })
      }
    },
    archive () {
      this.$store.dispatch(`${this.category}/archive${capitalize(this.category)}`, +this.objectID)
    },
    toTrash () {
      this.$router.push({ name: 'trash', params: { category: this.category, objectID: this.objectID } })
    },
    bookmark () {
      const { name, params, path } = this.$route
      // 设置一级元素分类
      let currentObjectType = this.$t(`${this.category}.module`)
      let bookmark = new Bookmark({
        module: {
          id: 0,
          title: currentObjectType,
          type: this.category
        },
        route: { name, params, path },
        objectID: +this.objectID,
        objectType: this.category,
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
    removeBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' }
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
        { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    },
    updateMembers (arrayPersonIDs, identify) {
      this.$store.dispatch(`${this.category}/update${capitalize(this.category)}Members`, { id: +this.objectID, newMemberIds: arrayPersonIDs, oldMemberIds: this.members, identify: identify })
    },
    // 是否显示创建项目引导步骤
    showGuideHelper () {
      if (this.category === 'team' || this.category === 'project' || this.category === 'organize') {
        let query = [
          { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
          'and',
          { Key: 'ObjectType', Value: this.category, Oper: 'eq' }
        ]
        this.loadGuide(query).then(res => {
          if (this.guideModule.objectType === this.category &&
            this.guideModule.objectID === this.objectID &&
            this.guideModule.owner === this.myself.id &&
            this.guideModule.needed === 1) {
            this.seamless = true
          } else {
            this.seamless = false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-is-template {
  background: #ecf9fd url(/icons/grid-background.png) -5px -22px;
}
</style>
