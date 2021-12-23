<template>
  <widget-layout
    :isEmpty="questionList.length===0"
    widget="checkins"
    :category="category"
    :id="objectID"
  >
    <template
      slot="content"
    >
      <q-card-section class="q-px-md q-gutter-md">
        <question-item
          v-for="question in questionList"
          :key="question.id"
          :question="question"
        ></question-item>
      </q-card-section>
    </template>
  </widget-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Checkins',
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: Number,
      required: false
    }
  },
  computed: {
    ...mapGetters('checkins', ['questionList'])
  },
  components: {
    QuestionItem: () => import('components/checkins/QuestionItem'),
    WidgetLayout: () => import('layouts/WidgetLayout')
  },
  mounted () {
    // 获取questionList，参数为objectType，objectID
    this.loadQuestionList({
      objectType: this.category,
      objectID: +this.objectID
    })
  },
  methods: {
    ...mapActions('checkins', ['loadQuestionList'])
  }
}
</script>

<style scoped>
</style>
