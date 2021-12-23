<!--
 * @Author: your name
 * @Date: 2020-04-18 09:52:32
 * @LastEditTime: 2020-09-02 15:30:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\checkins\AnswerList.vue
-->
<template>
  <div>
    <div class="row items-center">
      <q-separator class="col gradient-right-to-left" />
      <span class="text-h6 text-weight-bold items-center"> {{title}}</span>
      <span
        v-if="questionID"
        :title="progressHint"
        class="text-caption cursor-pointer"
        @click="showNoAnswers = true"
      >
        <q-circular-progress
          class="q-pl-sm"
          :value="progress.value"
          :thickness="1"
          color="green-7"
          track-color="green-4"
          size="md"
        />
        <span> {{progress.text}}</span>
      </span>
      <q-separator class="col gradient-left-to-right" />
    </div>
    <div
      v-for="answer in answers"
      :key="answer.id"
    >
      <q-card-section>
        <answer-card
          :answerID="answer.id"
          class="q-mt-md"
          :share="share"
        />
      </q-card-section>
    </div>
    <q-dialog v-model="showNoAnswers">
      <q-card style="min-width:300px">
        <q-card-section>
          {{$t('answer.whoNotAnswer')}}
        </q-card-section>
        <q-card-section class="q-gutter-xs">
          <span
            v-for="(id,index) in noAnswers"
            :key="index"
          >
            <tw-avatar
              size="md"
              :id="id"
            />
          </span>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AnswerList',
  components: {
    AnswerCard: () => import('components/checkins/AnswerCard'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  data () {
    return {
      showNoAnswers: false
    }
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    answers: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    questionID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    share: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    question () {
      return this.$store.getters['checkins/question'](+this.questionID)
    },
    progress () {
      const list = this.answers.map(item => {
        return item.createByID
      })
      const answers = Array.from(new Set(list))
      if (answers.length >= 0 && this.question.assignedTo && this.question.assignedTo.length >= 0) {
        return {
          text: answers.length + '/' + this.question.assignedTo.length,
          value: 100 * Number(answers.length) / Number(this.question.assignedTo.length)
        }
      } else {
        return {
          text: 0 / 0,
          value: 0
        }
      }
    },
    noAnswers () {
      const list = this.answers.map(item => { return item.createByID })
      return _.difference(this.question.assignedTo, list)
    },
    progressHint () {
      if (this.noAnswers.length === 0) {
        return this.$t('answer.everyoneSubmitAnswer')
      } else {
        return this.$t('answer.checkNotAnswerPerson')
      }
    }
  }
}
</script>

<style>
</style>
