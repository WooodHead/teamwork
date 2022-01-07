<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 菜单区 -->
    <tw-header-detail :noMenu="!!model.archived">
      <template #menu>
        <tw-menu
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
          :id="model.id"
          :type="type"
          :label="$t('assess.title')"
          :archiveTime="model.archiveTime"
          :archiveBy="model.archiveBy"
        />
      </q-card-section>
      <!-- 内容区-->
      <slot name="content">
        <q-card-section>
          <!-- 评估任务说明区 -->
          <div class="row no-wrap col">
            <div class="col q-gutter-y-sm">
              <div
                class="text-subtitle2"
                v-if="model && model.createTime"
              >
                {{timeAgo({ dateTime :model.modifyBy})}}
                {{$t('document.modify.lastUpdated')}}
                {{ timeAgo({ dateTime:model.createTime?model.createTime.replace(/-/g, '/'):''})}}
              </div>
              <div>
                <span class="text-grey">商机编号：</span><span class="text-subtitle2 ">{{model.opportunityNo}}</span>
              </div>
              <div>
                <span class="text-grey">评估单位：</span><span class="text-subtitle2 ">{{model.manufacturerName}}</span>
              </div>
              <div v-if="model && model.endDate">
                <span class="text-grey">评估截止日期：</span><span class="text-subtitle2 ">{{formatDate(model.endDate.replace(/-/g, '/'),'YYYY-MM-DD')}}</span>
              </div>
              <div
                class="tiptap-content editor__content"
                v-if="model&& model.assessRequire"
                v-html="model.assessRequire"
              >
              </div>
            </div>
          </div>
          <!-- 评估结果区域 -->
          <div v-html="model.nodes"></div>
        </q-card-section>
      </slot>

      <q-card-section v-if="model">
        <!-- 点赞区 -->
        <tw-boost-pack
          :boostTo="model.modifyBy"
          :objectID="+id"
          :objectType="type"
          :messageTitle="model.nodes||''"
        />
      </q-card-section>
      <!-- 讨论区 -->
      <q-card-section v-if="model">
        <discuss-board
          :objectID="+id"
          :objectType="type"
          type='assess'
          :objectTitle="title"
          @submitFinished="addAssessFinished($event)"
        />
      </q-card-section>

      <!-- 订阅 -->
      <q-card-section>
        <tw-subscribe
          :objectType="type"
          :objectID="+id"
          :quickSelected="quickSelected"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import timeAgo from '@/utils/time-ago'
import { showConfirm } from '@/utils/show-confirm'
import { date, LocalStorage } from 'quasar'
const { formatDate } = date
export default {
  name: 'AssessDetail',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      type: 'assess',
      model: [],
      myself: LocalStorage.getItem('myself'),
      quickSelected: null,
      menus: ['edit', 'delete', 'archive']
    }
  },
  computed: {
    title () {
      return '商机[' + this.model.opportunityNo + ']评估'
    }
  },
  mounted () {
    this.initData()
    // 获取资源类型指定的人员(用于订阅组件快捷选中人员)
    this.category && this.objectID && this.loadMembers({ category: this.category, objectID: +this.objectID }).then(ids => {
      if (ids.length) {
        let IDs = ids.filter(a => a !== this.myself.id)
        this.quickSelected = {
          title: this.$t(`${this.category}.title`) + '成员',
          personIDs: IDs
        }
      }
    })
  },
  methods: {
    ...mapActions('assess', ['loadAssess', 'refreshAssess', 'archiveAssess', 'unarchiveAssess', 'updateResult']),
    ...mapActions('opportunity', ['refreshOpportunity']),
    ...mapActions('member', ['loadMembers']),
    formatDate,
    timeAgo,
    updateModel (item) {
      this.model = item
    },
    initData () {
      this.loadAssess(+this.id).then(res => {
        this.model = res
      })
    },
    // 编辑
    onEdit () {
      // 跳转到产品详情页
      this.$router.push({
        name: 'assessEdit',
        params: {
          openType: 'edit',
          category: this.category,
          objectID: this.objectID,
          id: this.id
        }
      })
    },
    // 删除
    onDelete () {
      let that = this
      showConfirm(that.$t('message.reallyDelete'), () => {
        that.$store.dispatch('assess/deleteAssess', +that.id)
      })
    },
    // 归档
    onArchive () {
      this.archiveAssess(+this.id).then(res => {
      })
    },
    /**
     * 讨论添加完成后
     */
    addAssessFinished (val) {
      // 当前讨论者是商机的负责人
      if (val && +this.$myinfo.id === this.model.manufacturerLeaderID) {
        // 更新评估的状态
        this.updateResult({ id: +this.id, result: val.value, notes: val.description }).then(res => {
          this.refreshAssess(+this.id) // 刷新评估对象
          this.refreshOpportunity(+this.model.opportunityID) // 刷新商机状态
        })
      }
    }
  },
  components: {
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe')
  }
}
</script>

<style lang="scss" scoped>
</style>
