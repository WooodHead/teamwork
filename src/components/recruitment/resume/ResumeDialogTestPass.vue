<!-- 测评通过弹窗 -->
<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">确认设置以下筛选条件的所有简历测评通过吗？</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{condition}}
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        color="primary"
        :label="$t('action.confirm')"
        @click="onTestPass()"
        v-close-popup
      />
      <q-btn
        outline
        color="primary"
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
  name: 'ResumeDialogTestPass',
  inject: ['refreshResumeList'],
  data () {
    return {
    }
  },
  computed: {
    ...mapState('resume', ['selectedStatus']),
    ...mapGetters('resume', ['resumeViews', 'resumeViewQuerys']),
    search () {
      return this.$store.getters['resume/search']
    },
    query () {
      return this.$store.getters['resume/query']
    },
    // 当前查询条件
    condition () {
      let temp = []
      // 状态条件
      temp.push(this.$t('resume.status.' + this.selectedStatus))
      // 搜索条件
      if (this.search.length) {
        temp.push(this.search)
      }
      // 多选条件
      if (this.query.length) {
        temp.push(..._.map(this.query, 'label'))
      }
      return temp.join('，')
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('resume', ['passTestExam']),
    onTestPass () {
      this.passTestExam(this.resumeViewQuerys)
        .then(res => {
          if (res) {
            showSuccessMessage(this.$t('resume.actionSucceed'))
            this.refreshResumeList()
          }
        })
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
