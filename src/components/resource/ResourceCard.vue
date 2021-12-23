<template>
  <q-card
    flat
    bordered
    v-if="model"
    class="cursor-pointer widget-card base-card"
    :class="{'archived':model&&model.archived} "
    @click="openDetail"
    style="overflow:hidden"
  >
    <!-- {{model.type}} -->
    <div
      v-if="cardMenus&&cardMenus.length>0"
      class="absolute-top-right z-top"
      @click.stop="()=>{}"
    >
      <tw-menu
        flat
        :menus="cardMenus"
      />
    </div>

    <q-card-section class="widget-card-section base-card-section">
      <!-- 标题 -->
      <!-- {{model}} -->
      <div
        class="flex justify-between items-center q-mb-sm text-text1"
        :title="model?model.title:''"
      >
        <p
          class="text-h3-g text-weight-bold ellipsis q-ma-none"
          style="max-width: 80%;"
        >{{model?model.title:''}}</p>
        <tw-status-badge
          v-if="model.status"
          :value="model.status"
          :endDate="model.predictEndDate"
        />
        <q-badge
          v-if="typeField[category]"
          align="top"
          class="q-pa-xs"
          :class="typeColor"
        >
          {{type}}
        </q-badge>
      </div>
      <div
        v-if="category ==='customer'"
        class="text-body-g text-text1"
      >
        <p class="q-ma-none q-mb-xs">级别：{{grade}}</p>
        <p class="q-ma-none q-mb-xs">归属人：{{leaderName}}</p>
        <p class="q-mt-none q-mb-xs">跟进时间：
          <span>{{model.lastFollowupTime}}</span>
        </p>
        <p class="row q-mt-none q-mb-xs">跟进内容：<span
            v-html="model.lastFollowupContent"
            class="col recent-content"
          ></span>
        </p>
      </div>
      <div
        v-else
        class="text-body-g text-text1"
      >
        <p
          v-if="model.leaderID"
          class="q-mb-xs"
        >负责人：{{leaderName}}</p>
        <p
          v-if="period"
          class="q-mt-none q-mb-none"
        >周期：<span>{{period}}</span>
        </p>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import htmlToText from '@/utils/html-to-text'
import { mapState, mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
const { formatDate } = date
import getCategory from '@/mixins/mixins-get-category'
import period from '@/utils/period'
export default {
  name: 'ResourceCard',
  mixins: [getCategory],
  props: {
    category: { type: String, required: true },
    model: { type: Object },
    cardMenus: { type: Array, default: () => [], desc: '卡片菜单' }
  },
  data () {
    return {
      typeField: { organize: 'type', team: 'type', customer: 'customerType' }
    }
  },
  components: {
    // TwAvatar: () => import('components/base/TwAvatar'),
    TwMenu: () => import('components/base/TwMenu'),
    TwStatusBadge: () => import('components/base/TwStatusBadge')
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapState('person', ['selectPersons']),
    ...mapGetters('member', ['membersFilterInService']),
    members () {
      if (['project', 'team', 'productDev', 'customer'].includes(this.category) && Object.keys(this.model).length) {
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
    },
    period () {
      const { status, beginDate, endDate, predictEndDate } = this.model
      return period({ status, beginDate, endDate, predictEndDate })
    },
    types () {
      let types = []
      if (this.category === 'organize') {
        types = this.dictionary['organize'] ? this.dictionary['organize']['organizeType'] : []
      } else if (this.category === 'customer') {
        types = this.dictionary['customer'] ? this.dictionary['customer']['customerType'] : []
      } else if (this.category === 'team') {
        types = this.dictionary['team'] ? this.dictionary['team']['Type'] : []
      }
      return types
    },
    typeColor () {
      const key = this.model[this.typeField[this.category]],
        type = this.types.find(t => t.dictKey === String(key)) || { color: 'bg-primary1' }
      return type.color
    },
    type () {
      const key = this.model[this.typeField[this.category]],
        type = this.types.find(t => t.dictKey === String(key)) || {}
      return type.dictValue || key
    },
    grade () {
      const key = this.model[this.typeField[this.category]]
      const grades = this.dictionary['customer'] ? this.dictionary['customer']['grade'] : []
      const value = _.find(grades, g => g.dictKey === String(key))
      return value ? value.dictValue : this.model.grade
    }
  },
  created () {
    // 获取机构类型下拉框字典数据
    this.loadDictionarys(this.category)
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    htmlToText,
    formatDate,
    openDetail () {
      this.$router.push({
        // name: this.model.isTemplate ? `${this.category}TemplateDetail` : `${this.category}Detail`,
        name: `${this.category}Detail`,
        params: { id: Number(this.model.id) }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .recent-content p {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
