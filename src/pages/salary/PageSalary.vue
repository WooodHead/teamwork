<!--
@Name：管理工资条首页
@Author：陆欢
@date：2021/04/23
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题头部信息 -->
      <tw-header-card
        :title="title"
        :actions="actions"
        :add="{
          label: $t('salary.add'),
          click: addingEvent
        }"
        :selectOptions="orderOptions"
      >
        <template
          #titleAppend
          v-if="!noData"
        >
          <q-btn
            icon="arrow_drop_down"
            flat
            dense
          >
            <q-menu
              auto-close
              anchor="bottom right"
              self="top right"
            >
              <q-list class="my-status-card">
                <q-item
                  clickable
                  v-close-popup
                  v-for="item in allSalaryDateAndType"
                  :key="item.id"
                  @click="setSalaryDateAndType(item)"
                  color="primary"
                >
                  <q-item-section>
                    <q-item-label>{{`${item.salaryYear}年${item.salaryMonth}月${$t('salary.salaryType.' + item.type)}`}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template #right>
          <tw-menu
            :menus="menus"
            @delete="onDelete"
            @recallAll="toRecallAll"
          />
        </template>
      </tw-header-card>
      <!-- 发送信息 -->
      <send-wechat-message
        v-if="getCurrentCountAndStatus && ((getCurrentCountAndStatus.all-getCurrentCountAndStatus.sended)>0 || !getCurrentCountAndStatus.all)"
        class="full-width"
        :everyTypeCount="getCurrentCountAndStatus"
      />
      <!-- 筛选条件 -->
      <q-card-section
        v-else-if="!showDetail"
        class="q-mx-lg q-px-xl q-pb-none"
      >
        <filter-condition
          :filterOptions="filterOptions"
          @setFilterType="setFilterType"
          @setSearch="setSearch"
        ></filter-condition>
        <salary-send-table
          :filterType="filterType"
          @viewDetail="viewDetail"
          ref="salaryTable"
        ></salary-send-table>
      </q-card-section>
      <q-card-section :class="[$q.screen.gt.sm && 'q-px-lg', 'q-pb-xl']">
        <admin-salary-detail
          v-if="showDetail"
          :model="model"
          @hideDetail="showDetail = false"
        ></admin-salary-detail>
      </q-card-section>
    </q-card>
    <!-- 弹出管理员需要输入验证码界面 -->
    <q-dialog v-model="showSecurityDialog">
      <admin-security-code
        @input="inputCode"
        @close="()=>{showSecurityDialog=false}"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'PageSalary',
  props: {
    year: {
      type: [String, Number],
      required: false,
      default: 0,
      description: '发薪年'
    },
    month: {
      type: [String, Number],
      required: false,
      default: 0,
      description: '发薪月'
    },
    type: {
      type: String,
      required: false,
      default: '',
      description: '发薪类型'
    }
  },
  data () {
    return {
      search: '',
      action: '',
      showSecurityDialog: false,
      filterType: 'all',
      showDetail: false,
      model: {},
      orderField: '',
      orderOptions: [
        {
          label: '默认',
          value: ''
        },
        {
          label: '人员名称',
          value: 'PsonName'
        },
        {
          label: '人员编号',
          value: 'RecordNum'
        },
        {
          label: '部门名称',
          value: 'OrganizeName'
        }
      ]
    }
  },
  mounted () {
    // 加载所有的年月和类型
    this.loadSalaryDateAndType()
      .then(res => {
        if (this.year && this.month && this.type) {
          this.setCurrentDateAndType({ id: 0, salaryYear: +this.year, salaryMonth: +this.month, type: this.type })
          if (!this.page[`${this.year}-${this.month}-${this.type}`]) {
            this.initTypePage({ salaryYear: this.year, salaryMonth: this.month, type: this.type })
          }
        } else if (!Object.keys(this.currentDateAndType).length && this.allSalaryDateAndType.length) {
          this.setCurrentDateAndType(this.allSalaryDateAndType[0])
          const year = this.allSalaryDateAndType[0].salaryYear
          const month = this.allSalaryDateAndType[0].salaryMonth
          const type = this.allSalaryDateAndType[0].type
          if (!this.page[`${year}-${month}-${type}`]) {
            this.initTypePage(this.allSalaryDateAndType[0])
          }
        }
        // 加载状态数量及是否在发送过程中
        this.getCount({ year: this.currentDateAndType.salaryYear, month: this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type, psonID: +this.$myinfo.id })
      })
  },
  watch: {
    getCurrentCountAndStatus () {
      if (this.getCurrentCountAndStatus && ((this.getCurrentCountAndStatus.all - this.getCurrentCountAndStatus.sended) <= 0)) {
        this.getCount({ year: this.currentDateAndType.salaryYear, month: this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type, psonID: +this.$myinfo.id, isToggle: false })
      }
    }
  },
  computed: {
    ...mapState('salary', ['allSalaryDateAndType', 'adminSalarys', 'currentDateAndType', 'adminSecurityCode', 'page', 'salaryCountAndStatus']),
    ...mapGetters('salary', ['getCurrentCountAndStatus', 'getCurrentSalarys', 'getCurrentFilterStatus']),
    noData () {
      if (!this.allSalaryDateAndType.length) {
        return true
      } else {
        return false
      }
    },
    currentDateCode () {
      let property = `${this.currentDateAndType.salaryYear}-${this.currentDateAndType.salaryMonth}-${this.currentDateAndType.type}`
      if (!this.adminSecurityCode.hasOwnProperty(property)) {
        // 如未经过验证，则弹出验证框
        return 0
      } else {
        return this.adminSecurityCode[property]
      }
    },
    title () {
      if (this.noData) {
        return '暂无数据'
      } else {
        return `${this.currentDateAndType.salaryYear}年${this.currentDateAndType.salaryMonth}月${this.$t('salary.salaryType.' + this.currentDateAndType.type)}`
      }
    },
    menus () {
      if (['error', 'unSend', 'newData', 'mismatch'].includes(this.filterType) && !this.showDetail) {
        return ['recallAll', 'delete']
      } else if (this.showDetail) {
        return ['recall']
      } else {
        return ['delete']
      }
    },
    filterOptions () {
      let options = []
      let filterStatus = this.getCurrentFilterStatus
      for (let key in filterStatus) {
        options.push({ label: `${this.$t(`salary.filterOptions.${key}`)}(${filterStatus[key]})`, value: key })
      }
      return options
    },
    actions () {
      if (this.showDetail || (this.getCurrentCountAndStatus && (this.getCurrentCountAndStatus.all - this.getCurrentCountAndStatus.sended > 0))) {
        return ['add']
      } else {
        return ['add', 'select']
      }
    }
  },
  methods: {
    ...mapMutations('salary', ['setCurrentDateAndType', 'setSalarydateAndtype', 'initTypePage', 'updatePage', 'emptyAdminSalary', 'resetSalaryCountAndStatus', 'setIsReSend']),
    ...mapActions('salary', ['loadSalaryDateAndType', 'sendMessage', 'deleteSalarys', 'loadSalarys', 'getCount']),
    setFilterType (type) {
      // 清空当前状态的数据
      this.filterType = type
      let list = _.filter(this.getCurrentSalarys[type].list, o => {
        return _.includes(o.name + o.organizeName + o.recordNum, this.search)
      })
      let offset = list.length
      const year = this.currentDateAndType.salaryYear
      const month = this.currentDateAndType.salaryMonth
      const salaryType = this.currentDateAndType.type
      this.updatePage({ year, month, type: salaryType, offset, nextPageToken: 0 })
      this.$refs.salaryTable.$refs.infiniteScroll.poll()
      this.$refs.salaryTable.$refs.infiniteScroll.resume()
    },
    setSearch (key) {
      key
        ? this.$store.commit('salary/setSearch', key)
        : this.$store.commit('salary/setSearch', '')
      this.search = key
      // 搜索时清空条件
      this.emptyAdminSalary()
      const salaryYear = this.currentDateAndType.salaryYear
      const salaryMonth = this.currentDateAndType.salaryMonth
      const type = this.currentDateAndType.type
      this.initTypePage({ salaryYear, salaryMonth, type })
      this.$refs.salaryTable.$refs.infiniteScroll.poll()
      this.$refs.salaryTable.$refs.infiniteScroll.resume()
    },
    inputCode (code) {
      this.showSecurityDialog = false
      if (this.action === 'delete') {
        let condition = {
          salaryYear: this.currentDateAndType.salaryYear,
          salaryMonth: this.currentDateAndType.salaryMonth,
          type: this.currentDateAndType.type,
          code: code
        }
        showConfirm(this.$t('salary.deleteDesc', { year: condition.salaryYear, month: condition.salaryMonth, type: this.$t(`salary.salaryType.${condition.type}`) }), () => {
          this.deleteSalarys(condition)
        }, () => { })
      } else {
        this.confirmRecall(code)
      }
    },
    toRecallAll () {
      this.action = 'recallAll'
      // 重新发送  1.全部重发
      if (!this.currentDateCode) {
        // 如未经过验证，则弹出验证框
        this.showSecurityDialog = true
      } else {
        // 确认重发
        this.confirmRecall()
      }
    },
    confirmRecall (code) {
      showConfirm('确认重发？', () => {
        let query = [
          { Key: 'SalaryYear', Value: +this.currentDateAndType.salaryYear, Oper: 'eq' },
          'and',
          { Key: 'SalaryMonth', Value: +this.currentDateAndType.salaryMonth, Oper: 'eq' },
          'and',
          { Key: 'Type', Value: this.currentDateAndType.type, Oper: 'eq' },
          'and',
          { Key: 'CreateByID', Value: +this.$myinfo.id, Oper: 'eq' }
        ]
        if (this.filterType === 'error') {
          query.push(
            'and',
            { Key: 'SendStatus', Value: 4, Oper: 'in' }
          )
        } else if (this.filterType === 'unSend') {
          query.push(
            'and',
            { Key: 'SendStatus', Value: 0, Oper: 'eq' }
          )
        } else if (this.filterType === 'newData') {
          query.push(
            'and',
            { Key: 'SendStatus', Value: 3, Oper: 'eq' }
          )
        } else if (this.filterType === 'mismatch') {
          query.push(
            'and',
            { Key: 'SendStatus', Value: 2, Oper: 'eq' }
          )
        }
        this.sendMessage({ query, code: code || this.currentDateCode, search: this.$store.getters['salary/search'], salaryYear: +this.currentDateAndType.salaryYear, salaryMonth: +this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type }).then(res => {
          if (res) {
            this.resetSalaryCountAndStatus({
              salaryYear: +this.currentDateAndType.salaryYear,
              salaryMonth: +this.currentDateAndType.salaryMonth,
              type: this.currentDateAndType.type
            })
          }
        })
      }, () => { })
    },
    onDelete () {
      this.action = 'delete'
      if (!this.currentDateCode) {
        // 如未经过验证，则弹出验证框
        this.showSecurityDialog = true
      } else {
        let condition = {
          salaryYear: this.currentDateAndType.salaryYear,
          salaryMonth: this.currentDateAndType.salaryMonth,
          type: this.currentDateAndType.type,
          code: this.adminSecurityCode[`${this.currentDateAndType.salaryYear}-${this.currentDateAndType.salaryMonth}-${this.currentDateAndType.type}`]
        }
        showConfirm(this.$t('salary.deleteDesc', { year: condition.salaryYear, month: condition.salaryMonth, type: this.$t(`salary.salaryType.${condition.type}`) }), () => {
          this.deleteSalarys(condition)
        }, () => { })
      }
    },
    addingEvent () {
      this.setIsReSend(false)
      // 必须是财务的角色才能下发
      if (this.$myinfo.auth.role.isFinance) {
        this.$router.push({
          name: 'salaryIssued'
        })
      } else {
        showWarningMessage('暂无权限')
      }
    },
    setSalaryDateAndType (item) {
      // 设置当前的日期和类型
      this.setCurrentDateAndType(item)
      // // 重新加载表格数据
      // this.getCurrentDateAndTypeSalary()
      this.getCount({ year: this.currentDateAndType.salaryYear, month: this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type, psonID: +this.$myinfo.id })
      // initTypePage是否初始化分页参数
      if (!this.page[`${item.salaryYear}-${item.salaryMonth}-${item.type}`]) {
        this.initTypePage(item)
      }
      this.$refs.salaryTable.$refs.infiniteScroll.poll()
      this.$refs.salaryTable.$refs.infiniteScroll.resume()
      this.showDetail = false
    },
    viewDetail (salary) {
      this.showDetail = true
      this.model = salary
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwMenu: () => import('components/base/TwMenu'),
    AdminSecurityCode: () => import('components/salary/admin/AdminSecurityCode'),
    // TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    AdminSalaryDetail: () => import('components/salary/admin/AdminSalaryDetail'),
    FilterCondition: () => import('components/salary/FilterCondition'),
    SalarySendTable: () => import('components/salary/admin/SalarySendTable'),
    SendWechatMessage: () => import('components/salary/admin/SendWechatMessage')
  }
}
</script>

<style scoped>
</style>
