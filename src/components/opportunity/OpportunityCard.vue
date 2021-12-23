<template>
  <q-card
    flat
    bordered
    class="cursor-pointer widget-card base-card"
    :class="{'archived':model.archived}"
    style="overflow:hidden"
    @click="openDetail"
  >
    <q-card-section>
      <!-- 标题 -->
      <div class="flex items-center q-mb-sm">
        <div
          style="max-width: 130px"
          class="col text-h2-g text-weight-bold ellipsis"
          :title="model.title"
        >{{model.title}}</div>
        <q-space />
        <div class="col-auto">
          <opportunity-status-badge
            :status="model.status"
            :isLost="model.isLost"
          />
        </div>
      </div>
      <div class="text-body-g text-text1">
        <p class="q-mb-xs">客户名称：{{model.customerName}}</p>
        <p class="q-mb-xs">商机类型：{{model.classification?(model.classification.split(':')[1]?model.classification.split(':')[1]:model.classification):''}}</p>
        <p class="q-mb-xs">加工类型：{{model.processType?(model.processType.split(':')[1]?model.processType.split(':')[1]:model.processType):''}}</p>
        <p class="q-mb-xs">期望交期：{{formatDate(model.expectedDeliveryDate&&model.expectedDeliveryDate.replace(/-/g, '/'),'YYYY-MM-DD')}}</p>
      </div>
      <q-separator
        v-if="model.leaderID"
        class="q-my-sm"
      />
      <div
        v-if="model.leaderID"
        class="text-body-g text-text1"
      >
        <p class="q-mb-xs">归属人：{{leaderName}}</p>
      </div>
      <!-- <div class="text-h7">
        <div class="row ">
          <span class="ellipsis">{{model.customerName}}</span>
        </div>
      </div> -->
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { date } from 'quasar'
import htmlToText from '@/utils/html-to-text'
import Opportunity from '@/store/opportunity/model'
const { formatDate } = date
export default {
  name: 'OpportunityCard',
  props: {
    model: {
      type: Object,
      default: new Opportunity()
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapGetters('member', ['membersFilterInService']),
    members () {
      if (Object.keys(this.model).length) {
        return this.membersFilterInService(this.model.members)
      } else {
        return this.model.members
      }
    },
    person () {
      return this.selectPersons[this.model.leaderID] || {}
    },
    leaderName () {
      return this.person.name || ''
    }
  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    formatDate,
    htmlToText,
    dicKey (value) {
      return (value && value.split(':').length >= 2) ? value.split(':')[1] : value
    },
    openDetail () {
      this.$router.push({
        name: `opportunityDetail`,
        params: {
          id: Number(this.model.id)
        }
      })
    }
  },
  components: {
    OpportunityStatusBadge: () => import('components/opportunity/OpportunityStatusBadge')
  }
}
</script>

<style scoped lang="scss">
</style>
