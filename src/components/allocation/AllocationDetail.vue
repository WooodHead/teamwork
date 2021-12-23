<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-detail :noMenu="model.archived">
      <template #menu>
        <tw-menu
          v-if="!$myinfo.auth.role.isOutsource"
          :menus="menus"
          @edit="onEdit"
          @delete="onDelete"
          @archive="onArchive"
        />
      </template>
    </tw-header-detail>

    <div class="q-px-xxl">
      <!-- 归档说明区 -->
      <q-card-section v-if="model.archived">
        <tw-archive-notes
          type="allocation"
          :label="$t('allocation.title')"
          :id="model.id"
          :archiveTime="model.archiveTime"
          :archiveBy="model.archiveBy"
        />
      </q-card-section>
      <!-- 内容区-->
      <slot name="content">
        <q-card-section class="q-pt-none q-gutter-y-sm">
          <div class="text-subtitle2">
            {{model.modifyBy}}
            {{$t('document.modify.lastUpdated')}}
            {{ timeAgo({ dateTime:model.createTime?model.createTime.replace(/-/g, '/'):''})}}
          </div>
          <div>
            <span class="text-grey">订单编号：</span>
            <span class="text-subtitle2">{{model.orderNo}}</span>
          </div>
          <div>
            <span class="text-grey">当前阶段：</span>
            <span class="text-subtitle2">
              <q-badge :color="statusList.find(s=>s.label===model.status)?statusList.find(s=>s.label===model.status).color:'grey'">
                {{ model.status}}
              </q-badge>
            </span>
          </div>
          <div>
            <span class="text-grey">生产单位：</span><span class="text-subtitle2">{{model.manufacturerName}}</span>
          </div>
          <div>
            <span class="text-grey">客户期望交期：</span><span class="text-subtitle2">{{model.expectedDeliveryDate}}</span>
          </div>
          <!-- 讨论区 -->
          <div v-html="model.notes"></div>
        </q-card-section>
      </slot>
      <!-- 点赞区 -->
      <q-card-section v-if="model">
        <tw-boost-pack
          objectType="allocation"
          :objectID="+id"
          :boostTo="model.modifyBy"
          :messageTitle="model.title||''"
        />
      </q-card-section>
      <!-- 讨论区 -->
      <q-card-section v-if="model">
        <discuss-board
          type="allocation"
          objectType="allocation"
          :objectID="+id"
          :objectTitle="model.title||''"
          @submitFinished="statusChange($event)"
        />
      </q-card-section>
      <!-- 订阅 -->
      <q-card-section>
        <tw-subscribe
          objectType="allocation"
          :objectID="+id"
          :quickSelected="quickSelected"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import timeAgo from '@/utils/time-ago'
export default {
  name: 'allocationDetail',
  props: {
    id: {
      type: [String, Number],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: 'order',
      required: true
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: true
    }
  },
  data () {
    return {
      menus: ['edit', 'delete', 'archive'],
      quickSelected: null
    }
  },
  computed: {
    model: {
      get () {
        return this.$store.getters['allocation/allocation'](+this.id)
      }
    },
    statusList () {
      return this.$store.getters['allocation/statusList']
    }
  },
  created () { },
  mounted () {
    this.category && this.objectID && this.$store.dispatch('member/loadMembers', { category: this.category, objectID: +this.objectID }).then(ids => {
      if (ids.length) {
        let IDs = ids.filter(a => a !== this.$myinfo.id)
        this.quickSelected = {
          title: this.$t(`.${this.category}.title`) + '成员',
          personIDs: IDs
        }
      }
    })
  },
  methods: {
    ...mapActions('allocation', ['loadAllocation']),
    timeAgo,
    // 编辑
    onEdit () {
      this.$router.push({
        name: 'allocationEdit',
        params: {
          category: this.category,
          objectID: this.objectID,
          id: this.id
        }
      })
    },
    // 删除
    onDelete () {
      showConfirm(this.$t('action.reallyDelete'), () => {
        this.$store.dispatch(`allocation/deleteAllocation`, +this.id)
      }, () => { })
    },
    // 归档
    onArchive () {
      this.$store.dispatch(`allocation/archiveAllocation`, +this.id)
    },
    // 状态变更
    statusChange (val) {
      val.description !== this.model.status &&
        this.$store.dispatch('allocation/updateStatus', { id: +this.id, status: val.description })
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe')
  }
}
</script>

<style scoped lang="scss">
</style>
