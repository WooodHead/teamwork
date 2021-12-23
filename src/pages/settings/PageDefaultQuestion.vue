<!--默认问题设置配置页面 -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card
      :title="$t('settings.defaultQuestion.pageTitle',
     {name: $t(`${category}.module`)})"
      :actions="actions"
      :add="{label:$t('settings.defaultQuestion.addLabel'),click:add}"
    />
    <q-card-section class="q-px-xxl">
      <!-- 新建清单Form -->
      <div
        class="q-gutter-b-md q-py-md"
        v-if="addingQuestionEvent"
      >
        <q-card
          class="q-pa-md"
          bordered
          flat
        >
          <default-question-form></default-question-form>
        </q-card>
      </div>
      <div
        class="q-gutter-y-md"
        v-if="currQuestions && currQuestions.length > 0"
      >
        <default-question-card
          v-for="(question,index) in currQuestions"
          :key="index"
          :question="question"
          :category="category"
        >
        </default-question-card>
      </div>
      <div v-else>
        <tw-banner-no-result
          v-show="!addingQuestionEvent"
          icon="warning"
          color="warning"
          :info="$t('settings.defaultQuestion.noDefault',
          {name: $t(`${category}.module`)})"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'PageDefaultQuestion',
  props: {
    category: {
      type: String,
      required: true,
      default: 'project'
    }
  },
  data () {
    return {
      model: {},
      actions: ['add']
    }
  },
  mounted () {
    this.setQuestion({ question: {}, category: this.category }) // 设置当前问题和类别
    this.loadSettings().then(res => {
      this.model = _.cloneDeep(res.defaultQuestion)
    })
  },
  computed: {
    ...mapGetters('settings', ['currQuestions']),
    addingQuestionEvent: {
      get () {
        return this.$store.state.settings.settings.addingQuestionEvent
      },
      set (value) {
        this.setAddQuestionEvent(value)
      }
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    'default-question-card': () => import('components/checkins/DefaultQuestionCard'),
    'default-question-form': () => import('components/checkins/DefaultQuestionForm')
  },
  methods: {
    ...mapActions('settings', ['loadSettings']),
    ...mapMutations('settings', ['setAddQuestionEvent', 'setEditQuestionEvent', 'setQuestion']),
    add () {
      this.setAddQuestionEvent(true)
      this.setEditQuestionEvent(false)
      this.setQuestion({ question: {}, category: this.category })
    }
  },
  created () {
    this.loadSettings().then(res => {
      this.model = _.cloneDeep(res.defaultQuestion)
    })
    this.setEditQuestionEvent(false)
    this.setAddQuestionEvent(false)
  }
}

</script>

<style lang='scss' scoped>
</style>
