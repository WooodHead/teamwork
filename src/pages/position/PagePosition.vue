<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 头部 -->
      <tw-header-card
        :title="$t('position.module')"
        :actions="actions"
        :add="{
          label: $t('position.importPosition'),
          click: importPosition
        }"
      >
        <template
          v-slot:right
          v-if="positions.length"
        >
          <q-btn
            icon-right="send"
            outline
            rounded
            color="positive"
            :label="$t('position.resendMessage')"
            @click="resendMessage"
          >
          </q-btn>
        </template>
      </tw-header-card>
      <!-- 数据体部-->
      <div class="q-px-xxl q-pb-lg">
        <!-- 发送消息 -->
        <send-wechat-message
          v-if="positionBatchCountAndStatus && isSending>0"
          class="full-width"
          type="position"
          :everyTypeCount='positionBatchCountAndStatus'
        />
        <div v-else>
          <!-- 筛选条件 -->
          <filter-condition
            :filterOptions="countPositionStatus"
            @setFilterType="handleFilterType"
            @setSearch="handleSearch"
            :currentType="filterType"
            :currentSearch="search"
          ></filter-condition>
          <!-- 无查询结果提示 -->
          <tw-banner-no-result v-if="!isLoading&&!positions.length" />
          <q-infinite-scroll
            @load="onLoadPositions"
            :disable="isLoading||!moreData"
            :offset="250"
            ref="infiniteScroll"
          >
            <div class="q-pb-md">
              <position-list
                :postions="positions"
                @viewDetail="viewDetail"
              />
            </div>
            <!-- 数据加载中提示 -->
            <div
              v-if="isLoading"
              class="text-center"
            >
              <q-spinner-dots
                color="primary"
                size="2em"
              />
            </div>
          </q-infinite-scroll>
        </div>
      </div>
    </q-card>
    <!-- 验证码输入框 -->
    <q-dialog v-model="showInputCode">
      <div
        class="relative-position no-shadow"
        style="width: 96vw;max-width: 320px;"
      >
        <dynamic-code-input
          :smallMode="true"
          @ok="code=>handleCode(code,codeInputType)"
        />
      </div>
    </q-dialog>
    <!-- 职位查看框 -->
    <q-dialog v-model="showPositionCard">
      <position-card
        bg="none"
        :position="positionModel"
        style="width: 96vw;max-width: 320px;"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'PagePosition',
  data () {
    return {
      actions: ['add', 'other'],
      isLoading: false,
      moreData: true,
      code: '',
      showInputCode: false,
      showPositionCard: false,
      recordNum: '',
      codeInputType: ''
    }
  },
  methods: {
    ...mapActions('position', ['staffSendPosition']),
    ...mapMutations('position', ['setSearch', 'setFilterType']),
    // 数据加载
    handleCode (code, type, fromInput = true) {
      this.$q.loading.show()
      // 验证code是否正确的查询条件
      let condition = { code, isCommit: false }
      if (type === 'viewDetail') {
        condition.query = { Key: 'RecordNum', Value: this.recordNum, Oper: 'eq' }
      } else {
        condition.byPage = true
        condition.limit = 1
        condition.offset = '0'
      }
      this.$store.dispatch('position/loadPositions', condition).then(positions => {
        // 验证码正确
        if (code && positions && positions.length > 0 && positions[0].value) {
          this.$q.loading.hide()
          // 关闭验证码弹框
          this.showInputCode = false
          // 记录验证码
          this.code = code
          // 查看职位职级详情
          if (type === 'viewDetail') {
            this.$store.commit('position/updatePosition', positions[0])
            this.showPositionCard = true
          }
          // 重发消息
          if (type === 'resendMessage') {
            //  重发消息处理
            this.sendMessage()
          }
        } else {
          this.code = ''
          showWarningMessage(this.$t(`position.codeErr`))
          if (!fromInput) {
            this.codeInputType = 'resendMessage'
            this.showInputCode = true
          }
        }
      })
    },
    // 筛选类型
    handleFilterType (filterType) {
      this.setFilterType(filterType)
      this.resetList()
    },
    // 模糊查询
    handleSearch (search) {
      this.setSearch(search)
      this.resetList()
    },
    /** 重置列表 */
    resetList () {
      this.moreData = true
      this.$store.dispatch('position/resetPositions')
      this.$refs.infiniteScroll && this.$refs.infiniteScroll.poll()
      // 获取统计数量
      this.$store.dispatch('position/getStatusCount', { search: this.search })
    },
    // 分页加载列表
    onLoadPositions (index, done) {
      this.isLoading = true
      // 加载数据
      this.$store.dispatch('position/loadPositions', { query: this.filterCondition, search: this.search, byPage: true, code: this.code }).then(positions => {
        this.moreData = positions && positions.length > 0
        this.isLoading = false
        done()
      })
    },
    // 重发消息
    resendMessage () {
      this.$q.dialog({
        title: this.$t('position.sure'),
        message: this.$t('position.resendMessageTip'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        // 如果code之前输入过，则使用之前的获取解密职级
        if (this.code) {
          this.handleCode(this.code, 'resendMessage', false)
        } else {
          this.codeInputType = 'resendMessage'
          this.showInputCode = true
        }
      })
    },
    //  重发消息处理
    sendMessage () {
      this.staffSendPosition({ query: this.filterCondition, search: this.search, code: this.code })
    },
    // 导入职级
    importPosition () {
      this.$router.push({
        name: 'importPosition',
        params: { importType: 'position' }
      })
    },
    // 查看职位职级详情
    viewDetail (recordNum) {
      // 存储要查看职级的工号
      this.recordNum = recordNum
      // 如果该工号职级已解密，直接显示，否则输入动态码
      if (this.positionModel && this.positionModel.value) {
        this.showPositionCard = true
      } else if (this.code) {
        // 如果code之前输入过，则使用之前的获取解密职级
        this.handleCode(this.code, 'viewDetail', false)
      } else {
        this.codeInputType = 'viewDetail'
        this.showInputCode = true
      }
    }
  },
  computed: {
    ...mapState('position', ['positions', 'positionBatchCountAndStatus', 'search', 'filterType']),
    ...mapGetters('position', ['countPositionStatus', 'position', 'filterCondition']),
    // 查看职级model
    positionModel () {
      return this.position(this.recordNum)
    },
    isSending () {
      return +this.positionBatchCountAndStatus.all - this.positionBatchCountAndStatus.sended
    }
  },
  mounted () {
    // 无权限访问
    if (!this.$myinfo.auth.role.isPositionManager) {
      showWarningMessage(this.$t('position.noAuth'))
      this.$router.push({
        name: 'home'
      })
    } else {
      // 获取统计数量
      this.$store.dispatch('position/getStatusCount', { search: this.search })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    PositionList: () => import('components/position/PositionList'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    DynamicCodeInput: () => import('components/position/DynamicCodeInput'),
    PositionCard: () => import('components/position/PositionCard'),
    FilterCondition: () => import('components/salary/FilterCondition'),
    SendWechatMessage: () => import('components/salary/admin/SendWechatMessage')
  }
}
</script>

<style lang="scss" scoped>
</style>
