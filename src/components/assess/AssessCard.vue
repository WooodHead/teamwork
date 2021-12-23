<template>
  <q-card
    flat
    bordered
    class="cursor-pointer text-center customer-card"
    @click="gotoDetail"
    style="overflow:hidden"
  >
    <div class="fit customer-card borders-radius-inherit">
      <q-card-section class="q-pt-sm q-pb-xs">
        <div class="row">
          <div class="col text-subtitle2 text-weight-bold text-center">
            {{ objWidget.label }}
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-py-none" v-if="$q.screen.gt.xs">
        <q-separator />
      </q-card-section>
     
      <template v-if="loadAssess.length === 0">
        <q-card-section :class="$q.screen.gt.xs ? 'q-py-lg' : 'q-py-xs'">
          <q-btn
            round
            :size="$q.screen.gt.xs ? '32px' : '20px'"
            :color="objWidget.color"
            :icon="objWidget.icon"
          />
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-9">
          <slot name="notes">
            {{ objWidget.notes}}
          </slot>
        </q-card-section>
      </template>
      <template v-else>
        <!-- 遍历评估数据 -->
        <div v-for="(assess, index) in loadAssess" :key="assess.id">
          <assess-item
            :dense="true"
            category="opportunity"
            :model="assess"
            v-if="index <= 3"
          />
        </div>
      </template>
    </div>
  </q-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Opportunity from '@/store/opportunity/model'
export default {
  name: 'AssessCard',
  props: {
    model: {
      type: Object,
      default: new Opportunity()
    }
  },
  data () {
    return {
      objWidget: {
        label: '商机评估',
        icon: 'card_travel',
        color: 'blue',
        notes: '您还尚未有商机的评估和报价活动！'
      }
    }
  },
  computed: {
    ...mapState('assess', ['isArchivedList']),
    loadAssess () {
      return (
        this.$store.getters['assess/allAssess']({
          category: 'opportunity',
          objectID: this.model.id
        }) || []
      )
    },
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: 'OpportunityID', Value: this.model.id, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: this.isArchivedList ? 1 : 0, Oper: 'eq' }
      ]
      return queryCondition
    }
  },
  components: {
    AssessItem: () => import('components/assess/AssessItem')
  },
  mounted () {
    this.loadAllAssess({
      query: this.queryCondition,
      byPage: this.isArchivedList // 仅归档列表分页，草稿、发布列表暂不分页
    })
  },
  methods: {
    ...mapActions('assess', ['loadAllAssess']),
    gotoDetail () {
      this.$router.push({
        name: 'assess',
        params: {
          category: 'opportunity',
          objectID: +this.model.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.customer-card {
  width: 100% !important;
  height: 100% !important;
  border-radius: 10px;
}
</style>
