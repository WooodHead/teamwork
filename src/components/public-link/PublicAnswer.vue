<template>
  <q-card-section
    class="q-pt-xl q-gutter-md"
    @click.capture.stop
  >
    <div class="text-center title-page">{{question.content}}</div>
    <div
      class="answer"
      v-if="!publicContent.answers"
    >
      <answer
        share
        :publicContent="publicContent"
      />
    </div>
    <div
      v-else
      v-for="index in Object.keys(answersGroup)"
      :key="index"
    >
      <tw-separator>
        <div class="text-h6 text-weight-bold">
          {{index}}
        </div>
      </tw-separator>
      <div
        v-for="answer in answersGroup[index]"
        :key="answer.id"
      >
        <q-card-section>
          <answer
            share
            class="q-mt-md"
            :publicContent="{
              person: publicContent.person,
              question: publicContent.question,
              answer: answer
            }"
          ></answer>
        </q-card-section>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapMutations } from 'vuex'
import Checkin from '@/store/checkins/model'
export default {
  name: 'PublicAnswer',
  components: {
    'answer': () => import('components/checkins/AnswerCard'),
    'tw-separator': () => import('components/base/TwSeparator')
  },
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapMutations('checkins', ['addAnswers', 'addQuestions'])
  },
  computed: {
    question () {
      return this.$store.getters['checkins/question'](+this.publicContent.question.Id)
    },
    answer () {
      if (!this.publicContent.answers) {
        return this.$store.getters['checkins/answer'](+this.publicContent.answer.Id)
      } else {
        return {}
      }
    },
    answersGroup () {
      if (this.publicContent.answers) {
        return this.$store.getters['checkins/answersOfPersonGroup'](+this.publicContent.question.Id, +this.publicContent.person.PsonID, this.question.cron.type)
      } else {
        return []
      }
    }
  },
  mounted () {
    this.addQuestions([Checkin.Question.from(this.publicContent.question)])
    if (this.publicContent.answers) {
      this.addAnswers(Checkin.Answer.from(this.publicContent.answers))
    } else {
      this.addAnswers([Checkin.Answer.from(this.publicContent.answer)])
    }
  }
}
</script>

<style scoped>
.title-page {
  font-size: 28px;
  font-weight: 700;
}
</style>
