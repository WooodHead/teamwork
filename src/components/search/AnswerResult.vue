
<template>
  <div>
    <a
      class="text-primary text-weight-bold "
      href="javascript:void(0);"
      @click="toDetail(answer)"
      v-html="title"
    ></a>
    <div
      v-html="answer.content"
      class="q-mt-sm bg-grey-1 tiptap-content editor__content"
    >
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    answer: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    question () {
      return this.$store.getters['checkins/question'](+this.answer.questionID)
    },
    title () {
      return '回答："' + this.question.content + '"'
    }
  },
  components: {
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion']),
    toDetail (model) {
      this.$router.push({
        name: 'answer',
        params: {
          category: model.objectType,
          objectID: +model.objectId,
          questionID: +model.questionID,
          answerID: +model.id
        }
      })
    }
  },
  mounted () {
    this.loadQuestion(+this.answer.questionID)
  }
}

</script>

<style lang='stylus' scoped></style>
