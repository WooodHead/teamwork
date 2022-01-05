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
            <div
              style="font-size:12px;"
              :class="{'emoji-font':$q.platform.is.win}"
            >{{currentModel.contactForm}}跟进
            </div>
            <div class="text-h5">
              <span class="text-weight-bold">{{currentModel.title}}</span>
            </div>
            <div class="text-caption-9 ">
              {{$t('followup.modify.postedBy',{modifyBy:currentModel.modifyBy})}}•
              {{timeAgo({ dateTime :currentModel.followupDate})}}
              <!-- <q-icon
                :name="iconName"
                :color="iconColor"
                size="sm"
              /> -->
              <!-- <span class="text-caption-9">{{currentModel.contactForm}}跟进</span> -->
            </div>
          </div>
          <!-- 跟进负责人 -->
          <div class="row">
            <span class="text-caption q-mr-sm">跟进负责人：</span>
            <tw-avatar
              :key="`followup_${currentModel.id}_${currentModel.leaderID}`"
              :id="currentModel && currentModel.leaderID"
              size="sm"
            />
          </div>
          <!-- 跟进参与人 -->
          <div class="row" v-if="currentModel&&currentModel.members.length>0">
            <span class="text-caption  q-mr-sm">跟进参与人：</span>
            <tw-avatar  v-for="member in currentModel.members" 
              :key="`followup_${currentModel.id}_${member}`"
              :id="member"
              size="sm"
              class="q-mr-xs"
            />
          </div>
          <!-- 客户联系人 -->
          <div class="row">
            <span class="text-caption q-mr-sm">客户联系人：</span>
            {{psonName(currentModel.customerContacter)}}
             <a :href="'tel:' + psonTel(currentModel.customerContacter)">({{psonTel(currentModel.customerContacter)}})</a>
          </div>
          <!-- 跟进具体内容 -->
          <div
            class="editor__content tiptap"
            v-html="currentModel.content"
          >
          </div>
        </q-card-section>
      </slot>
      <q-card-section v-if="currentModel">
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
import { mapState, mapActions } from 'vuex'
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
    ...mapState('person', ['selectPersons']),
    title () {
      return '[' + this.currentModel.title + ']的跟进'
    },
    currentModel () {
      return this.$store.getters['followup/currentModel'](+this.id)
    },
    psonName () {
      return (psonId) => this.selectPersons[psonId].name || ''
    },
    psonTel () {
      return (psonId) => this.selectPersons[psonId].phone || ''
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
        that.$store.dispatch('followup/deleteFollowup', +that.id).then(res => {
          if (res) {
            this.$router.push({
              name: 'followup',
              params: { category: this.category, objectID: this.objectID }
            })
          }
        })
      })
    }
  },
  components: {
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe'),
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
</style>
