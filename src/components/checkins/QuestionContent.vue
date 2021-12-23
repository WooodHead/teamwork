<template>
  <div>
    <q-infinite-scroll
      @load="onLoad"
      :offset="250"
      ref="infiniteScroll"
    >
      <div
        v-for="title in Object.keys(answersGroup)"
        :key="title"
      >
        <answer-list
          :answers="answersGroup[title]"
          :title="title.replace(/-/g, '/')"
          :questionID="id"
        />
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <div
      class="text-center text-grey-5 q-pb-lg"
      v-if="noData && Object.keys(answersGroup).length > 0"
    >
      没有回答了
    </div>
    <tw-separator
      class="q-pa-md"
      v-if="noData && Object.keys(answersGroup).length === 0"
    >
      <div class="text-body1">
        {{$t('answer.noAnswer')}}
      </div>
    </tw-separator>
  </div>

</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: {
    id: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      noData: false
    }
  },
  components: {
    'answer-list': () => import('components/checkins/AnswerList'),
    'tw-separator': () => import('components/base/TwSeparator')
  },
  computed: {
    ...mapState('checkins', ['page']),
    question () {
      return this.$store.getters['checkins/question'](+this.id)
    },
    answersGroup () {
      return this.$store.getters['checkins/answersGroup'](+this.id, this.question.cron.type)
    }
  },
  mounted () {
    this.loadQuestion(+this.id)
    this.onInitAndPull()
  },
  methods: {
    ...mapActions('checkins', ['loadAnswers', 'loadQuestion']),
    ...mapActions('boost', ['loadBoosts']),
    ...mapMutations('checkins', ['addAnswers']),
    init (callBack) {
      this.loadAnswers({
        query: [{ Key: 'questionID', Value: this.id, Oper: 'eq' }]
      }).then(res => {
        callBack && callBack()
        if (res.length) {
          const answerIds = res.map(r => { return r.id })
          if (answerIds && answerIds.length) {
            const query = [
              { Key: 'ObjectType', Value: 'answer', Oper: 'eq' },
              'and',
              { Key: 'ObjectID', Value: answerIds.join(','), Oper: 'in' }]
            this.loadBoosts({ query })
          }
        }
      })
    },
    onLoad (index, done) {
      this.init(() => {
        if (this.page.nextPageToken === -1) {
          this.noData = true
          done(true)
        } else {
          done()
        }
      })
    },
    onInitAndPull () {
      this.$refs.infiniteScroll.reset()
      this.$refs.infiniteScroll.resume()
      this.$refs.infiniteScroll.trigger()
    }
  }
}
</script>

<style>
</style>
