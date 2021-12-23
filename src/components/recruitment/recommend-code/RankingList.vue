<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page chat-card"
  >
    <!-- 面板标题 -->
    <tw-header-card
      ref="title"
      :title="$t('recommendCode.rankingList.title')"
    />

    <!-- 可选使用数和入职人数两个维度进行排行 -->
    <q-card-section :class="['q-py-none',$q.screen.gt.xs&&'q-px-xxl']">
      <q-btn-toggle
        v-model="model"
        class="my-custom-toggle"
        no-caps
        unelevated
        spread
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="recommendCodeType"
      >
        <template v-slot:oneToOne>
          <div
            @click="ToggleBtn(1)"
            class='btn-type'
          >
            {{$t('recommendCode.type1')}}
          </div>
        </template>

        <template v-slot:oneToMore>
          <div
            @click="ToggleBtn(0)"
            class='btn-type'
          >
            {{$t('recommendCode.type0')}}
          </div>
        </template>
      </q-btn-toggle>
    </q-card-section>

    <q-card-section :class="$q.screen.lt.sm?'':'q-px-xl'">
      <!-- 投递人数top10-->
      <v-chart
        style="height:400px;"
        :options="deliverRanking"
        theme="macarons"
      />

      <!-- 入职人数top10-->
      <v-chart
        style="height:400px;"
        :options="jobRanking"
        theme="macarons"
      />
    </q-card-section>

  </q-card>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'RankingList',
  data () {
    return {
      model: 'oneToOne',
      recommendCodeType: [
        { value: 'oneToOne', slot: 'oneToOne' },
        { value: 'oneToMore', slot: 'oneToMore' }
      ],
      codeType: 1
    }
  },

  computed: {
    ...mapGetters('recommendCode', ['rankingList']),
    deliverRanking () {
      var td = this.rankingList(this.codeType, 'deliverNumber')
      return {
        title: {
          left: 'left',
          text: this.$t('recommendCode.rankingList.deliverTOP10')
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: '{b}:{c}人'
        },
        yAxis:
        {
          type: 'category',
          data: _.map(td, 'name')
        },
        legend: {
          data: [this.$t('recommendCode.rankingList.number')],
          right: '30'
        },
        grid: {
          top: '50',
          left: '0',
          right: '30',
          bottom: '50',
          containLabel: true
        },
        xAxis: {
          position: 'top',
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false
          },
          max: function (value) {
            if (value.max < 10) {
              return 10
            } else {
              return value.max
            }
          }
        },
        series: {
          'name': this.$t('recommendCode.rankingList.number'),
          'type': 'bar',
          'data': _.map(td, 'deliverNumber')
        }
      }
    },

    jobRanking () {
      let tj = this.rankingList(this.codeType, 'jobNumber')
      return {
        title: {
          text: this.$t('recommendCode.rankingList.jobTOP10')
        },
        legend: {
          data: [this.$t('recommendCode.rankingList.number')],
          right: '30'
        },
        grid: {
          top: '50',
          left: '0',
          right: '30',
          bottom: '50',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove',
          formatter: '{b}:{c}人'
        },
        yAxis: {
          type: 'category',
          data: _.map(tj, 'name')
        },
        xAxis: {
          position: 'top',
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false
          },
          max: function (value) {
            if (value.max < 10) {
              return 10
            } else {
              return value.max
            }
          }
        },
        series: {
          'name': this.$t('recommendCode.rankingList.number'),
          'type': 'bar',
          'data': _.map(tj, 'jobNumber')
        }
      }
    }
  },

  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },

  methods: {
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'clearBreadcrumbs']),
    ...mapActions('recommendCode', ['loadRecommendCodes']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ToggleBtn (val) {
      this.codeType = val
    },
    initBreadcrumb () {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushModuleBreadcrumb({
        id: `recommendCode`,
        title: this.$t('recommendCode.module'),
        to: {
          name: 'recommendCode'
        }
      })
    }
  },

  mounted () {
    this.loadRecommendCodes({})
    this.initBreadcrumb()
  },

  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initBreadcrumb()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.my-custom-toggle {
  border: 1px solid #027be3;
}
.btn-type {
  width: 100%;
}
</style>
