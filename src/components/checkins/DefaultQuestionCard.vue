<template>
  <q-card
    class="cursor-pointer question-card q-m-xxl"
    bordered
    flat
    outline
    style="overflow:hidden"
    @click="updateEvent(question)"
  >
    <q-card-section v-if="editingQuestionEvent && question.ID ===this.$store.state.settings.settings.currQuestion.ID ">
      <default-question-form></default-question-form>
    </q-card-section>
    <q-card-section v-else>
      <div class="row">
        <div class="col">
          <div class="text-subtitle2">
            {{question.cronName}}
          </div>
          <div class="text-h6 text-weight-bold">{{question.content}}</div>
        </div>
        <div class="col-auto">
          <div
            side
            class="row"
          >
            <q-btn
              color="negative"
              round
              icon="delete"
              flat
              :class="{ 'col-sm-auto': $q.screen.lt.sm }"
              @click.stop="deleteEvent(question)"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { i18n } from '@/boot/i18n'
import { showConfirm } from '@/utils/show-confirm'
import { mapMutations, mapActions } from 'vuex'
export default {
  props: {
    question: {
      type: Object,
      required: false,
      default: null
    },
    category: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      defaultQuestion: {}
    }
  },
  computed: {
    editingQuestionEvent: {
      get () {
        return this.$store.state.settings.settings.editingQuestionEvent
      },
      set (value) {
        this.setEditQuestionEvent(value)
      }
    },
    title () {
      return function (question) {
        return this.$t('settings.defaultQuestion.questionCard.header.title', { Cron: this.Cron(question), time: question.cron.time })
      }
    }
  },
  components: {
    'default-question-form': () => import('components/checkins/DefaultQuestionForm')
  },
  created () {
    this.loadSettings().then(res => {
      this.defaultQuestion = _.cloneDeep(res.defaultQuestion)
    })
  },
  methods: {
    ...mapActions('settings', ['loadSettings', 'updateSetting']),
    ...mapMutations('settings', ['setAddQuestionEvent', 'setEditQuestionEvent', 'setQuestion']),
    Cron (question) {
      if (question.cron.type === 'month') {
        if (question.cron.monthtype === 'firstweek') {
          return this.$t('question.header.cron.firstweek', { days: this.days(question) })
        } else if (question.cron.monthtype === 'lastweek') {
          return this.$t('question.header.cron.lastweek', { days: this.days(question) })
        } else if (question.cron.monthtype === 'lastday') {
          return this.$t('question.header.cron.lastday')
        } else {
          return this.$t('question.header.month', { days: this.days(question) })
        }
      } else if (question.cron.type === 'week') {
        return this.$t('question.header.week', { days: this.days(question) })
      } else {
        return this.$t('question.header.day')
      }
    },
    days (question) {
      return this.$store.getters['checkins/days'](question.id)
    },
    updateEvent (model) {
      this.setEditQuestionEvent(true)
      this.setAddQuestionEvent(false)
      this.setQuestion({ question: model, category: this.category })
    },
    deleteEvent (model) {
      var _this = this
      // 弹出删除弹框
      showConfirm(i18n.t(`settings.defaultQuestion.confirmDelete`), () => {
        let questions = _this.defaultQuestion[this.category]
        let index = _.findIndex(questions, function (question) { return question.ID === model.ID })
        _this.defaultQuestion[this.category].splice(index, 1)
        let setting = {
          id: _this.defaultQuestion.id,
          type: 'defaultQuestion',
          settings: {
            organize: _this.defaultQuestion.organize,
            team: _this.defaultQuestion.team,
            productDev: _this.defaultQuestion.productDev,
            project: _this.defaultQuestion.project,
            wiki: _this.defaultQuestion.wiki
          }
        }
        this.updateSetting(setting).then(res => {
          console.log(res)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .question-card {
    width: 100%;
    height: 100%;
    min-height: 100px;
  }
</style>
