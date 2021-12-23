<template>
  <q-card
    class="card-grow-in-page q-pb-lg"
    :style="{'position:relative':!$q.screen.lt.sm}"
    :flat="$q.screen.lt.sm"
  >
    <!-- 菜单 -->
    <tw-header-detail
      :noMenu="!canOp||model.archived"
      title="岗位详情"
    >
      <template #menu>
        <tw-menu
          :class="{'invisible':model.archived}"
          v-if="canOp&&!model.archived"
          :menus="menuList"
          @edit="jobEdit"
          @archive="jobArchive"
          @delete="jobDelete"
        />
      </template>
    </tw-header-detail>
    <!-- 归档说明区 -->
    <q-card-section
      v-if="model.archived&&canOp"
      class="q-px-xxl"
    >
      <tw-archive-notes
        :id="model.id"
        type="job"
        :label="$t('job.title')"
        :archiveTime="model.archiveTime"
        :archiveBy="model.archiveBy"
        @unarchive="jobUnarchive"
      />
    </q-card-section>
    <q-card-section class="q-gutter-md q-px-xxl">
      <div>
        <div>
          <span class="text-h4 text-grey-8 text-bold">{{model.title}}</span>
          <span class="text-body1 text-grey-6 q-pl-lg">{{model.category}}</span>
        </div>
        <div class="row text-grey-7 q-gutter-md q-pt-sm">
          <span>{{model.workingYears}}</span>
          <span>|</span>
          <span>{{model.educationDegree}}</span>
          <span>|</span>
          <span>{{$t(`job.kind${model.kind}`)}}</span>
        </div>
      </div>
      <q-separator />
      <div class="text-grey-7 q-gutter-md text-body1 q-ml-none">
        <div class="row">
          <div class="col-auto text-bold">{{$t('job.major')}}：</div>
          <div class="col">{{model.major}}</div>
        </div>
        <div class="row">
          <div class="col-auto text-bold">{{$t('job.hiringNumber')}}：</div>
          <div class="col">{{model.num}}</div>
        </div>
        <div class="row">
          <div class="col-auto text-bold">{{$t('job.address')}}：</div>
          <div class="col">{{model.citys}}</div>
        </div>
        <div class="row">
          <div class="col-auto text-bold">{{$t('job.requirements')}}：</div>
          <div class="col">
            <div
              class="wrapper"
              v-html="model.requirements"
            ></div>
          </div>
        </div>
        <div class="row">
          <div class="col-auto text-bold">{{$t('job.detailRequirements')}}：</div>
          <div class="col">
            <div
              class="wrapper"
              v-html="model.detailRequirements"
            ></div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Job from '@/store/job/model'
import { showConfirm } from '@/utils/show-confirm'
import { LocalStorage } from 'quasar'
export default {
  name: 'JobDetail',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      model: new Job(),
      menuList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb', 'pushWidgetBreadcrumb', 'clearBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapActions('job', ['loadJob', 'archiveJob', 'deleteJob']),
    // 编辑岗位
    jobEdit () {
      let that = this
      that.$router.push({
        name: 'jobEdit',
        params: {
          openType: 'edit',
          id: that.model.id
        }
      })
    },
    // 归档岗位
    jobArchive () {
      let that = this
      that.archiveJob(that.model.id).then(res => {
        if (res) {
          that.model = res
          that.initBreadcrumb()
        }
      })
    },
    // 解档岗位
    jobUnarchive (id) {
      this.init()
    },
    // 删除岗位
    jobDelete () {
      let that = this
      showConfirm(that.$t('action.reallyDelete'), () => {
        that.deleteJob(that.model.id)
      })
    },
    // 初始化
    init () {
      let that = this
      that.loadJob(+that.id).then(res => {
        // 页面数据
        that.model = res
        that.initBreadcrumb()
        that.initMenuList()
      })
    },
    // 初始化菜单按钮
    initMenuList () {
      let that = this
      let menuList = ['edit']
      if (that.model.citys === '暂无') {
        if (that.model.isPublish === 1) {
          menuList.push('archive')
        }
        menuList.push('delete')
      }
      that.menuList = menuList
    },
    // 面包屑处理
    initBreadcrumb () {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushWidgetBreadcrumb({
        id: `jobList`,
        title: this.$t('job.module'),
        to: {
          name: 'job'
        }
      })
      this.model.isPublish === 0 && this.pushWidgetBreadcrumb({
        id: `draftJobs`,
        title: '草稿箱',
        to: {
          name: 'draftJobs'
        }
      })
      this.model.archived && this.pushWidgetBreadcrumb({
        id: `archivedJobs`,
        title: '归档箱',
        to: {
          name: 'archivedJobs'
        }
      })
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.init()
      }
    }
  },
  computed: {
    // HR、系统管理员具有操作权限
    canOp () {
      return !!((_.find(LocalStorage.getItem('myself').roles, { code: 'HRSpecialist' }) || _.find(LocalStorage.getItem('myself').roles, { code: 'SystemAdministrator' })))
    }
  },
  components: {
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  white-space: pre-wrap;
}
</style>
