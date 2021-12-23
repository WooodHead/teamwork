<template>
  <div>
    <q-item class="q-pt-sm q-px-none">
      <q-item-section>
        <!-- 编辑状态 -->
        <div class="row" v-if="$q.screen.gt.sm && isEdit">
          <tw-select-tree
            :class="
              $q.screen.gt.sm ? 'col-6 q-pr-sm q-py-none' : 'col-3 q-pr-sm'
            "
            filled
            emit-value
            :nodes="selectOrganizesTree"
            isOrganize
            :model.sync="model.organizeID"
            node-key="id"
            label-key="name"
            :label="$t('interviewer.organizeNodes')"
            lazy-rules
            :rules="[val => (val && val.length > 0) || '请选择需求部门']"
          />
          <q-select
            filled
            v-model="model.jobID"
            :class="
              $q.screen.gt.sm ? 'col-4 q-pr-sm q-py-none' : 'col-6 q-pr-sm'
            "
            clearable
            emit-value
            use-input
            map-options
            :options="jobOptions"
            @filter="filterJobOption"
            :label="$t('interviewer.jobApplication')"
          />
          <q-input
            filled
            v-model="model.city"
            :class="$q.screen.gt.sm ? 'col-2 q-pr-sm q-py-none' : 'col-3'"
            :label="$t('interviewer.city')"
            lazy-rules
            :rules="[val => (val && val.length > 0) || '请选择面试地点']"
          />
        </div>
        <div class="row col items-center" v-if="!isEdit">
          <div class="col-6">
            <q-icon name="business" size="xs" />
            {{ model.organizeName }}
          </div>
          <div class="col-4">
            <q-icon name="app:tw-icon-job" size="xs" />
            {{ jobName(model.jobID) }}
          </div>
          <div class="col-2">
            <q-icon name="room" size="xs" />
            {{ model.city }}
          </div>
        </div>
      </q-item-section>
      <q-item-section side v-if="canOp">
        <div class="row" v-if="!isEdit">
          <q-btn dense size="sm" flat icon="edit" @click="isEdit = true" />
          <q-btn
            size="sm"
            dense
            flat
            icon="delete"
            @click="deleteModelList(model)"
          />
        </div>
        <div v-if="$q.screen.gt.sm && isEdit">
          <q-btn size="sm" dense flat icon="done" @click.stop="submit(model)" />
          <q-btn size="sm" dense flat icon="close" @click="cancel" />
        </div>
      </q-item-section>
    </q-item>

    <q-dialog v-if="!$q.screen.gt.sm && isEdit" :value="true" @hide="cancel">
      <q-card>
        <q-card-section>
          <div class="text-h6">面试官面试信息</div>
        </q-card-section>

        <q-card-section class="q-py-none">
          <div class="columns">
            <tw-select-tree
              filled
              emit-value
              :nodes="selectOrganizesTree"
              isOrganize
              :model.sync="model.organizeID"
              node-key="id"
              label-key="name"
              :label="$t('interviewer.organizeNodes')"
              lazy-rules
              :rules="[val => (val && val.length > 0) || '请选择需求部门']"
            />
            <q-select
              filled
              v-model="model.jobID"
              clearable
              emit-value
              use-input
              map-options
              :options="jobOptions"
              @filter="filterJobOption"
              :label="$t('interviewer.jobApplication')"
            />
            <q-input
              class="q-pt-md"
              filled
              v-model="model.city"
              :label="$t('interviewer.city')"
              lazy-rules
              :rules="[val => (val && val.length > 0) || '请选择面试地点']"
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pt-none">
          <q-btn
            label="保存"
            color="primary"
            size="md"
            @click.stop="submit(model)"
          />
          <q-btn label="取消" size="md" @click.stop="cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage } from '@/utils/show-message'
import { LocalStorage } from 'quasar'
export default {
  name: 'interviewerItem',
  props: {
    item: {
      type: Object
    },
    psonID: {
      type: Number
    },
    openType: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      model: _.cloneDeep(this.item),
      jobOptions: [], // 岗位信息
      isEdit: this.openType === 'add', // 控制按钮切换
      jobAllOptions: [], // 所有岗位信息
      oldModel: _.cloneDeep(this.item)
    }
  },
  created () {
    this.loadJobs({
      query: [
        { Key: 'IsPublish', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ],
      byPage: false
    }).then(res => {
      _.forEach(res, (job, key) => {
        this.jobAllOptions.push({
          label: job.title,
          value: job.id
        })
      })
      this.jobOptions = this.jobAllOptions
    })
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree', 'selectOrganizes']),
    ...mapGetters('person', ['selectPersonsFiltered']),
    jobName () {
      return function (jobID) {
        if (this.jobOptions.length > 0) {
          return _.filter(this.jobOptions, job => job.value === jobID)[0].label
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
  methods: {
    ...mapActions('job', ['loadJobs']),
    ...mapActions('interviewer', [
      'addInterviewer',
      'loadInterviewers',
      'updateInterviewer',
      'deleteInterviewer',
      'syncInterviewerRoleByPsonID'
    ]),
    submit (val) {
      this.isEdit = false
      this.updateInfo(val)
      this.$emit('end')
      this.$emit('changeIsFristEnter')
    },
    // 添加/编辑方法
    updateInfo (val) {
      // 添加面试官下面试信息
      val.psonID = this.psonID
      // 获取面试官姓名
      val.psonName = _.filter(
        this.selectPersonsFiltered,
        per => per.id === val.psonID
      )[0].name

      // 获取岗位名称
      _.forEach(this.jobAllOptions, job => {
        if (val.jobID === job.value) {
          val.jobName = job.label
        }
      })
      // 获取机构名称
      val.organizeName = this.selectOrganizes.filter(
        org => org.id === val.organizeID
      )[0].shortName
      // 新增
      if (val.id === 0) {
        this.addInterviewer(val).then(res => {
          if (res) {
            // this.$emit('changeData', res)
            // 更新角色信息
            this.syncInterviewerRoleByPsonID({
              psonId: +this.psonID,
              type: 'grant'
            })
            this.isEdit = false
          } else {
            this.isEdit = true
          }
        })
      } else {
        // 编辑
        this.updateInterviewer(val).then(res => {
          if (res) {
            this.isEdit = false
          } else {
            this.isEdit = true
          }
        })
      }
    },

    // 删除面试官下的面试信息
    deleteModelList (item) {
      showConfirm('确认要删除面试信息？', () => {
        let payload = {
          id: item.id,
          index: this.index,
          psonID: item.psonID
        }
        if (item.id === 0) {
          // 当id为0的时候，此时只是从新增的列表中移除新增加的即可
          this.$emit('changeData', payload)
        } else {
          this.deleteInterviewer(item.id).then(res => {
            // 如果删除面试官下最后一条信息时，同时更新该面试官角色
            this.loadInterviewers({
              query: [{ Key: 'PsonID', Value: this.psonID, Oper: 'eq' }]
            }).then(res => {
              if (res.length === 0) {
                // 删除成功后更新面试官角色成员
                this.syncInterviewerRoleByPsonID({
                  psonId: +this.psonID,
                  type: 'remove'
                })
                // 路由跳转
                this.$router.push({
                  name: 'interviewer'
                })
              }
              showSuccessMessage('删除成功')
            })
          })
        }
      })
    },
    cancel () {
      this.model = _.assign(this.model, this.oldModel)
      this.isEdit = false
      this.$emit('end')
    },
    // 过滤岗位选项
    filterJobOption (val, update) {
      if (val === '') {
        update(() => {
          this.jobOptions = this.jobAllOptions
        })
      } else {
        update(() => {
          let valNew = val.toLowerCase()
          this.jobOptions = this.jobAllOptions.filter(
            v => v.label.toLowerCase().indexOf(valNew) > -1
          )
        })
      }
    }
  },
  components: {
    TwSelectTree: () => import('components/base/TwSelectTree')
  }
}
</script>
