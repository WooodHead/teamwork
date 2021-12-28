<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 菜单区 -->
    <tw-header-detail :noMenu="!!currentModel.archived">
      <template #menu>
        <tw-menu
          :menus="menus"
          @edit="onEdit"
          @delete="onDelete"
        />
      </template>
    </tw-header-detail>

    <div class="q-px-xxl">
      <!-- 内容区-->
      <slot name="content">
        <q-card-section class="q-pt-none q-gutter-y-sm">
          <div
            class="column q-gutter-y-sm text-center "
            :style="$q.platform.is.desktop&&'margin-top:-40px;'"
          >
            <div class="text-h5">
              <span class="text-weight-bold">{{currentModel.title}}</span>
            </div>
            <div class="text-caption text-grey-9 ">
              {{$t('document.modify.postedBy',{modifyBy:currentModel.modifyBy})}}•
              {{timeAgo({ dateTime :currentModel.modifyTime})}}
              <q-icon
                :name="iconName"
                :color="iconColor"
                size="sm"
              />
              <span class="text-caption text-grey-9">{{currentModel.contactForm}}跟进</span>
            </div>
          </div>
          <!-- 跟进具体内容 -->
          <div
            class="editor__content tiptap"
            v-html="currentModel.content"
          >
          </div>
        </q-card-section>
      </slot>
      <q-card-section v-if="model">
        <!-- 点赞区 -->
        <tw-boost-pack
          :boostTo="currentModel.modifyBy"
          :objectID="+id"
          :objectType="type"
          messageTitle=""
        />
      </q-card-section>
      <!-- 讨论区 -->
      <q-card-section v-if="currentModel">
        <discuss-board
          :objectID="+id"
          :objectType="type"
          type='discuss'
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
      type: 'followup',
      myself: LocalStorage.getItem('myself'),
      quickSelected: null,
      menus: ['edit', 'delete']
    }
  },
  computed: {
    currentModel () {
      return this.$store.getters['followup/currentModel'](+this.id)
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
    ...mapActions('followup', ['loadFollowup']),
    ...mapActions('member', ['loadMembers']),
    formatDate,
    timeAgo,
    initData () {
      this.loadFollowup(+this.id)
    },
    // 编辑
    onEdit () {
      // 跳转到产品详情页
      this.$router.push({
        name: 'followupEdit',
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
        that.$store.dispatch('followup/deleteFollowup', +that.id)
      })
    },
    /**
     * 评论添加完成后
     */
    addAssessFinished (val) {
      // 当前评论者是商机的负责人
      if (val && +this.$myinfo.id === this.currentModel.manufacturerLeaderID) {
        // 更新评估的状态
        this.updateResult({ id: +this.id, result: val.value, notes: val.description }).then(res => {
          this.refreshAssess(+this.id) // 刷新评估对象
          this.refreshOpportunity(+this.currentModel.opportunityID) // 刷新商机状态
        })
      }
    }
  },
  components: {
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe')
  }
}
</script>

<style lang="scss" scoped>
</style>
