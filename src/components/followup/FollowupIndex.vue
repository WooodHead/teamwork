
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <!-- 卡片头部 -->
    <tw-header-card
      :title="$t(`followup.title`)"
      :actions="actions"
      :add="{label:$t(`followup.addLabel`),click:()=>addFollowup()}"
    >
      <template v-slot:titleAppend>
        <!-- 跟进数量 -->
        <span>({{followupCount()}})</span>
      </template>
    </tw-header-card>
    <q-card-section class="q-px-xxl q-pt-none">
      <div
        v-if="filterType!==''||search!==''"
        class="q-mt-xs q-ml-md"
      >
        <div
          class=" cursor-pointer"
          href="javascript:void(0);"
          @click="clearFilter"
        >
          <q-chip
            dense
            icon="close"
          >清空所有筛选条件</q-chip>
        </div>
      </div>
    </q-card-section>
    <q-card-section
      class="tw-resume-header bg-white"
      :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'"
    >
      <!-- 搜索组件 -->
      <tw-search-panel
        :search.sync="search"
        :showPanelBtn="false"
      />
    </q-card-section>
    <!-- 跟进记录 -->
    <q-card-section class="q-px-xxl q-pt-none">
      <followup-list
        :category="category"
        :objectID="+objectID"
      />
    </q-card-section>
  </q-card>

</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { LocalStorage, date, Platform } from 'quasar'
const { formatDate } = date
export default {
  name: 'FollowupIndex',
  props: {
    // 资源类型
    category: {
      type: String,
      required: false,
      default: 'customer'
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      required: false,
      default: () => {
        return LocalStorage.getItem('myself').id
      }
    }
  },
  components: {
    // 'tw-menu': ()=> import('components/base/TwMenu'),
    'tw-header-card': () => import('components/base/TwHeaderCard'),
    FollowupList: () => import('components/followup/FollowupList'),
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  },
  data () {
    return {
      actions: ['add', 'menu'],
      sortOptions: [{
        value: 'card',
        label: this.$t(`task.view.card`)
      }, {
        value: 'list',
        label: this.$t(`task.view.list`)
      }],
      id: 0, // 新建和编辑清单Form时使用
      myself: LocalStorage.getItem('myself')
    }
  },
  methods: {
    formatDate,
    ...mapMutations('followup', ['setAddingEvent', 'setView', 'setFilterType', 'cleanCtrlList']),
    ...mapActions('followup', ['loadFollowups']),
    // 切换卡片和列表
    sortUpdate (value) {
      this.setView(value)
    },
    addFollowup () {
      this.$router.push({
        name: 'followupAdd',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: 0
        }
      })
    },
    // 编辑确认按钮
    onOk () {
      this.setAddingEvent(false)
    },
    // 编辑取消按钮
    onCancel () {
      this.setAddingEvent(false)
    },
    clearFilter () {
      this.setFilterType('')
    },
    exportPdf () {
      // 判断如果是微信浏览器，则暂不支持下载导出，需要使用浏览器下载
      if (Platform.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
        showWarningMessage(this.$t('exportFile.weChatDoesNotCurrentlySupportExports'))
        return false
      }
      this.exportPDF = true
    },
    followupCount () {
      return this.$store.state.followup.followups.filter(item => !item.deleted).length || 0
    }
  },
  computed: {
    ...mapState('followup', ['search', 'view', 'followups']),
    ...mapGetters('followup', ['followups']),
    menuLists () {
      return [{ group: ['exportPDF', 'exportExcel'] }]
    },
    // 搜索框搜索条件
    search: {
      get () {
        return this.$store.getters['followup/search']
      },
      set (val) {
        val
          ? this.$store.commit('followup/setSearch', val)
          : this.$store.commit('followup/setSearch', '')
      }
    },
    filterType: {
      get () {
        return this.$store.state.followup.filterType
      },
      set (value) {
        this.setFilterType(value)
      }
    },
    condition () {
      return {
        query: [
          { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' }
          // 'and',
          // { Key: 'IsDelete', Value: false, Oper: 'eq' }
        ],
        returnData: true
      }
    }
  },
  mounted () {
    this.loadFollowups(this.condition)
  }
}
</script>
<style scoped>
</style>
