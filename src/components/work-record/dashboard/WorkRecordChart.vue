<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-detail
      :title="$t('workRecord.dashboard.workRecord')"
      data-html2canvas-ignore
    >
      <template #menu>
        <tw-menu
          :menus="['html2Img','setWorkRecord']"
          @html2Img="onHtml2Img"
          @setWorkRecord="setWorkRecord"
        />
      </template>
    </tw-header-detail>
    <q-card-section
      v-if="queryDate"
      :class="['q-gutter-sm', {'q-px-xl':!$q.screen.lt.sm}]"
    >
      <!-- 集团/机构工作类别分布 -->
      <organize-business-type-chart :querys="querys" />
      <!-- 集团/机构工作类别分布 -->
      <organize-source-chart :querys="querys" />
      <!-- 机构排行 -->
      <organize-rank-chart :querys="querys" />
      <!-- 机构Top10 -->
      <organize-top-chart :querys="querys" />
      <!-- 员工Top20 -->
      <person-top-chart :querys="querys" />
      <div
        data-html2canvas-ignore
        v-if="querys && querys['date']"
        class="text-center q-mt-md text-grey-7"
        style="font-size:12px;"
      >
        {{$t('workRecord.dashboard.satisticNotes',
        {year:querys['date'].split('-')[0],month:querys['date'].split('-')[1]})}}
      </div>
    </q-card-section>
    <!-- 多条件筛选弹框 -->
    <q-dialog v-model="showSelectFilterDialog">
      <work-record-query-card :querys="querys" />
    </q-dialog>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { mapActions } from 'vuex'
import htmlToImg from '@/utils/html-to-img'
const { formatDate } = date, currentDay = new Date()
export default {
  name: 'WorkRecordChart',
  data () {
    return {
      date: formatDate(new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1), 'YYYY-MM'),
      queryDate: '',
      showSelectFilterDialog: false
    }
  },
  computed: {
    querys () {
      let allQuerys = this.$store.state.taskchart.workRecordDashQueryCon
      if (!allQuerys['date'] && this.queryDate) allQuerys = Object.assign({}, allQuerys, { 'date': this.queryDate })
      return allQuerys
    }
  },
  methods: {
    ...mapActions('taskchart', ['exists']),
    onHtml2Img () {
      let menu = document.getElementsByClassName('q-position-engine')
      if (menu && menu.length) {
        menu[0].style.visibility = 'hidden'
      }
      htmlToImg(this.$t('workRecord.dashboard.workRecord'))
    },
    setWorkRecord () {
      this.showSelectFilterDialog = true
    }
  },
  mounted () {
    this.exists(this.date).then(res => {
      if (res) this.queryDate = this.date
      else this.queryDate = formatDate(new Date(currentDay.getFullYear(), currentDay.getMonth() - 2, 1), 'YYYY-MM')
    })
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    OrganizeRankChart: () => import('components/work-record/dashboard/OrganizeRankChart'),
    OrganizeTopChart: () => import('components/work-record/dashboard/OrganizeTopChart'),
    OrganizeBusinessTypeChart: () => import('components/work-record/dashboard/OrganizeBusinessTypeChart'),
    OrganizeSourceChart: () => import('components/work-record/dashboard/OrganizeSourceChart'),
    WorkRecordQueryCard: () => import('components/work-record/dashboard/WorkRecordQueryCard'),
    PersonTopChart: () => import('components/work-record/dashboard/PersonTopChart')
  }
}
</script>

<style lang='scss' scoped>
/deep/.q-field__after {
  padding-left: 0px;
}
</style>
