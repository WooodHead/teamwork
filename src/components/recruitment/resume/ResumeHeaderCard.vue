<!-- 简历列表header -->
<template>
  <div>
    <tw-header-card :title="$t('resume.module')" :actions="['menu']">
      <template v-slot:menu>
        <tw-menu
          :menus="menus"
          :class="{'invisible':menus.length === 0}"
          @recruitListExport="onRecruitListExport()"
          @recruitListImportTestResult="onRecruitListImportTestResult()"
          @recruitListStartInvite="onRecruitListStartInvite()"
          @recruitListSendOffer="onRecruitListSendOffer()"
          @recruitListStorageAll="onRecruitListStorageAll()"
        />
      </template>
    </tw-header-card>
    <!-- 导出excel模板弹窗 -->
    <q-dialog v-model="showExportDialog">
      <resume-dialog-export />
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'ResumeHeaderCard',
  inject: ['refreshResumeList'],
  data () {
    return {
      showExportDialog: false
    }
  },
  computed: {
    ...mapGetters('resume', ['resumeViews', 'resumeViewQuerys', 'listMenus']),
    menus () {
      if (this.resumeViews.length > 0) {
        return this.listMenus
      } else {
        return []
      }
    }
  },
  methods: {
    ...mapActions('resume', ['StorageResumes']),
    onRecruitListExport () {
      this.showExportDialog = true
    },
    onRecruitListImportTestResult () {
      this.$router.push({
        name: 'resumeTestResult'
      })
    },
    onRecruitListStartInvite () {
      this.$router.push({
        name: 'resumeInvite',
        params: {
          resumeDeliveryID: 'all'
        }
      })
    },
    onRecruitListSendOffer () {
      this.$router.push({
        name: 'resumeSendOffer',
        params: {
          resumeDeliveryID: 'all'
        }
      })
    },
    onRecruitListStorageAll () {
      showConfirm('系统会自动通知应聘者，确认将列表中的简历全部淘汰入库吗？',
        () => {
          this.StorageResumes(this.resumeViewQuerys)
            .then(res => {
              res && showSuccessMessage(this.$t('resume.actionSucceed'))
              this.refreshResumeList()
            })
        },
        () => { })
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResumeDialogExport: () => import('components/recruitment/resume/ResumeDialogExport')
  }
}

</script>

<style lang='scss' scoped>
</style>
