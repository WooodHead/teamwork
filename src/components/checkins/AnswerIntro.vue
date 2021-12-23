<!--
 * @Author: your name
 * @Date: 2020-05-28 14:00:08
 * @LastEditTime: 2020-08-01 09:14:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\checkins\AnswerIntro.vue
-->
<template>
  <div>
    <div class="text-weight-bold q-mb-sm">{{question.content}}</div>
    <div v-if="param.id" >
      <b>{{answer.createBy}}：</b>{{htmlToText(answer.content)}}
    </div>
    <div
      v-else
      v-for="answer in answersOfPerson"
      :key="answer.id"
      class="q-mb-xs"
    >
      <b>{{answer.createBy}}:</b>{{htmlToText(answer.content)}}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'AnswerIntro',
  props: {
    param: {
      type: Object,
      required: true,
      default: function () {
        return {
          id: 0,
          personID: 0,
          questionID: 0
        }
      }
    }
  },
  methods: {
    htmlToText,
    ...mapActions('checkins', ['loadAnswer', 'loadQuestion', 'loadAnswersOfPerson'])
  },
  computed: {
    ...mapGetters('checkins', ['answers']),
    answer () {
      return this.$store.getters['checkins/answer'](+this.param.id)
    },
    question () {
      if (this.param.questionID) {
        return this.$store.getters['checkins/question'](+this.param.questionID)
      } else {
        return this.$store.getters['checkins/question'](+this.answer.questionID)
      }
    },
    answersOfPerson () {
      return this.$store.getters['checkins/answersOfPerson'](+this.param.questionID, +this.param.personID)
    }
  },
  mounted () {
    if (this.param.id) {
      this.loadAnswer(+this.param.id).then(res => {
        this.loadQuestion(+res.questionID)
      })
    } else {
      this.loadQuestion(+this.param.questionID)
      this.loadAnswersOfPerson({ questionID: +this.param.questionID, personID: +this.param.personID })
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
