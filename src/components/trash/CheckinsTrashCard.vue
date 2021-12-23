<template>
  <div class="widget-card-section text-left full-height">
    <!-- 任务卡片 -->
    <div class="relative-position text-body2">
      <template>
        <q-scroll-area style="height: 180px; max-width: 300px;">
          <!-- 答案卡片 -->
          <q-card-section
            class="q-pb-sm toolsCardStyle"
            v-if="Object.keys(this.model).includes('questionID')"
          >
            <div class="absolute-top text-center trashcard-tip">问答</div>
            <!-- <div class="q-mb-sm text-subtitle2 text-center text-weight-bold">自动提问</div> -->
            <!-- 问题 -->
            <div class="q-mb-xs q-mt-md text-grey-6 text-caption question-title">来自：{{question.content}}</div>
            <!-- 答案 -->
            <div class="q-pb-sm flex">
              <q-avatar
                size="20px"
                color="primary"
                text-color="white"
                class="q-mr-sm text-center"
              >
                <span v-if="model.commentCount!==0">{{model.commentCount}}</span>
                <q-icon
                  v-else
                  name="question_answer"
                ></q-icon>
              </q-avatar>
              <span v-html="model.content"></span>
            </div>
          </q-card-section>
          <!-- 问题卡片 -->
          <q-card-section
            class="q-pb-sm toolsCardStyle"
            v-if="Object.keys(this.model).includes('cron')"
          >
            <div class="absolute-top text-center trashcard-tip">问答</div>
            <!-- <div class="q-mb-sm text-subtitle2 text-center text-weight-bold">自动提问</div> -->
            <div class="q-mb-sm q-mt-md text-subtitle2">{{model.content}}</div>
            <div class="q-mb-xs text-grey-6 text-caption question-title">{{model.cronName}}</div>
          </q-card-section>
        </q-scroll-area>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CheckinsTrashCard',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    // TwDiscuss: ()=> import('components/base/TwDiscuss')
  },
  data () {
    return {
      question: {}
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion'])
  },
  mounted () {
    if (Object.keys(this.model).includes('questionID')) {
      this.loadQuestion(this.model.questionID)
        .then(res => {
          this.question = res
        })
    }
  }
}
</script>

<style scoped lang="scss">
.question-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
}
</style>
