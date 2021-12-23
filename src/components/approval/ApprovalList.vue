<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <q-card-section class="q-pb-none">
      <tw-search-panel
        :search.sync="search"
        :showPanelBtn="false"
        label="检索"
      />
    </q-card-section>
    <q-card-section>
      <q-infinite-scroll
        @load="onLoad"
        :offset="250"
        ref="qInfiniteScroll"
        class="row q-col-gutter-md justify-center"
      >
        <div
          class="col-12 col-md-4"
          v-for="approval in approvals"
          :key="approval.id"
        >
          <q-card
            bordered
            flat
            @click="toApprovalDetail(approval.spNo)"
          >
            <q-item>
              <q-item-section>
                <q-item-label>{{approval.applyer.UserId+'提交的'+approval.spName+'审批'}}</q-item-label>
                <q-item-label caption>{{approval.spName}}</q-item-label>
              </q-item-section>
              <q-item-section
                side
                top
              >
                <q-item-label caption>{{approval.applyTime}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-chip color="white">
                  <q-avatar>
                    <img :src="approval.applyer.Avatar?approval.applyer.Avatar:'https://cdn.quasar.dev/img/avatar2.jpg'">
                  </q-avatar>
                  <q-item-label caption>由{{approval.applyer.UserId}}提交</q-item-label>
                </q-chip>
              </q-item-section>
              <q-item-section side>
                <q-chip
                  outline
                  color="teal"
                  text-color="white"
                >{{approval.spStatusName}}</q-chip>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
        <template v-slot:loading>
          <div class="row justify-center">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
      <template v-if="loaded&&approvals.length===0">
        <tw-banner-no-result
          :info="'暂无该审批记录'"
          class="q-mt-md"
        />
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ApprovalList',
  props: {
    type: {
      type: String,
      require: true,
      default: 'waitDeal'
    }
  },
  data () {
    return {
      queryList: [],
      search: '',
      query: '',
      loaded: false
    }
  },
  computed: {
    approvals () {
      let approvals = this.$store.getters['approval/approvals']
      let mySubmit = _.filter(approvals, appro => appro.applyer.UserId === this.$myinfo.weChat)
      let myApprovalWait = _.filter(approvals, appro => _.isArray(appro.spRecord) && _.filter(appro.spRecord, record => _.isArray(record.Details) && _.filter(record.Details, detail => detail.Approver.UserId === this.$myinfo.weChat && detail.SpStatus === '1').length).length)
      let myApprovalEnd = _.filter(approvals, appro => _.isArray(appro.spRecord) && _.filter(appro.spRecord, record => _.isArray(record.Details) && _.filter(record.Details, detail => detail.Approver.UserId === this.$myinfo.weChat && detail.SpStatus !== '1').length).length)
      let myNotify = _.filter(approvals, appro => _.isArray(appro.notifyer) && _.filter(appro.notifyer, notify => notify.UserId === this.$myinfo.weChat).length)
      switch (this.type) {
        case 'waitDeal':
          approvals = myApprovalWait
          break
        case 'doneDeal':
          approvals = myApprovalEnd
          break
        case 'subDeal':
          approvals = mySubmit
          break
        case 'getDeal':
          approvals = myNotify
          break
        default:
          break
      }
      return approvals
    }
  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    ...mapActions('approval', ['loadApprovals', 'loadApprovalDetail']),
    onLoad (index, done) {
      if (index === 1) {
        this.loaded = false
      }
      this.loadApprovals({ byPage: true }).then(res => {
        this.loaded = true
        if (this.$store.state.approval.page.nextPageToken === -1) {
          done(true)
        } else {
          done()
        }
      })
    },
    toApprovalDetail (spNo) {
      // this.$q.notify({ message: '请在企业微信中进行查看和操作！', icon: 'warning', color: 'organize' })
      // this.loadApprovalDetail({ spNo })
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style scoped lang="scss">
</style>
