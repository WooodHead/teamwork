<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 页面header -->
    <tw-header-card :title="$t('archive.someArchived',{count:archiveList.length,something:$t('question.title')})">
    </tw-header-card>
    <!-- 归档问题 -->
    <q-card-section class="q-px-xxl">
      <div v-if="archiveList.length>0">
        <div
          v-for="question in archiveList"
          :key="question.id"
          @click.capture.stop="toQuestionDetail(+question.id)"
        >
          <question-card :question="question" />
        </div>
      </div>
      <tw-banner-no-result v-else />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ArchivedQuestions',
  props: {
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      default: '',
      required: 0
    }
  },
  components: {
    'question-card': () => import('components/checkins/QuestionCard'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  computed: {
    ...mapGetters('checkins', ['archiveList'])
  },
  methods: {
    ...mapActions('checkins', ['loadQuestionList']),
    // 跳转任务详情页
    toQuestionDetail (id) {
      this.$router.push({
        name: 'questionDetail',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +id
        }
      })
    }
  },
  mounted () {
    // 刷新时加载任务清单
    this.loadQuestionList({
      objectType: this.category,
      objectID: +this.objectID
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
