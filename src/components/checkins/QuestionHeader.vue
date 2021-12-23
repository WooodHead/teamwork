<template>
  <div>
    <q-card-section>
      <div class="text-subtitle2">
        {{question.cronName}}
      </div>
      <div class="text-h6 text-weight-bold">{{question.content}}</div>
    </q-card-section>
    <q-card-section>
      <q-input
        v-if="!showEditor"
        type="text"
        placeholder="请填写你的答案..."
        outlined
        Readonly
        @click="showEditor=true"
      />
      <answer-form
        v-else
        :category="objectType"
        :objectID="objectId"
        :questionID="+id"
        @submit="showEditor=false"
      />
    </q-card-section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      assignedTo: [],
      objectId: 0,
      objectType: '',
      showEditor: false
    }
  },
  components: {
    AnswerForm: () => import('components/checkins/AnswerForm')
  },
  computed: {
    question () {
      return this.$store.getters['checkins/question'](+this.id)
    }
  },
  mounted () {
    this.loadQuestion(+this.id).then(question => {
      this.assignedTo = question.assignedTo
      this.objectId = question.objectId
      this.objectType = question.objectType
    })
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion'])
  }

}
</script>

<style>
</style>
