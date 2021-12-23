<template>
  <div
    class="cursor-pointer"
    @click="toQuestion"
  >
    <question-item
      v-for="question in lists"
      :key="question.id"
      :question="question"
    />
    <div v-if="param.id">
      <div
        v-for="answer in answers"
        :key="answer.id"
      >
        <b>{{answer.createBy}}:</b> {{htmlToText(answer.content)}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'QuestionIntro',
  props: {
    param: {
      type: Object,
      required: true,
      default: function () {
        return {
          id: 0,
          objectID: 0,
          objectType: ''
        }
      }
    }
  },
  components: {
    QuestionItem: () => import('components/checkins/QuestionItem')
  },
  methods: {
    htmlToText,
    ...mapActions('checkins', ['loadQuestion', 'loadAnswersOfQuestion', 'loadQuestionList']),
    toQuestion () {
      if (this.param.id) {
        this.$router.push({
          name: 'questionDetail',
          params: { category: this.param.objectType, objectID: this.param.objectID, id: +this.param.id }
        })
      } else {
        this.$router.push({
          name: 'checkins',
          params: { category: this.param.objectType, objectID: this.param.objectID }
        })
      }
    }
  },
  computed: {
    ...mapGetters('checkins', ['questionList']),
    question () {
      if (this.param.id) {
        return this.$store.getters['checkins/question'](+this.param.id)
      } else {
        return []
      }
    },
    lists () {
      if (this.param.id) {
        return [this.question]
      } else {
        return this.questionList
      }
    },
    answers () {
      if (this.param.id) {
        return this.$store.getters['checkins/answers'](+this.param.id)
      } else {
        return []
      }
    }
  },
  mounted () {
    if (this.param.id) {
      this.loadQuestion(+this.param.id)
      this.loadAnswersOfQuestion(+this.param.id)
    } else {
      this.loadQuestionList({
        objectType: this.param.objectType,
        objectID: +this.param.objectID
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
