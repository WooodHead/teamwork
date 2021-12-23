<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card
      :title="$t('notice.title')"
      :actions="actions"
    >
      <template v-slot:add>
        <q-btn
          unelevated
          icon="add"
          :label="$t('action.add')"
          class="cursor-pointer"
          color="positive"
          text-color="white"
          rounded
        >
          <q-menu auto-close>
            <q-list>
              <q-item
                v-for="item in addList"
                :key="item.key"
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
            </q-list>
          </q-menu>
        </q-btn>
      </template>
      <template v-slot:right>
        <!-- 公告类别筛选 -->
        <tw-select-edit
          withIcon
          addAllOption
          rounded
          outlined
          dense
          module="notice"
          field="NoticeType"
          :editable="!!$myinfo.auth.role.isSystemAdministrator"
          @input="filterByNoticeType"
          :value="type"
          class="emoji-font"
        />
      </template>
    </tw-header-card>
    <q-card-section class="q-px-xxl full-width column items-center">
      <!-- 草稿提示 -->
      <div
        class="row justify-center"
        v-if="draftCount>0"
      >
        <q-btn
          flat
          :label="$t('notice.draftCountNotes',{number:draftCount})"
          color="primary"
          icon="insert_drive_file"
          @click="switchDraftNotices"
        />
      </div>
      <!-- 公告列表 -->
      <notice-list
        v-if="notices.length"
        :notices="notices"
      ></notice-list>
      <div
        v-else
        style="width:300px"
        class="text-h6 text-grey-5 q-mx-auto q-mt-md"
      >
        {{$t("notice.noNoticeTips_1")}}
        <ul class="text-subtitle1">
          <li>{{$t("notice.noNoticeTips_2")}}</li>
          <li>{{$t("notice.noNoticeTips_3")}}</li>
          <li>{{$t("notice.noNoticeTips_4")}}</li>
          <li>{{$t("notice.noNoticeTips_5")}}</li>
        </ul>
      </div>
      <!-- 归档提示 -->
      <tw-archived-count
        v-if="archiveCount"
        :label="$t('archive.someArchived',{count:archiveCount,something:$t('notice.title')})"
        @click="switchArchiveNotices"
      ></tw-archived-count>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'NoticeIndex',
  props: {
    category: {
      type: String,
      default: undefined,
      required: false
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      addList: [
        {
          key: 'add',
          icon: 'note_add',
          label: this.$t('notice.addDoc'),
          click: () => { this.addNotice() }
        },
        {
          key: 'upload',
          icon: 'file_upload',
          label: this.$t('notice.uploadNotice'),
          click: () => { this.addNotice('noticeUpload') }
        }
      ],
      actions: ['add', 'other']
    }
  },
  computed: {
    ...mapState('notice', ['search', 'type', 'draftCount', 'archiveCount']),
    ...mapGetters('notice', ['queryOfType', 'queryOfSearch']),
    notices () {
      return this.$store.getters['notice/notices']({ objectType: this.category, objectID: this.objectID })
    },
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' },
        'and',
        { Key: 'IsPublish', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ]
      queryCondition.push(...this.queryOfType)
      queryCondition.push(...this.queryOfSearch)
      return queryCondition
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('notice', ['loadNotices', 'loadDraftCount', 'loadArchivedCount']),
    ...mapMutations('notice', ['setSearch', 'setType']),
    /** 切换草稿列表 */
    switchDraftNotices () {
      this.$router.push({
        name: 'noticeDrafts',
        params: { category: this.category, objectID: this.objectID }
      })
    },
    /** 切换归档列表 */
    switchArchiveNotices () {
      this.$router.push({
        name: 'archivedNotices',
        params: { category: this.category, objectID: this.objectID }
      })
    },
    /** 类别筛选 */
    filterByNoticeType (noticeTypeDict) {
      this.setType(
        noticeTypeDict.dictValue === '所有'
          ? ''
          : `${noticeTypeDict.icon}${noticeTypeDict.dictValue}`
      )
    },
    /** 模糊筛选 */
    // filterBySearch (value) {
    //   this.setSearch(value)
    //   this.resetList()
    // },
    addNotice (name) {
      // 新建页面路由跳转
      this.$router.push({
        name: name || 'noticeAdd',
        params: {
          openType: 'add',
          category: this.category,
          objectID: this.objectID
        }
      })
    },
    // 初始化
    init () {
      // 设置列表类别（草稿、归档、发布）
      this.setSearch('')
      this.setType('')
      // 列表重置
      this.resetList()
    },
    /** 重置公告列表 */
    resetList () {
      this.loadNotices({ query: this.queryCondition })
      // 获取草稿数量
      this.loadDraftCount({ objectType: this.category, objectID: +this.objectID })
      // 获取归档数量
      this.loadArchivedCount({ objectType: this.category, objectID: +this.objectID })
    }
  },
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    NoticeList: () => import('components/notice/NoticeList'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwArchivedCount: () => import('components/base/TwArchivedCount')
  }
}
</script>

<style lang="scss" scoped>
</style>
