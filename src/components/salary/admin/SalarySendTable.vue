<!--
@Name：工资表格查看
@Author：陆欢
@date：2021/04/27
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-infinite-scroll
      @load="onLoadData"
      :offset="250"
      ref="infiniteScroll"
    >
      <q-table
        class="full-width"
        hide-bottom
        v-if="salarysList.length"
        row-key="id"
        :data="salarysList"
        :columns="columns"
        table-header-class="row"
        flat
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="row full-width"
          >
            <q-td
              key="name"
              :props="props"
            >
              <q-icon
                size="sm"
                name="perm_identity"
                style="color:#33ac37;"
              />
              {{ props.row.name }}
            </q-td>
            <q-td
              key="recordNum"
              :props="props"
            >
              {{ props.row.recordNum }}
            </q-td>
            <q-td
              key="organizeName"
              :props="props"
            >
              {{ props.row.organizeName }}
            </q-td>
            <q-td
              key="state"
              :props="props"
            >
              <q-badge
                :style="salaryState(props.row).style"
                class="q-pb-xs"
              >
                {{salaryState(props.row).title}}
              </q-badge>
            </q-td>
            <q-td
              key="operate"
              :props="props"
            >
              <q-btn
                flat
                dense
                style="color:#33ac37;"
                :label="$t('salary.viewDetail')"
                @click="viewDetail(props.row)"
                class="q-px-sm"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <template
        v-slot:loading
        v-if="salarysList.length&&showLoading()"
      >
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <div v-if="!salarysList.length">
      <tw-banner-no-result :info="$t(`salary.none`)"></tw-banner-no-result>
    </div>
    <!-- 弹出管理员需要输入验证码界面 -->
    <q-dialog v-model="showSecurityDialog">
      <admin-security-code
        @input="inputCode"
        @close="()=>{showSecurityDialog=false}"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'SalarySendTable',
  props: {
    filterType: {
      type: String,
      default: 'all',
      required: false,
      description: '筛选类型'
    }
  },
  data () {
    return {
      showSecurityDialog: false,
      columns: [
        {
          name: 'name',
          label: '姓名',
          align: 'left',
          classes: 'col-2 flex items-center',
          headerClasses: 'col-2 flex items-center'
        },
        {
          name: 'recordNum',
          label: this.$t('auth.fields.jobNumber'),
          align: 'center',
          classes: 'col-2 flex flex-center',
          headerClasses: 'col-2 flex flex-center'
        },
        {
          name: 'organizeName',
          label: '部门',
          align: 'center',
          classes: 'col-4 flex flex-center',
          headerClasses: 'col-4 flex flex-center'
        },
        {
          name: 'state',
          label: '状态',
          align: 'center',
          classes: 'col-2 flex flex-center',
          headerClasses: 'col-2 flex flex-center'
        },
        {
          name: 'operate',
          label: '操作',
          align: 'right',
          classes: 'col flex items-center justify-end',
          headerClasses: 'col flex items-center justify-end'
        }],
      salaryId: 0,
      recordNum: ''
    }
  },
  components: {
    // TwSearchPanel: () => import('components/base/TwSearchPanel'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    AdminSecurityCode: () => import('components/salary/admin/AdminSecurityCode')
  },
  mounted () {
  },
  computed: {
    ...mapState('salary', ['allSalaryDateAndType', 'adminSalarys', 'currentDateAndType', 'page', 'adminSecurityCode', 'salaryFilterStatus']),
    ...mapGetters('salary', ['getCurrentSalarys']),
    // 搜索框搜索条件
    search: {
      get () {
        return this.$store.getters['salary/search']
      },
      set (val) {
        val
          ? this.$store.commit('salary/setSearch', val)
          : this.$store.commit('salary/setSearch', '')
      }
    },
    salarysList () {
      return _.filter(this.getCurrentSalarys[this.filterType].list, o => {
        return _.includes(o.name + o.organizeName + o.recordNum, this.search)
      })
    }
  },
  methods: {
    ...mapMutations('salary', ['setSalarydateAndtype', 'setAdminSalaryModel']),
    ...mapActions('salary', ['loadSalaryDateAndType', 'getSalary', 'getCurrentDateAndTypeSalary']),
    onLoadData (index, done) {
      this.getCurrentDateAndTypeSalary({ status: this.filterType })
        .then(res => {
          setTimeout(() => {
            if (!this.showLoading()) {
              done(true)
            } else {
              done()
            }
          }, 1000)
        })
    },
    showLoading () {
      const year = this.currentDateAndType.salaryYear
      const month = this.currentDateAndType.salaryMonth
      const type = this.currentDateAndType.type
      if (!year && !month && !type) {
        return false
      }
      let list = _.filter(this.getCurrentSalarys[this.filterType].list, o => {
        return _.includes(o.name + o.organizeName + o.recordNum, this.search)
      })
      if (this.search) {
        if (this.page[`${year}-${month}-${type}`]) {
          return !(this.page[`${year}-${month}-${type}`]['nextPageToken'] === -1)
        } else {
          return true
        }
      } else {
        if (this.salaryFilterStatus[`${year}-${month}-${type}`]) {
          return list.length < this.salaryFilterStatus[`${year}-${month}-${type}`][this.filterType]
        } else {
          return true
        }
      }
    },
    inputCode (code) {
      // 设置验证码
      this.showSecurityDialog = false
      this.getCurrentSalary({ id: this.salaryId, code, recordNum: this.recordNum })
    },
    viewDetail (salary) {
      this.salaryId = salary.id
      this.recordNum = salary.recordNum
      let property = `${this.$store.state.salary.currentDateAndType.salaryYear}-${this.$store.state.salary.currentDateAndType.salaryMonth}-${this.$store.state.salary.currentDateAndType.type}`
      if (!this.$store.state.salary.adminSecurityCode.hasOwnProperty(property)) {
        this.showSecurityDialog = !this.$store.state.salary.adminSecurityCode.hasOwnProperty(property)
      } else {
        this.getCurrentSalary({ id: salary.id, code: this.$store.state.salary.adminSecurityCode[property], recordNum: salary.recordNum })
      }
    },
    getCurrentSalary (fields) {
      this.getSalary(fields).then(res => {
        if (res) {
          this.setAdminSalaryModel(res)
          this.$emit('viewDetail', res)
        }
      })
    },
    salaryState (item) {
      if (item.sendStatus === 2) {
        return {
          title: '未绑定',
          style: {
            backgroundColor: '#fef0f0',
            borderColor: '#fde2e2',
            color: '#f56c6c'
          },
          code: 0
        }
      } else if (item.sendStatus === 0) {
        return {
          title: '未发送',
          style: {
            backgroundColor: '#fef0f0',
            borderColor: '#fde2e2',
            color: '#f56c6c'
          },
          code: 1
        }
      } else if (item.sendStatus === 3) {
        return {
          title: '新数据',
          style: {
            backgroundColor: '#fef0f0',
            borderColor: '#fde2e2',
            color: '#f56c6c'
          },
          code: 1
        }
      } else if (item.sendStatus === 4) {
        return {
          title: '微信服务异常',
          style: {
            backgroundColor: '#fef0f0',
            borderColor: '#fde2e2',
            color: '#f56c6c'
          },
          code: 1
        }
      } else if (item.sendStatus === 1 && item.isRead) {
        return {
          title: '已读',
          style: {
            backgroundColor: '#ebf7eb',
            borderColor: '#d6eed7',
            color: '#33ac37'
          },
          code: 2
        }
      } else if (item.sendStatus === 1 && !item.isRead) {
        return {
          title: '未读',
          style: {
            backgroundColor: '#ebf7eb',
            borderColor: '#d6eed7',
            color: '#33ac37'
          },
          code: 3
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/thead .text-left {
  padding-left: 40px;
}
/deep/thead .text-right {
  padding-right: 40px;
}
/deep/thead tr {
  display: flex;
  flex-wrap: wrap;
}
/deep/thead th {
  font-weight: bold;
  font-size: 14px;
}
</style>
