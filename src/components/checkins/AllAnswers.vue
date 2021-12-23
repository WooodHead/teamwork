<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page "
    clickable
  >
    <tw-header-card title="" :actions="actions">
      <template #menu>
        <tw-menu
          :menus="menus"
          @publicLink="onPublicLink"
        />
      </template>
    </tw-header-card>
    <div class="q-px-xxl">
      <q-card-section class="header text-center">
        <div class="text-h4 text-weight-bold">{{ question.content }}</div>
        <div>
          {{
            $t("answer.answersBy", { name: person ? person.name : "" })
          }}
        </div>
      </q-card-section>
      <q-card-section
        class="content"
        :class="$q.platform.is.desktop ? '' : 'q-pt-none'"
      >
        <q-infinite-scroll
          @load="onLoad"
          :offset="250"
          ref="infiniteScroll"
        >
          <div
            v-for="index in Object.keys(answersGroup)"
            :key="index"
          >
            <answer-list
              :answers="answersGroup[index]"
              :title="index"
            ></answer-list>
          </div>
        </q-infinite-scroll>
        <div
          class="text-center text-grey-5 q-pb-lg"
          v-if="noData && Object.keys(answersGroup).length > 0"
        >
          没有回答了
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
    }
  },
  data () {
    return {
      menus: [{ group: ['publicLink'] }],
      limit: 10,
      offset: 0,
      noData: false,
      query: [
        [
          {
            Key: 'questionID',
            Value: +this.$route.params.questionID,
            Oper: 'eq'
          },
          'and',
          { Key: 'CreateByID', Value: +this.$route.params.personID, Oper: 'eq' }
        ]
      ],
      actions: ['menu']
    }
  },
  components: {
    AnswerList: () => import('components/checkins/AnswerList'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  methods: {
    ...mapActions('checkins', [
      'loadQuestion',
      'loadAnswersOfPerson',
      'loadAnswers'
    ]),
    ...mapActions('boost', ['loadBoosts']),
    onPublicLink () {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'answer',
          param: encodeURIComponent(
            JSON.stringify({
              questionID: +this.$route.params.questionID,
              personID: +this.$route.params.personID
            })),
          title: this.question.content
        }
      })
    },
    init (callBack) {
      this.loadAnswers({ query: this.query }).then(res => {
        if (res.length) {
          callBack && callBack()
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
    }
  },
  computed: {
    ...mapState('checkins', ['page']),
    question () {
      return this.$store.getters['checkins/question'](
        +this.$route.params.questionID
      )
    },
    person () {
      let selectPersons = this.$store.state.person.selectPersons
      return _.map([+this.$route.params.personID], p => selectPersons[p])[0]
    },
    answersGroup () {
      return this.$store.getters['checkins/answersOfPersonGroup'](
        +this.$route.params.questionID,
        +this.$route.params.personID,
        this.question.cron.type
      )
    }
  },
  mounted () {
    this.loadQuestion(+this.$route.params.questionID)
  }
}
</script>
<style scoped>
  .answer-subscribe {
    min-height: unset;
    border-top: none;
  }
  .card-grow-in-page .header {
    color: #283c46;
  }
  .card-grow-in-page .all-answers a,
  .card-grow-in-page .person-name,
  .card-grow-in-page .checin-name {
    color: inherit;
  }
  .card-grow-in-page .person-name {
    font-size: 1.5em;
  }
  .card-grow-in-page .checkin-name {
    font-size: 2em;
  }
  .card-grow-in-page .timestamp {
    font-size: 1.17em;
    font-weight: bold;
  }
</style>
