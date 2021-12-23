<!-- 全部入库弹窗 -->
<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">系统会自动通知应聘者，确认将列表中的简历全部淘汰入库吗？</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        color="primary"
        label="全部淘汰入库"
        class="text-bold"
        @click="storageAll()"
        v-close-popup
      />
      <q-btn
        color="primary"
        type="reset"
        class="q-ml-sm"
        :label="$t('action.cancel')"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { showSuccessMessage } from '@/utils/show-message'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ResumeDialogStorageAll',
  inject: ['refreshResumeList'],
  computed: {
    ...mapState('resume', ['selectedStatus']),
    ...mapGetters('resume', ['resumeViews', 'resumeViewQuerys']),
    search () {
      return this.$store.getters['resume/search']
    },
    query () {
      return this.$store.getters['resume/query']
    }
  },
  methods: {
    ...mapActions('resume', ['StorageResumes']),
    storageAll () {
      this.StorageResumes(this.resumeViewQuerys)
        .then(res => {
          res && showSuccessMessage(this.$t('resume.actionSucceed'))
          this.refreshResumeList()
        })
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
