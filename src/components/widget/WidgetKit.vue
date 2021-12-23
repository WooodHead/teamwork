<template>
  <!-- 卡片列表 -->
  <div>
    <component
      v-for="type in widgets"
      :key="type"
      :is="allWidgets[`Widget${capitalize(type)}`]"
      :category="category"
      :objectID="objectID"
      :model="model"
    />
  </div>
</template>

<script>
import { format } from 'quasar'
import allWidgets from './index'
import { mapActions } from 'vuex'
const { capitalize } = format
export default {
  name: 'WidgetKit',
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: true },
    model: { type: Object, required: true }
  },
  data () {
    return {
      allWidgets: allWidgets
    }
  },
  computed: {
    widgets () {
      if (this.model.widgets && Object.keys(this.model.widgets).length) {
        let widgetsArr = _.keys(this.model.widgets).map(key => {
          return Object.assign({}, { order: this.model.widgets[key].order || 0 }, { key: key })
        })
        return _.map(widgetsArr.sort((a, b) => a.order - b.order), w => w.key)
      } else {
        return []
      }
    }
  },
  methods: {
    capitalize,
    ...mapActions('resource', ['loadCategory'])
  },
  mounted () {
    this.loadCategory(this.category)
  }
}
</script>

<style scoped>
</style>
