<template>
  <div v-if="byPlanIDRecruitPlanNeed(Number(this.id)).length > 0">
    <q-table
      hide-bottom
      wrap-cells
      :data="byPlanIDRecruitPlanNeed(Number(this.id))"
      :columns="closed !== 2 ? columns : closedColumns"
      :row-key="rowKey"
      :rows-per-page-options="[0]"
      separator="cell"
      class="full-width"
    >
      <template v-slot:body-cell-jobName="props">
        <q-td
          :props="props"
          :class="props.row.status === 0 ? 'text-blue-grey-3' : ''"
        >
          <div class="q-pl-sm">{{ jobName(props.row.jobID) }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-organizeName="props">
        <q-td
          :props="props"
          :class="props.row.status === 0 ? 'text-blue-grey-3' : ''"
        >
          <div class="q-pl-sm">{{ props.row.organizeName }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-city="props">
        <q-td
          :props="props"
          :class="props.row.status === 0 ? 'text-blue-grey-3' : ''"
        >
          <div class="q-pl-sm">{{ props.row.city }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-num="props">
        <q-td
          :props="props"
          :class="props.row.status === 0 ? 'text-blue-grey-3' : ''"
        >
          <div class="q-pl-sm">{{ props.row.num }}</div></q-td
        >
      </template>
      <!-- 面试官 -->
      <template v-slot:body-cell-psonName="props">
        <q-td
          :props="props"
          :class="$q.screen.gt.sm ? 'row' : 'justify-center'"
        >
          <div
            v-for="item in psonIds(props.row)"
            :key="'pson_' + item.id"
            class="q-pb-sm q-px-sm relative-position"
          >
            <tw-avatar size="md" :id="item.psonID" />
            <q-btn
              dense
              rounded
              icon="clear"
              size="xs"
              color="grey-8"
              class="absolute-top-right"
              @click="onDelete(item)"
            />
          </div>
          <q-btn
            v-if="canOp"
            round
            flat
            dense
            color="primary"
            icon="add"
            class="q-pb-sm"
            @click.stop="shouInterDialog(props.row)"
          />
        </q-td>
      </template>
      <!-- 操作 -->
      <template v-slot:body-cell-operation="props" v-if="canOp">
        <q-td :props="props" class="primary">
          <q-btn round flat dense icon="more_horiz">
            <q-menu auto-close transition-show="scale" transition-hide="scale">
              <div class="column">
                <q-btn
                  v-if="props.row.status === 1"
                  label="暂停"
                  flat
                  @click="stopNeed(props.row)"
                />
                <q-btn v-else label="开启" flat @click="startNeed(props.row)" />
                <q-btn label="编辑" flat @click="openEditForm(props.row.id)" />
                <q-btn label="删除" flat @click="deleteNeed(props.row.id)" />
              </div>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- 面试官选择弹框 -->
    <q-dialog v-model="shouInterviewerDialog">
      <q-card :style="$q.screen.gt.sm ? 'width:25%' : 'width:80%'">
        <q-card-section class="row items-center">
          <div class="text-h6">选择面试官</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-py-none">
          <tw-select-person
            filled
            v-model="psonId"
            emit-value
            :label="$t('interviewer.interviewerName')"
            lazy-rules
            :rules="[val => val > 0 || $t('interviewer.selectInterviewer')]"
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            rounded
            unelevated
            label="保存"
            type="submit"
            color="primary"
            class="q-px-lg"
            @click.stop="addInterviewerModel()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { LocalStorage } from 'quasar'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'RecruitPlanNeedTable',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    closed: {
      type: [Number]
    },
    jobLists: {
      type: [Array]
    }
  },
  data () {
    return {
      rowKey: 'name',
      columns: [
        {
          name: 'jobName',
          label: '需求岗位',
          field: 'jobName',
          align: 'left'
        },
        {
          name: 'organizeName',
          label: '需求部门',
          field: 'organizeName',
          align: 'left'
        },
        { name: 'city', label: '城市', field: 'city', align: 'left' },
        { name: 'num', label: '人数', field: 'num', align: 'left' },
        {
          name: 'psonName',
          label: '面试官',
          field: 'psonName',
          align: 'left'
        },
        {
          name: 'operation',
          label: '操作',
          field: 'operation',
          align: 'left'
        }
      ],
      // 招聘计划结束后展示的内容
      closedColumns: [
        {
          name: 'jobName',
          label: '需求岗位',
          field: 'jobName',
          align: 'left'
        },
        {
          name: 'organizeName',
          label: '需求部门',
          field: 'organizeName',
          align: 'left'
        },
        { name: 'city', label: '城市', field: 'city', align: 'left' },
        { name: 'num', label: '人数', field: 'num', align: 'left' },
        {
          name: 'psonName',
          label: '面试官',
          field: 'psonName',
          align: 'left'
        }
      ],
      interviewerLits: [], // 面试官列表数据
      shouInterviewerDialog: false, // 面试官弹框
      psonId: '', // 面试官id
      interviewerModel: {} // 用于需要存储面试官信息
    }
  },
  computed: {
    ...mapGetters('recruitPlanNeed', ['byPlanIDRecruitPlanNeed']),
    ...mapGetters('job', ['jobs']),
    ...mapGetters('organize', ['selectOrganizes']),
    ...mapGetters('person', ['selectPersonsFiltered']),
    psonIds () {
      return function (params) {
        return _.filter(
          this.interviewerLits,
          inter =>
            inter.jobID === params.jobID &&
            inter.organizeID === params.organizeID &&
            inter.city === params.city
        )
      }
    },
    jobName () {
      return function (jobID) {
        if (this.jobLists.length > 0) {
          return _.filter(this.jobLists, job => job.id === jobID)[0].title
        }
      }
    },
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      )
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('job', ['loadJobs']),
    ...mapActions('recruitPlanNeed', [
      'loadRecruitPlanNeeds',
      'deleteRecruitPlanNeed',
      'updateRecruitPlanNeedFild'
    ]),
    ...mapActions('interviewer', [
      'loadInterviewers',
      'deleteInterviewer',
      'addInterviewer',
      'syncInterviewerRoleByPsonID'
    ]),
    // 初始化表格数据
    init () {
      // 初始化招聘计划需求数据
      this.loadRecruitPlanNeeds({
        query: [{ Key: 'PlanID', Value: Number(this.id), Oper: 'eq' }],
        byPage: false
      })
      // 获取面试官数据
      this.loadInterviewers({}).then(res => {
        this.interviewerLits = res
      })
    },
    // 打开编辑页
    openEditForm (val) {
      this.$emit('openPanel', val)
    },
    // 根据招聘计划需求id删除指定招聘计划需求
    deleteNeed (id) {
      showConfirm('确认要删除该招聘需求信息？', () => {
        this.deleteRecruitPlanNeed(id).then(res => {
          if (res) {
            this.init()
          }
        })
      })
    },
    // 暂停招聘需求计划
    stopNeed (val) {
      let payLoad = {
        id: val.id,
        status: 0
      }
      this.updateRecruitPlanNeedFild(payLoad)
    },
    // 开启招聘需求计划
    startNeed (val) {
      let payLoad = {
        id: val.id,
        status: 1
      }
      this.updateRecruitPlanNeedFild(payLoad)
    },
    // 删除指定面试官下信息
    onDelete (val) {
      showConfirm('确认要删除该面试官信息？', () => {
        this.deleteInterviewer(val.id).then(res => {
          if (res) {
            // 如果删除的是该面试官最后一条信息，删除成功后更新面试官角色成员
            if (
              _.filter(this.interviewerLits, psonId => psonId.id === val.id)
                .length === 1
            ) {
              this.syncInterviewerRoleByPsonID({
                psonId: +val.psonID,
                type: 'remove'
              })
            }
            this.init()
            showSuccessMessage('删除成功')
          }
        })
      })
    },
    // 打开面试官弹框
    shouInterDialog (val) {
      this.shouInterviewerDialog = true
      // 再次打开清空数据，避免数据污染
      this.psonId = ''
      // 获取需要的面试官存储信息
      this.interviewerModel = {}
      this.interviewerModel.jobID = val.jobID
      this.interviewerModel.jobName = val.jobName
      this.interviewerModel.organizeID = val.organizeID
      this.interviewerModel.organizeName = val.organizeName
      this.interviewerModel.city = val.city
      this.interviewerModel.num = val.num
    },
    // 维护招聘需求面试官信息
    addInterviewerModel () {
      let isExit = _.filter(
        this.interviewerLits,
        psonId => psonId.psonID === this.psonId
      )
      // 获取面试官信息
      this.interviewerModel.psonID = this.psonId
      this.interviewerModel.psonName = _.filter(
        this.selectPersonsFiltered,
        per => per.id === this.psonId
      )[0].name
      this.addInterviewer(this.interviewerModel).then(res => {
        if (res) {
          showSuccessMessage('添加成功')
          this.init()
          this.shouInterviewerDialog = false
        }
      })
      // 判断是否包含该面试官，如果包含不需要更新面试官角色，反之更新
      if (isExit.length === 0) {
        this.syncInterviewerRoleByPsonID({
          psonId: +this.psonId,
          type: 'grant'
        })
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwSelectPerson: () => import('components/base/TwSelectPerson')
  }
}
</script>

<style scoped>
.q-table th,
.q-table td {
  padding: 7px 0px;
  background-color: inherit;
  overflow: hidden;
}
</style>
