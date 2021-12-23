<template>
  <div class="q-mb-md filter-container">
    <q-btn-toggle
      v-model="type"
      class="my-custom-toggle q-mb-lg"
      unelevated
      toggle-text-color="primary"
      toggle-color="blue-1"
      color="white"
      text-color="black"
      :options="filterOptions"
    >
    </q-btn-toggle>
    <tw-search-panel
      :label="'搜索'"
      :search.sync="search"
      :showPanelBtn="false"
    />
  </div>
</template>

<script>
export default {
  name: 'FilterData.vue',
  props: {
    filterOptions: {
      type: Array,
      required: false,
      description: '所有状态'
    },
    currentType: {
      type: String,
      required: false,
      default: 'all',
      description: '当前状态'
    },
    currentSearch: {
      type: String,
      required: false,
      default: '',
      description: '当前状态'
    }
  },
  data () {
    return {
      type: this.currentType || 'all',
      search: this.currentSearch
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  },
  watch: {
    type () {
      this.$emit('setFilterType', this.type)
    },
    search () {
      this.$emit('setSearch', this.search)
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
