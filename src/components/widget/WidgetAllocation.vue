<template>
  <widget-layout
    :isEmpty="allocations.length === 0"
    :category="category"
    :id="objectID"
    widget="allocation"
    :isSetting="false"
  >
    <template slot="content" v-if="allocations.length > 0">
      <q-list>
        <q-item v-for="allocation in allocations" :key="allocation.id">
          <q-item-section avatar>
            <tw-avatar :id="allocation.leaderID" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">{{
              allocation.manufacturerName
            }}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{ allocation.title }}</span>
              -- {{ htmlToText(allocation.notes) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge
              align="top"
              class="q-pa-xs q-mr-md"
              :color="allocationStatusColor(allocation.status)"
              >{{ allocation.status }}</q-badge
            >
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </widget-layout>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'WidgetAllocation',
  props: {
    category: { type: String, required: true },
    objectID: { type: Number, required: true }
  },
  data () {
    return {}
  },
  computed: {
    allocations: {
      get () {
        return this.$store.getters['allocation/allocations']({
          category: 'order',
          objectID: this.objectID,
          currentRouteName: 'allocation'
        })
      }
    },
    allocationStatusColor () {
      return status => {
        let statusModel = this.$store.getters['allocation/statusList'].filter(
          item => item.label === status
        )[0]
        return statusModel && statusModel.color
      }
    }
  },
  created () {},
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  watch: {
    objectID (val) {
      this.init()
    }
  },
  methods: {
    htmlToText,
    init () {
      this.objectID &&
        this.$store.dispatch('allocation/loadAllocations', {
          byPage: true,
          limit: 10,
          query: [
            { Key: 'OrderID', Value: +this.objectID, Oper: 'eq' },
            'and',
            { Key: 'Archived', Value: 0, Oper: 'eq' }
          ]
        })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    WidgetLayout: () => import('layouts/WidgetLayout')
  }
}
</script>

<style scoped lang="scss"></style>
