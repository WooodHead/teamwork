<template>
  <q-card
    flat
    bordered
    class="cursor-pointer q-mb-md base-card"
  >
    <q-card-section class="position-relative q-pa-sm full-height">
      <div
        class="flex q-gutter-x-sm full-height"
        @click="openForm"
      >
        <!-- 头像、姓名 -->
        <div
          class="col-auto column items-center full-height"
          style="width: 90px;"
        >
          <!-- <tw-avatar :id="model.psonID" /> -->
          <q-img
            :src="image"
            contain
            spinner-color="primary"
            spinner-size="82px"
          />
          <div class="text-primary1 text-weight-bold q-mt-xs">
            {{ person.name }}
          </div>
        </div>
        <div class="col">
          <!-- 投递岗位, 分数 -->
          <div class="relative-position q-mr-xl text-text1">
            <p class="q-my-none q-mb-xs text-body-g text-weight-bold">
              <span>部门：</span><span>{{ organizeName }}</span>
            </p>
            <p class="q-my-none q-mb-xs text-body-g text-weight-bold">
              <span>地点：</span><span>{{ citys.join("、") }}</span>
            </p>
            <div class="q-my-none text-body-g">
              <span class="text-weight-bold">面试岗位：</span>
              <br />
              <div v-if="jobs.length < 6">
                <span
                  v-for="(t, index) in jobs"
                  :key="index"
                  class="text-text2"
                >
                  {{ jobName(t) }}<br />
                </span>
              </div>
              <div v-else>
                <span
                  v-for="(t, index) in jobs.slice(0, 4)"
                  :key="index"
                  class="text-text2"
                >{{ jobName(t) }}<br /></span>
                <div
                  class="q-my-none text-primary1"
                  @click="showTip = !showTip"
                >
                  更多...
                  <q-tooltip
                    v-model="showTip"
                    :anchor="$q.screen.gt.sm ? 'center middle' : 'center right'"
                    self="center middle"
                  >
                    <span
                      v-for="(t, index) in jobs"
                      :key="index"
                    >{{ jobName(t) }}<br /></span>
                  </q-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 卡片右侧区域 -->
      <div
        class="absolute-top-right q-pa-sm"
        v-if="canOp"
      >
        <!-- 更多 -->
        <q-btn
          round
          flat
          dense
          icon="more_horiz"
        >
          <q-menu
            auto-close
            transition-show="scale"
            transition-hide="scale"
          >
            <div class="column">
              <q-btn
                label="编辑"
                flat
                @click.stop="openForm"
              />
              <q-btn
                label="删除"
                flat
                @click.stop="onDelete"
              />
            </div>
          </q-menu>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getUrl } from '@/boot/file'
import { showConfirm } from '@/utils/show-confirm'
import { LocalStorage } from 'quasar'
export default {
  name: 'InterviewerCard',
  props: {
    model: {
      type: Object
    },
    jobLists: {
      type: Array
    }
  },
  inject: ['reload'],
  data () {
    return {
      num: 0, // 记录循环删除次数
      showTip: false,
      citys: [], // 面试城市集合
      jobs: [], // 面试岗位集合
      organizes: [] // 面试需求部门集合
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapGetters('interviewer', ['interviewers']),
    person () {
      return this.selectPersons[this.model.psonID] || {}
    },
    image () {
      return this.person && this.person.img
        ? getUrl(this.person.img)
        : 'icons/default-profile.png'
    },
    organizeName () {
      let organizeName = ''
      _.forEach(this.organizes, (item, index) => {
        organizeName += `${index ? '、' : ''}${item}`
      })
      return organizeName
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
    getUrl,
    ...mapActions('interviewer', [
      'byIdDeleteInterviewer',
      'syncInterviewerRoleByPsonID'
    ]),
    // 打开编辑表单
    openForm () {
      this.$router.push({
        name: 'interviewerEdit',
        params: {
          psonID: this.model.psonID
        }
      })
    },
    // 删除
    onDelete () {
      showConfirm('确认要删除该面试官？', () => {
        this.byIdDeleteInterviewer(this.model.psonID).then(res => {
          // 删除成功后更新面试官角色成员
          this.syncInterviewerRoleByPsonID({
            psonId: +this.model.psonID,
            type: 'remove'
          })
          // 刷新列表
          this.reload()
        })
      })
    },
    // 初始化
    init () {
      if (this.model.objList.length > 0) {
        _.forEach(this.model.objList, res => {
          // 面试城市
          this.citys.push(res.city)
          this.citys = _.uniq(this.citys)
          // 面试岗位
          this.jobs.push(res.jobID)
          this.jobs = _.uniq(this.jobs)
          // 需求部门
          this.organizes.push(res.organizeName)
          this.organizes = _.uniq(this.organizes)
        })
      }
    }
  }
}
</script>

<style scoped>
.interviewer-card {
  position: relative;
  height: 100%;
  padding-bottom: 50px;
}
.btn_relative {
  position: absolute;
  right: 10px;
  bottom: 0px;
}
</style>
