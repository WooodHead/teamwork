<template>
  <widget-layout
    :isEmpty="validAssess.length===0"
    :category="category"
    :id="objectID"
    widget="opportunityAssess"
  >
    <template slot="content">
      <assess-list
        v-if="validAssess.length"
        :category="category"
        :objectID="objectID"
        :assessList="validAssess"
        :itemCanClick="false"
      />
    </template>
  </widget-layout>
</template>

<script>
import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
const { formatDate } = date
export default {
  name: 'WidgetOpportunityAssess',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    AssessList: () => import('components/assess/AssessList')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: false }
  },
  data () {
    return {}
  },
  watch: {
    objectID (newVal, oldVal) {
      this.init()
    }
  },
  computed: {
    ...mapGetters('assess', ['allAssess']),
    validAssess () {
      return this.category === 'opportunity'
        ? this.$store.getters['assess/allAssess']({ category: 'opportunity', objectID: this.objectID }) || []
        : this.allAssess({ objectID: this.objectID })
    }
  },
  methods: {
    ...mapActions('assess', ['loadAllAssess']),
    formatDate,
    init () {
      let query = [{ Key: 'Archived', Value: 0, Oper: 'eq' }, 'and']
      this.category === 'opportunity'
        ? query.push({ Key: 'OpportunityID', Value: this.objectID, Oper: 'eq' })
        : query.push({ Key: 'ManufacturerID', Value: this.objectID, Oper: 'eq' })
      this.loadAllAssess({ query, limit: 5, offset: 0, byPage: true })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
</style>
