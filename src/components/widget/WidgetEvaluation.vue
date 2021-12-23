<template>
  <widget-layout
    :isEmpty="!model.evaluation.rating"
    :category="category"
    :id="objectID"
    widget="evaluation"
  >
    <template
      slot="content"
      v-if="!!model.evaluation.rating"
    >
      <div class="full-width absolute-center q-pa-none">
          <q-rating
            readonly
            v-model="model.evaluation.rating"
            size="2em"
            color="grey"
            :color-selected="ratingColors"
          />
          <div class="q-py-sm">
            {{model.evaluation.feedback}}
          </div>
      </div>
    </template>
  </widget-layout>
</template>

<script>
export default {
  name: 'WidgetEvaluation',
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: true }
  },
  data () {
    return {
      ratingColors: ['light-green-3', 'light-green-6', 'green', 'green-9', 'green-10'],
      connector: null
    }
  },
  computed: {
    model: {
      get () {
        return this.$store.getters['service/service'](+this.objectID)
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.objectID && this.$store.dispatch('service/loadService', this.objectID).then(res => {
        this.$store.dispatch('person/loadPerson', res.connectorId).then(res1 => {
          this.connector = res1
        })
      })
    })
  },
  mounted () {

  },
  methods: {

  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout')
  }
}
</script>

<style scoped lang="scss">
</style>
