<template>
  <q-page>
    <q-card
      :bordered="
    false"
      flat
      class="card-grow q-pa-none"
    >
      <q-card-section
        :class="{'module-content':!$q.screen.lt.md}"
        class="q-pa-none"
      >
        <!-- 菜单 -->
        <tw-header-detail
          v-if="$q.screen.lt.sm"
          title="精雕招聘"
        >
        </tw-header-detail>
        <!-- 招聘系统主要功能入口区域 -->
        <div
          class="q-py-lg row justify-center"
          :class="$q.screen.lt.sm?'q-gutter-md':'q-gutter-lg'"
        >
          <q-btn
            v-for="link in quickLinksCanSee"
            :key="link.name"
            stack
            flat
            :color="link.name!=='resume'&&!disableBtn?'grey-5':link.color"
            :icon="link.icon"
            :label="link.label"
            :to="link.to"
            :size="$q.screen.lt.sm?'md':'lg'"
            class="q-py-xs"
            :disable="link.name!=='resume'&&!disableBtn"
          />
        </div>
        <div class="q-pa-sm">
          <!-- 无查询结果提示 -->
          <tw-banner-no-result v-if="!isLoading&&!hasResumes" />
          <!-- 数据加载中提示 -->
          <div
            v-if="isLoading"
            class="text-center q-py-sm"
          >
            <q-spinner-dots
              color="primary"
              size="2em"
            />
          </div>
          <!-- 图表区域 -->
          <tw-dashboard
            category="resume"
            :conditionNeedMap="true"
            @down="onDataLoaded"
          />
        </div>
        <tw-page-scroller />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { i18n } from '@/boot/i18n'
import { LocalStorage } from 'quasar'
export default {
  name: 'Home',
  data () {
    return {
      quickLinksCanSee: [{
        name: 'resume',
        to: { name: 'resume' },
        icon: 'app:tw-icon-resume',
        color: 'blue-10',
        label: i18n.t('recruitment.modules.resumeManage'),
        notes: ''
      },
      {
        name: 'job',
        to: { name: 'job' },
        icon: 'app:tw-icon-job',
        color: 'blue-10',
        label: i18n.t('recruitment.modules.jobManage'),
        notes: ''
      },
      {
        name: 'recruit-plan',
        to: { name: 'recruitPlan' },
        icon: 'app:tw-icon-recruit-plan',
        color: 'blue-10',
        label: i18n.t('recruitment.modules.recruitPlan'),
        notes: ''
      },
      {
        name: 'interviewer',
        to: { name: 'interviewer' },
        icon: 'app:tw-icon-interviewer',
        color: 'blue-10',
        label: i18n.t('recruitment.modules.interviewerManage'),
        notes: ''
      },
      {
        name: 'recommend-code',
        to: { name: 'recommendCode' },
        icon: 'app:tw-icon-recommend-code',
        color: 'blue-10',
        label: i18n.t('recruitment.modules.recommendCodeManage'),
        notes: ''
      }],
      conditionModel: {
        planids: [],
        jobids: [],
        // organizeids: [],
        citys: [],
        startDate: new Date().getFullYear() + '-' + '01' + '-' + '01',
        endDate: '',
        schools: []
      },
      hasResumes: false,
      isLoading: true
    }
  },
  components: {
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwDashboard: () => import('components/base/dashboard/TwDashboard'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  },
  methods: {
    onDataLoaded (board) {
      this.hasResumes = board
      this.isLoading = false
    }
  },
  computed: {
    // HR、高级管理员、系统管理员可进入岗位管理、招聘计划管理、面试官管理、推荐码管理，其中高级管理员仅具有查看权限
    disableBtn () {
      return _.find(LocalStorage.getItem('myself').roles, { code: 'HRSpecialist' }) || _.find(LocalStorage.getItem('myself').roles, { code: 'SeniorManager' }) || _.find(LocalStorage.getItem('myself').roles, { code: 'SystemAdministrator' })
    }
  }
}
</script>

<style lang='scss' scoped>
.card-grow {
  width: 100%;
  flex-grow: 1;
}

.module-content {
  max-width: 80vw;
  margin: 0 auto;
}
</style>
