<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card
      title="归档的公告"
      :actions="actions"
    >
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
        />
      </template>
    </tw-header-card>
    <q-card-section class="q-px-xxl full-width column items-center">
      <!-- 公告列表 -->
      <notice-list
        v-if="notices.length"
        :notices="notices"
      ></notice-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ArchivedNotices',
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
      actions: ['other']
    }
  },
  computed: {
    ...mapState('notice', ['search', 'type']),
    ...mapGetters('notice', ['queryOfType', 'queryOfSearch']),
    notices () {
      return this.$store.getters['notice/archivedNotices']({ objectType: this.category, objectID: this.objectID })
    },
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 1, Oper: 'eq' }
      ]
      queryCondition.push(...this.queryOfType)
      queryCondition.push(...this.queryOfSearch)
      return queryCondition
    }
  },
  mounted () {
    this.loadNotices({ query: this.queryCondition, orderby: 'ArchiveTime DESC' })
  },
  methods: {
    ...mapActions('notice', ['loadNotices']),
    ...mapMutations('notice', ['setSearch', 'setType']),
    /** 类别筛选 */
    filterByNoticeType (noticeTypeDict) {
      this.setType(
        noticeTypeDict.dictValue === '所有'
          ? ''
          : `${noticeTypeDict.icon}${noticeTypeDict.dictValue}`
      )
      this.loadNotices({ query: this.queryCondition })
    }
    /** 模糊筛选 */
    // filterBySearch (value) {
    //   this.setSearch(value)
    //   this.resetList()
    // },
    // 初始化
  },
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    NoticeList: () => import('components/notice/NoticeList'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
</style>
