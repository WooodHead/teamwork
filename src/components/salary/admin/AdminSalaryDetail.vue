<template>
  <!-- <q-scroll-area style="height: calc(100vh - 50px);"> -->
  <q-card
    :flat="$route.name !== 'applySalary'"
    :class="[ $q.screen.gt.sm && 'q-mx-xl', $route.name === 'applySalary'&&'salary-detail-page q-pt-md']"
    ref="salaryDetail"
  >
    <q-card-section class="q-pa-none q-pb-md flex items-center justify-between">
      <div class="flex items-center">
        <q-btn
          v-if="$route.name !== 'applySalary'"
          flat
          dense
          color="grey-8"
          icon="arrow_back"
          @click="$emit('hideDetail')"
          size="18px"
        />
        <p class="q-mb-none q-ml-md text-subtitle1 text-grey-8 text-weight-bold">{{adminSalaryModel.name}}的工资条</p>
      </div>
      <div v-if="$route.name === 'applySalary'">
        <q-btn
          v-if="adminSecurityCode.hasOwnProperty(`${currentDateAndType.salaryYear}-${currentDateAndType.salaryMonth}-${currentDateAndType.type}`)"
          outline
          rounded
          color="grey-8"
          label="重发"
          @click="toRecall"
          class="q-px-md q-mr-md"
        />
      </div>
      <div v-else>
        <tw-menu
          :menus="menus"
          @delete="onDelete"
          @recall="toRecall"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none flex">
      <div class="col">
        <div class="q-pa-md card-section-title">工资条详情</div>
      </div>
      <div
        v-if="$route.name !== 'applySalary' && $q.screen.gt.sm"
        class="col bg-grey-2"
      >
        <div class="q-pa-md card-section-title">员工反馈</div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section
      class="q-pa-none flex"
      :style="$route.name !== 'applySalary'&&'max-height: 60vh; min-height: 50vh;'"
    >
      <div
        class="col"
        :style="$route.name !== 'applySalary'&&'max-height: 60vh; min-height: 50vh; overflow: auto;'"
      >
        <div class="q-px-md salary-detail-container">
          <p class="q-mb-none q-py-md flex justify-between text-grey-8 salary-item">
            <span>姓名</span><span>{{adminSalaryModel.name}}</span>
          </p>
          <p
            class="q-mb-none q-py-md flex justify-between text-grey-8 salary-item"
            v-for="(item, key) in adminSalaryModel.value"
            :key="key"
          >
            <span>{{key}}</span><span>{{item}}</span>
          </p>
        </div>
      </div>
      <div
        v-if="$route.name !== 'applySalary' && $q.screen.gt.sm"
        class="col bg-grey-2 flex flex-center"
      >
        <p class="q-mb-none text-grey-8">暂无反馈</p>
      </div>
    </q-card-section>
    <!-- 弹出管理员需要输入验证码界面 -->
    <q-dialog
      persistent
      v-model="showSecurityDialog"
    >
      <admin-security-code
        @input="inputCode"
        @close="()=>{showSecurityDialog=false}"
      />
    </q-dialog>
  </q-card>
  <!-- </q-scroll-area> -->
</template>

<script>
// import { Platform } from 'quasar'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'AdminSalaryDetail',
  props: {
  },
  components: {
    // SalaryDetail: () => import('components/salary/SalaryDetail')
    TwMenu: () => import('components/base/TwMenu'),
    AdminSecurityCode: () => import('components/salary/admin/AdminSecurityCode')
  },
  data () {
    return {
      showSecurityDialog: false,
      menus: ['recall', 'delete']
    }
  },
  computed: {
    ...mapState('salary', ['adminSecurityCode', 'currentDateAndType']),
    ...mapGetters('salary', ['adminSalaryModel'])
  },
  methods: {
    ...mapActions('salary', ['getSalary', 'sendMessage', 'deleteSalary', 'getCount']),
    ...mapMutations('salary', ['setAdminSalaryModel', 'setCurrentDateAndType']),
    inputCode (code) {
      // 设置验证码
      this.getCurrentSalary({ id: this.$route.params.id, code, recordNum: this.$route.params.recordNum })
    },
    getCurrentSalary (fields) {
      this.getSalary(fields).then(res => {
        if (res) {
          this.showSecurityDialog = false
          this.setAdminSalaryModel(res)
          this.$emit('viewDetail', res)
        }
      })
    },
    feedBack () {
      console.log('反馈')
    },
    toRecall () {
      // 重新发送  2.重发某一个人的
      let query = [
        { Key: 'Id', Value: +this.adminSalaryModel.id, Oper: 'eq' }
      ]
      this.sendMessage({ query, code: this.adminSecurityCode[`${this.currentDateAndType.salaryYear}-${this.currentDateAndType.salaryMonth}-${this.currentDateAndType.type}`], salaryYear: +this.currentDateAndType.salaryYear, salaryMonth: +this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type }).then(res => {
        if (res) {
          showSuccessMessage('发送成功')
          // 更新状态数量
          this.getCount({ year: this.currentDateAndType.salaryYear, month: this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type, psonID: +this.$myinfo.id, isToggle: false })
          this.$router.push({ name: 'salaryHome' }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    onDelete () {
      showConfirm(`即将删除${this.adminSalaryModel.name}的工资条，请确认？`, () => {
        this.deleteSalary(this.adminSalaryModel.id)
          .then(res => {
            if (res) {
              this.getCount({ year: this.currentDateAndType.salaryYear, month: this.currentDateAndType.salaryMonth, type: this.currentDateAndType.type, psonID: +this.$myinfo.id, isToggle: false })
              this.$emit('hideDetail')
            }
          })
      }, () => { })
    }
  },
  mounted () {
    if (!Object.keys(this.adminSalaryModel).length) {
      let property = `${this.currentDateAndType.salaryYear}-${this.currentDateAndType.salaryMonth}-${this.currentDateAndType.type}`
      if (!this.adminSecurityCode.hasOwnProperty(property)) {
        this.setCurrentDateAndType({
          salaryYear: this.$route.params.year,
          salaryMonth: this.$route.params.month,
          type: this.$route.params.type
        })
        this.showSecurityDialog = true
      } else {
        this.getCurrentSalary({ id: this.$route.params.id, code: this.$store.state.salary.adminSecurityCode[property], recordNum: this.$route.params.recordNum })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.salary-detail-page {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0 auto;
  max-width: 500px;
  width: 100%;
  // min-height: calc(100vh - 50px);
}
.card-section-title {
  font-size: 16px;
  color: $grey-8;
}
.salary-item {
  border-bottom: 1px solid $grey-4;
  &:last-child {
    border-bottom: none;
  }
}
@media screen and (max-width: 500px) {
  .salary-detail-page {
    top: 50px;
  }
}
</style>
