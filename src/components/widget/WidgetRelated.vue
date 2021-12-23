<template>
  <widget-layout
    :widget="widget"
    :isEmpty="items.length===0"
    :category="category"
    :id="objectID"
  >
    <template slot="content">
      <q-list>
        <q-item
          v-for="item in items"
          :key="item.id"
        >
          <q-item-section avatar>
            <tw-avatar
              size="lg"
              :id="item.leaderID"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label
              lines="1"
              class="text-left text-bold"
            >{{item.title}}</q-item-label>
            <q-item-label
              lines="1"
              caption
              class="text-left"
            >{{htmlToText(item.notes)}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </widget-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'WidgetRelated',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    widget: { type: String, required: true },
    category: { type: String, required: true },
    objectID: { type: Number, required: true },
    model: { type: Object, required: true }
  },
  mounted () {
    this.loadResourceRelations({ category1: this.category, id1: +this.objectID, category2: this.widget, type: this.relationType[this.widget][this.category], fields: 'Select' })
  },
  computed: {
    ...mapState('resource', ['relationType']),
    ...mapGetters('resource', ['resourceRelations', 'categoryRelations']),
    items () {
      let relations = this.resourceRelations({ category1: this.category, id1: +this.objectID, category2: this.widget, type: this.relationType[this.widget][this.category] })
      let resourceIds = (relations && relations.map(r => r.selectId)) || 0
      return this.categoryRelations({ category: this.widget, ids: resourceIds })
    }
  },
  methods: {
    ...mapActions('resource', ['loadResourceRelations']),
    htmlToText
  }
}
</script>

<style scoped>
</style>
