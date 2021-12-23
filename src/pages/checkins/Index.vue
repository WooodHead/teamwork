<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: {
    category: {
      type: String,
      required: false,
      default: undefined
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: function () {
        return this.$q.localStorage.getItem('myself').id
      }
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    }
  },
  watch: {
    resource: {
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
      },
      immediate: true,
      deep: true
    },
    $route: {
      immediate: true,
      deep: true,
      async handler (route) {
        if (this.$q.platform.is.mobile) return
        if (!route.path.includes('checkins')) return
        // checkins主页面包屑
        route.name !== 'checkins'
          ? this.pushWidgetBreadcrumb({
            id: `${this.category}${this.objectID}CheckinsIndex`,
            title: this.widgets.checkins.label,
            to: {
              name: 'checkins',
              params: { category: this.category, objectID: +this.objectID }
            }
          })
          : this.clearWidgetBreadcrumbs()

        const questionID = +route.params.questionID || route.params.id
        if (!questionID) {
          this.deleteAfterWidgetBreadcrumbs(`${this.category}${this.objectID}CheckinsIndex`)
          this.deleteWidgetBreadcrumb(`${this.category}${this.objectID}CheckinsIndex`)
          return
        }
        const question = await this.loadQuestion(questionID)
        // 归档区面包屑
        route.params.questionID && question.archived
          ? this.pushWidgetBreadcrumb({
            id: 'archivedQuestions',
            title: this.$t('checkins.archived'),
            to: {
              name: 'archivedQuestions',
              params: {
                category: this.category,
                objectID: +this.objectID
              }
            }
          })
          : this.deleteWidgetBreadcrumb('archivedQuestions')

        // 问题实例的面包屑
        route.name !== 'question' && questionID &&
          this.pushWidgetBreadcrumb({
            id: `question${questionID}`,
            title: question.content,
            to: {
              name: 'questionDetail',
              params: {
                category: this.category,
                objectID: +this.objectID,
                id: +questionID
              }
            }
          })
        const answerID = +route.params.answerID ||
          (route.path.split('/').includes('answer') ? route.params.id : 0)
        if (!answerID && !['selectAnswerPersons', 'allAnswers'].includes(route.name)) {
          this.deleteAfterWidgetBreadcrumbs(`question${questionID}`)
          this.deleteWidgetBreadcrumb(`question${questionID}`)
          return
        }
        // 回答实例的面包屑
        route.name !== 'answer' && answerID &&
          this.pushWidgetBreadcrumb({
            id: `answer${answerID}`,
            title: `回答：${question.content}`,
            to: {
              name: 'answer',
              params: {
                category: this.category,
                objectID: +this.objectID,
                questionID: +questionID,
                answerID: +answerID
              }
            }
          })
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', [
      'clearWidgetBreadcrumbs',
      'pushWidgetBreadcrumb',
      'deleteWidgetBreadcrumb',
      'deleteAfterWidgetBreadcrumbs'])
  }
}
</script>

<style>
</style>
