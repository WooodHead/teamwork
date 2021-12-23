<template>
  <q-card-section
    class="q-pt-xl q-gutter-md"
    @click.capture.stop
  >
    <div v-if="!publicContent.questions">
      <div class="text-center title-page">{{question.content}}</div>
      <div
        v-for="index in Object.keys(answersGroup)"
        :key="index"
      >
        <answer-list
          share
          :title="index"
          :answers="answersGroup[index]"
        ></answer-list>
      </div>
    </div>
    <div v-else>
      <div class="text-center title-page">{{$t('checkins.title')}}</div>
      <question-item
        class="q-mb-md"
        v-for="question in questionList"
        :key="question.id"
        :question="question"
        :assignedTo="assignedTos.filter(person => question.assignedTo.includes(person.id))"
      />
    </div>
  </q-card-section>
</template>

<script>
import Person from '@/store/person/model'
import Checkin from '@/store/checkins/model'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PublicQuestion',
  components: {
    QuestionItem: () => import('components/checkins/QuestionItem'),
    'answer-list': () => import('components/checkins/AnswerList')
  },
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions('person', ['loadSelectPersons']),
    ...mapMutations('checkins', ['addQuestions', 'addAnswers', 'setObjectType', 'setObjectID'])
  },
  data () {
    return {
      question: {},
      assignedTos: []
    }
  },
  computed: {
    ...mapGetters('checkins', ['answers', 'questionList']),
    // �����ܡ�����
    answersGroup () {
      if (_.isEmpty(this.question)) {
        return []
      } else {
        return this.$store.getters['checkins/answersGroup'](
          +this.question.id,
          this.question.cron.type
        )
      }
    }
  },
  mounted () {
    // ����ת�ķ���ҳ��û����Ա���ݣ���Ҫ����
    this.loadSelectPersons()
    // �ʴ���ҳ����
    if (_.isArray(this.publicContent.questions)) {
      let list = Checkin.Question.from(this.publicContent.questions)
      this.setObjectType(list[0].objectType)
      this.setObjectID(list[0].objectId)
      this.addQuestions(list)
      this.assignedTos = Person.from(this.publicContent.assignedTo)
    } else {
      // �����������
      let question = Checkin.Question.from(this.publicContent.question)
      let answers = Checkin.Answer.from(this.publicContent.answers)
      this.question = question
      this.addAnswers(answers)
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
