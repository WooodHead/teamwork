<template>
  <div class="row items-center">
    <q-select
      dense
      outlined
      borderless
      class="q-pr-sm"
      v-model="newSelected"
      :options="selects"
      @input="selectEvent"
      :label="$t('contacts.tree.category')"
    />
    <q-input
      dense
      outlined
      clearable
      class="col"
      v-model="newSearch"
      @input="searchEvent"
      :label="$t(`contacts.placeholder.${selected.name}`)"
    />
  </div>
</template>

<script>
export default {
  props: {
    selects: {
      type: Array,
      required: true,
      default: null
    },
    selected: {
      type: Object,
      required: true,
      default: null
    },
    search: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      newSearch: this.search,
      newSelected: this.selected
    }
  },
  methods: {
    searchEvent (data) {
      this.$emit('update:search', data || '')
    },
    selectEvent (data) {
      this.$emit('selected-event', data)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
