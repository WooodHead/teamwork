<template>
  <div class="row">
    <div
      v-if="$q.platform.is.desktop"
      @click.capture.stop
    >
      <tw-avatar
        :id="(publicContent&&publicContent.person.PsonID)||answer.createByID"
        :name="(publicContent&&publicContent.person.PsonName)||''"
        class="q-mt-md"
      />
    </div>
    <q-card
      class="col answer-card"
      flat
    >
      <q-item>
        <q-item-section
          avatar
          v-if="$q.platform.is.mobile"
        >
          <tw-avatar
            size="md"
            :id="(publicContent&&publicContent.person.PsonID)||answer.createByID"
            :name="(publicContent&&publicContent.person.PsonName)||''"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label
            :title="$t('answer.allAnswers',{name:answer.createBy})"
            @click="toPageAllAnswers(answer.questionID,answer.createByID)"
            class="text-weight-bolder text-primary cursor-pointer"
          >
            {{publicContent ? publicContent.answer.createBy : answer.createBy}}</q-item-label>
        </q-item-section>
        <q-space />
        <q-item-section side>
          <q-item-label caption>
            {{publicContent ? publicContent.answer.createTime : answer.createTime|niceTime(this.$q.screen.gt.xs)}}
          </q-item-label>
        </q-item-section>
        <q-item-section
          top
          side
          v-if="answerMenuable"
          style="padding-left: 0;"
        >
          <q-btn
            round
            icon="more_horiz"
            flat
            dense
            class="col"
          >
            <q-menu
              auto-close
              transition-show="flip-right"
              transition-hide="flip-left"
              anchor="top left"
              self="top right"
            >
              <q-list v-ripple>
                <q-item
                  :disable="question.archived"
                  clickable
                  @click.stop="toPageAnswerEdit(answer.questionID,answer.id)"
                >
                  <q-item-section>
                    <div class="row">
                      <q-icon
                        class="q-mr-xs"
                        size="xs"
                        name="edit"
                      />
                      {{ this.$t('label.edit')}}
                    </div>
                  </q-item-section>
                </q-item>

                <q-item
                  :disable="question.archived"
                  clickable
                  @click.stop="onDelete(answer.id)"
                >
                  <q-item-section>
                    <div class="row">
                      <q-icon
                        class="q-mr-xs"
                        size="xs"
                        name="delete"
                      />
                      {{ this.$t('label.delete')}}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-card-section class="content">
        <div
          class="tiptap-content wrapper editor__content"
          v-html="publicContent ? publicContent.answer.content : answer.content"
        ></div>
        <div class="flex items-center">
          <tw-discuss
            v-if="answerDiscussable"
            :total="answer.commentCount"
            @clickDiscuss="toPageAnswer(question.id, answer.id)"
          />
          <tw-boost-pack
            v-if="!share"
            :boostTo="answer.createBy"
            :objectID="+answerID"
            objectType="answer"
            messageType="answer"
            messageTag="AnswerTo"
            :messageTitle="$t('answer.whoseAnswer', { name: answer.createBy }) + question.content"
            :subTitle="answer.content"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>

</template>
<script>
import { mapActions } from 'vuex'
import { date, LocalStorage } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
import Checkin from '@/store/checkins/model'

export default {
  name: 'answer',
  props: {
    answerID: {
      type: [Number, String],
      default: 0
    },
    share: {
      type: Boolean,
      default: false,
      required: false
    },
    discussable: {
      type: Boolean,
      default: true,
      required: false
    },
    menuable: {
      type: Boolean,
      default: true,
      required: false
    },
    // 分享时使用
    publicContent: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      myInfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    answer () {
      return this.$store.getters['checkins/answer'](+this.answerID)
    },
    question () {
      return this.$store.getters['checkins/question'](+this.answer.questionID)
    },
    answerDiscussable () {
      if (this.share) {
        return false
      }
      return this.discussable
    },
    answerMenuable () {
      if (this.share || this.answer.createByID !== this.myInfo.id || this.question.archived) {
        return false
      }
      return this.menuable
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwDiscuss: () => import('components/base/TwDiscuss'),
    TwBoostPack: () => import('components/boost/TwBoostPack')
  },
  filters: {
    niceTime (value, isDeskop) {
      if (isDeskop) {
        return date.formatDate(value, 'YYYY-MM-DD HH:mm')
      } else {
        return date.formatDate(value, 'YYYY-MM-DD')
      }
    }
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion', 'loadAnswer', 'deleteAnswer']),
    // 跳转此人的所有回答
    toPageAllAnswers (questionID, personID) {
      this.$router.push({ // 核心语句
        name: 'allAnswers',
        params: {
          // category: this.question.objectType,
          // objectID: this.question.objectId,
          questionID: +questionID,
          personID: +personID
        }
      })
    },
    // 路由跳转到回答讨论页面
    toPageAnswer (questionID, answerID) {
      this.$router.push({ // 核心语句
        name: 'answer',
        params: {
          category: this.question.objectType,
          objectID: +this.question.objectId,
          questionID: +questionID,
          answerID: +answerID
        }
      })
    },
    // 路由跳转到回答编辑页面
    toPageAnswerEdit (questionID, answerID) {
      this.$router.push({ // 核心语句
        name: 'answerEdit',
        params: {
          category: this.question.objectType,
          objectID: +this.question.objectId,
          questionID: +questionID,
          answerID: +answerID
        }
      })
    },
    // 删除一条回答
    onDelete (answerID) {
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.deleteAnswer(+answerID)
      })
    }
  },
  mounted () {
    if (!this.publicContent) {
      this.loadAnswer(+this.answerID)
    } else {
      this.publicContent.answer = Checkin.Answer.from(this.publicContent.answer)
    }
  }
}
</script>

<style lang="scss" scoped>
  .q-card {
    border-radius: 1rem;
  }
  .q-item__section--avatar {
    min-width: 40px;
    padding-right: 8px;
  }
  .content {
    padding-top: 0;
  }
  .answer-card {
    background-color: #faf8f7;
  }
  .wrapper {
    white-space: pre-wrap;
  }
</style>
