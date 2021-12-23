<template>
  <q-card
    class="card-grow-in-page q-px-xxl"
    :class="$q.platform.is.desktop?'q-pa-md ':'q-pt-md'"
    clickable
  >
    <q-card-section>
      <div class="text-subtitle2">
        {{question.cronName}}
      </div>
      <div class="text-h5 text-weight-bolder">{{question.content}}</div>
    </q-card-section>
    <q-card-section>
      <answer-form
        :category="category"
        :objectID="objectID"
        :questionID="questionID"
        :answerID="answerID"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    questionID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    answerID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  components: {
    AnswerForm: () => import('components/checkins/AnswerForm')
  },

  methods: {
    ...mapActions('checkins', ['loadQuestion'])
  },
  computed: {
    question () {
      return this.$store.getters['checkins/question'](+this.questionID)
    }
  },
  mounted () {
    this.loadQuestion(+this.questionID)
  }
}
</script>
<style scoped>
.card-grow-in-page .state {
  text-decoration: underline;
  cursor: pointer;
}
</style>
