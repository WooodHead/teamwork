<template>
  <q-card
    class="card-grow-in-page q-px-xxl"
    :flat="$q.screen.lt.sm"
  >
    <q-card-section class="row">
      <div class="text-h6">招聘需求信息</div>
      <q-space />
      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <tw-select-tree
        filled
        emit-value
        :nodes="selectOrganizesTree"
        isOrganize
        :model.sync="model.organizeID"
        node-key="id"
        label-key="name"
        :label="$t('interviewer.need.organizeNodes')"
        lazy-rules
        :rules="[val => (val && val.length > 0) || '请选择需求部门']"
      />
      <q-select
        filled
        v-model="model.jobName"
        use-input
        input-debounce="0"
        :options="jobDatas"
        @filter="filterFn"
        :label="$t('interviewer.need.jobApplication')"
        lazy-rules
        :rules="[val => (val && val.length > 0) || '请选择需求岗位']"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              无该面试岗位
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        filled
        v-model="model.city"
        :label="$t('interviewer.need.city')"
        lazy-rules
        :rules="[val => (val && val.length > 0) || '请输入需求地点']"
      />
      <q-input
        filled
        v-model="model.num"
        type="number"
        :label="$t('interviewer.need.num')"
      />
    </q-card-section>
    <q-card-actions :align="needID === 0 ? 'right' : 'center'">
      <q-btn
        v-if="needID === 0"
        label="保存并继续添加"
        color="primary"
        @click="isContinue"
      />
      <q-btn
        label="保存"
        color="primary"
        outline
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import RecruitPlanNeed from '@/store/recruit-plan-need/model'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'recruitPlanNeedForm',
  props: {
    // 招聘计划详情id
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    needID: {
      type: [Number, String]
    }
  },
  data () {
    return {
      jobDatas: [], // 岗位列表
      oldJobDatas: [],
      jobObjDatas: [], // 岗位对象列表
      model: new RecruitPlanNeed(), // 招聘计划需求对象
      oldModel: {}
    }
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizesTree', 'selectOrganizes']),
    ...mapGetters('job', ['jobs'])
  },
  mounted () {
    // 获取已发布、未归档、未删除的岗位信息
    this.loadJobs({
      query: [
        { Key: 'IsPublish', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ],
      byPage: false
    }).then(res => {
      _.forEach(res, job => {
        let payload = {
          id: job.id,
          title: job.title
        }
        this.jobObjDatas.push(payload)
        this.jobDatas.push(job.title)
        this.oldJobDatas.push(job.title)
      })
      // 初始化编辑数据
      if (this.needID !== 0) {
        this.loadRecruitPlanNeed(this.needID).then(recruit => {
          this.model = recruit
          this.oldModel = Object.assign({}, recruit)
          this.model.jobName = _.filter(res, job => job.id === recruit.jobID)[0].title
        })
      }
    })
  },
  inject: ['reload'],
  methods: {
    ...mapActions('job', ['loadJobs']),
    ...mapActions('organize', ['loadOrganizes']),
    ...mapActions('recruitPlanNeed', [
      'loadRecruitPlanNeeds',
      'loadRecruitPlanNeed',
      'addRecruitPlanNeed',
      'updateRecruitPlanNeed'
    ]),
    // 提交
    onSubmit () {
      this.model.planID = Number(this.id)
      // 获取岗位id
      _.forEach(this.jobObjDatas, job => {
        if (this.model.jobName === job.title) {
          this.model.jobID = job.id
        }
      })
      // 获取机构名称
      _.forEach(this.selectOrganizes, org => {
        if (this.model.organizeID === org.id) {
          this.model.organizeName = org.name
        }
      })
      // 添加
      if (this.model.id === 0) {
        this.addRecruitPlanNeed(this.model).then(res => {
          if (res.id > 0) {
            this.$emit('changeStatu')
            this.reload()
          }
        })
      } else {
        // 编辑
        this.updateRecruitPlanNeed(this.model).then(res => {
          if (res) {
            this.model = res
            this.$emit('changeStatu')
            this.reload()
          } else {
            this.model = this.oldModel
          }
        })
      }
    },
    // 保存并继续添加
    isContinue () {
      this.model.planID = Number(this.id)
      this.loadRecruitPlanNeeds({
        query: [
          { Key: 'PlanID', Value: this.model.planID, Oper: 'eq' }
        ]
      }).then(res => {
        // 获取岗位id
        _.forEach(this.jobObjDatas, job => {
          if (this.model.jobName === job.title) {
            this.model.jobID = job.id
          }
        })
        // 获取机构名称
        _.forEach(this.selectOrganizes, org => {
          if (this.model.organizeID === org.id) {
            this.model.organizeName = org.name
          }
        })
        this.addRecruitPlanNeed(this.model).then(data => {
          if (data) {
            showSuccessMessage('添加成功')
            this.$emit('openPanel', { val: 0 })
          }
        })
      })
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.jobDatas = this.oldJobDatas
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.jobDatas = this.oldJobDatas.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  },
  components: {
    TwSelectTree: () => import('components/base/TwSelectTree')
  }
}
</script>

<style scoped></style>
