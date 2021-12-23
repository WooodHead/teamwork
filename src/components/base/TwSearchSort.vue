<template>
  <div class="q-gutter-md row">
    <q-input
      v-select-all
      :value="search"
      @input="$emit('update:search',$event)"
      outlined
      :label="searchTip?searchTip:$t('toolbar.search')"
      dense
      debounce="500"
      class="col"
      @keyup.esc="$emit('update:search', '')"
    >
      <template v-slot:prepend>
        <slot name="searchPrepend"></slot>
      </template>
      <template v-slot:append>
        <slot name="searchAppend">
          <q-icon
            v-if="search"
            name="close"
            @click="$emit('update:search', '')"
            class="cursor-pointer"
          />
          <q-icon name="search" />
        </slot>
      </template>
    </q-input>
    <q-select
      v-if="sort"
      :value="sort"
      @input="$emit('update:sort', $event)"
      :options="options"
      dense
      emit-value
      map-options
      options-dense
      :label="$t('toolbar.sortBy')"
      outlined
    />
    <slot name="append"></slot>
  </div>
</template>

<script>
import { selectAll } from '../../directives/select-all'
export default {
  props: {
    options: {
      type: Array,
      required: false,
      description: 'Use "options" design for the sort options'
    },
    sort: {
      type: String,
      required: false,
      default: '',
      description: 'Use "sortField" design for the sort field'
    },
    search: {
      type: String,
      required: false,
      default: '',
      description: 'Use "searchField" design for the search field'
    },
    searchTip: {
      type: String,
      required: false,
      default: '',
      description: '检索内容提示'
    }
  },
  directives: {
    selectAll
  }
}
</script>
<style lang="scss" scoped>
.q-select {
  flex: 0 0 112px;
}
</style>
