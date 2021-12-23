<!-- 简历管理模块底部按钮 -->
<template>
  <q-page-sticky
    expand
    position="bottom"
  >
    <q-toolbar class="tw-resume-footer justify-center bg-transparent q-pa-sm q-gutter-sm">
      <!-------------------------------- 按钮区域 -------------------------------->
      <!-- 全部淘汰入库 -->
      <q-btn
        v-show="showStorageAllBtn"
        no-caps
        color="white"
        text-color="primary"
        class="text-weight-regular"
        :label="$t('resume.actions.notMatchAll')"
        @click="showStorageAllDialog=true"
      />
      <!-- 导出信息 -->
      <q-btn
        no-caps
        color="white"
        text-color="primary"
        class="text-weight-regular"
        :label="$t('resume.actions.exportResumeInfo')"
        @click="showExportDialog=true"
      />
      <!-- 导入测评结果 -->
      <q-btn
        v-show="selectedStatus==='waitTest' && this.isHrOrAdmin"
        no-caps
        color="primary"
        class="text-weight-regular"
        label="导入测评结果"
        @click="onImport()"
      />
      <!-- 发起邀约 -->
      <q-btn
        v-show="selectedStatus==='waitInvite' && this.isHrOrAdmin"
        no-caps
        color="primary"
        class="text-weight-regular"
        :label="$t('resume.actions.nextStep.' + selectedStatus)"
        @click="onStartInvite()"
      />
      <!-- 发放 offer -->
      <q-btn
        v-show="selectedStatus==='waitOffer' && this.isHrOrAdmin"
        no-caps
        color="primary"
        class="text-weight-regular"
        :label="$t('resume.actions.nextStep.' + selectedStatus)"
        @click="onSendOffer()"
      />
      <!-------------------------------- 弹窗区域 -------------------------------->
      <!-- 导出excel模板弹窗 -->
      <q-dialog v-model="showExportDialog">
        <resume-dialog-export />
      </q-dialog>
      <!-- 全部淘汰入库弹窗 -->
      <q-dialog v-model="showStorageAllDialog">
        <resume-dialog-storage-all />
      </q-dialog>
    </q-toolbar>
  </q-page-sticky>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ResumeFooter',
  data () {
    return {
      showExportDialog: false,
      showStorageAllDialog: false,
      endStatus: this.$store.state.resume.endStatus
    }
  },
  computed: {
    ...mapState('resume', ['statusCount']),
    ...mapGetters('resume', ['resumeViews', 'isInterviewer', 'isHrOrAdmin']),
    selectedStatus () {
      return this.$store.state.resume.selectedStatus
    },
    showStorageAllBtn () {
      if (this.isHrOrAdmin) {
        return true
      } else {
        return [
          'waitScreening',
          'waitInterview'
        ].includes(this.selectedStatus)
      }
    }
  },
  methods: {
    // 导入测评结果
    onImport () {
      this.$router.push({
        name: 'resumeTestResult'
      })
    },
    // 发起邀约
    onStartInvite () {
      this.$router.push({
        name: 'resumeInvite',
        params: {
          resumeDeliveryID: 'all'
        }
      })
    },
    // 发offer
    onSendOffer () {
      this.$router.push({
        name: 'resumeSendOffer',
        params: {
          resumeDeliveryID: 'all'
        }
      })
    }
  },
  components: {
    ResumeDialogExport: () => import('components/recruitment/resume/ResumeDialogExport'),
    ResumeDialogStorageAll: () => import('components/recruitment/resume/ResumeDialogStorageAll')
  }
}

</script>

<style lang='scss' scoped>
</style>
