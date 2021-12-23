<template>
  <q-card :flat="$q.screen.lt.sm" class="card-grow-in-page">
    <!-- 标题菜单 -->
    <tw-header-card
      :title="$t('recommendCode.module')"
      :actions="actions"
      :add="{
        label: $t('action.add'),
        click: addPushCode
      }"
    >
      <template #menu>
        <tw-menu
          :menus="menuLists"
          @statistics="
            () => {
              showStatistics = !showStatistics;
            }
          "
          @rankingList="toRank()"
        />
      </template>
      <template v-slot:right v-if="$q.screen.gt.sm">
        <div class="q-col-gutter-md q-pl-sm" style="width:120px;" />
      </template>
    </tw-header-card>

    <!-- 搜索 -->
    <tw-search-panel
      :search.sync="search"
      :showPanelBtn="false"
      :class="$q.screen.gt.xs ? 'q-px-xl q-my-lg' : 'q-px-md q-mb-lg'"
    />

    <!-- 卡片列表length===0时展示没有数据 -->
    <template v-if="recommendCodes.length === 0">
      <tw-banner-no-result
        :class="{ bannerNoResult: $q.screen.gt.sm }"
        :info="$t('recommendCode.bannerNotes')"
      />
    </template>

    <!--推荐码列表展示-->
    <template v-if="recommendCodes.length > 0">
      <div
        class="flex q-gutter-y-md"
        :class="$q.screen.gt.xs ? 'q-px-xl' : 'q-px-md'"
      >
        <recommend-code-card
          v-for="p in search !== '' ? recommendCodes : newRecommendCodes"
          :key="p.id"
          :model="p"
          :showStatistics="showStatistics"
        />
      </div>
    </template>
  </q-card>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'RecommendCode',
  data () {
    return {
      showStatistics: false,
      menuLists: ['statistics', 'rankingList'],
      newRecommendCodes: []
    }
  },

  mounted () {
    // 获取推荐码数据
    this.loadRecommendCodes({ orderby: 'ModifyTime desc' }).then(res => {
      this.newRecommendCodes = res
    })
    this.initBreadcrumb(this.$router.currentRoute)
  },

  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        let newRoute = newVal
        // 设置面包屑
        this.initBreadcrumb(newRoute)
      }
    }
  },

  computed: {
    ...mapGetters('recommendCode', ['recommendCodes']),
    search: {
      get () {
        return this.$store.getters['recommendCode/search']
      },
      set (val) {
        val
          ? this.$store.commit('recommendCode/setSearch', val)
          : this.$store.commit('recommendCode/setSearch', '')
      }
    },
    // HR、系统管理员具有操作权限
    actions () {
      let op =
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      if (op) {
        return ['menu', 'add', 'other']
      } else {
        return ['other', 'menu']
      }
    }
  },
  methods: {
    ...mapActions('resume', ['getJobNumber']),
    ...mapActions('recommendCode', ['loadRecommendCodes']),
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs',
      'deleteWidgetBreadcrumb'
    ]),
    // 打开新建推荐码表单
    addPushCode () {
      this.$router.push({
        name: 'recommendCodeAdd',
        params: {
          openType: 'add'
        }
      })
    },

    // 面包屑处理
    initBreadcrumb (route) {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
    },
    // 转到排行榜页面
    toRank () {
      this.$router.push({
        name: 'rankingList'
      })
    }
  },

  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    RecommendCodeCard: () =>
      import('components/recruitment/recommend-code/RecommendCodeCard'),
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwMenu: () => import('components/base/TwMenu')
  }
}
</script>
<style scoped>
.bannerNoResult {
  margin: 0 96px;
}
</style>
