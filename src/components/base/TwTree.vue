<template>
  <q-card class="fit">
    <q-card-section>
      <!-- 树搜索框 -->
      <q-input
        ref="searchField"
        v-model="searchField"
        :label="$t('toolbar.search')"
        outlined
        dense
        autofocus
        debounce="500"
        class="col"
        @keyup.esc="searchField = ''"
      >
        <template v-slot:append>
          <q-icon
            v-if="searchField !== ''"
            name="clear"
            class="cursor-pointer"
            @click="resetFilter"
          />
          <q-icon name="search" />
        </template>
      </q-input>
      <div
        class="q-mt-sm"
        :style="$q.screen.lt.sm?'height:300px;overflow-y: auto;':'height:500px;overflow-y: auto;'"
      >
        <q-tree
          v-if="!multiple"
          ref="tree"
          selected-color="primary"
          :default-expand-all="defaultExpandAll"
          :node-key="nodeKey"
          :label-key="labelKey"
          :nodes="nodes"
          :filter="searchField"
          :filter-method="filterTree"
          :selected.sync="newSelected"
          @update:selected="nodeSelected"
        />
        <q-tree
          v-else
          tickable
          ref="tree"
          :default-expand-all="defaultExpandAll"
          :node-key="nodeKey"
          :label-key="labelKey"
          :nodes="nodes"
          :filter="searchField"
          :filter-method="filterTree"
          :tick-strategy="tickStrategy"
          :ticked.sync="newTicked"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions
      v-if="multiple ===true"
      align="right"
    >
      <q-btn
        no-caps
        :label="$q.lang.label.ok"
        color="primary"
        @click="Ok()"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'TwTree',
  data () {
    return {
      searchField: '', // 搜索框的值
      newSelected: Number(this.selected),
      newTicked: this.ticked
    }
  },
  watch: {
    searchField (newVal, oldVal) {
      newVal !== '' && this.$refs.tree.expandAll()
    }
  },
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    nodes: {
      type: Array,
      required: true,
      default: () => []
    },
    nodeKey: {
      type: String,
      required: false,
      default: 'value'
    },
    labelKey: {
      type: String,
      required: false,
      default: 'label'
    },
    selected: {
      type: [String, Number],
      required: false,
      default: ''
    },
    ticked: {
      type: Array,
      required: false,
      default: () => []
    },
    tickStrategy: {
      type: String,
      required: false,
      default: 'leaf'
    },
    defaultExpandAll: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    // 过滤树
    filterTree (node, filter) {
      const filt = filter.toLowerCase()
      return (
        node[this.labelKey] && node[this.labelKey].toLowerCase().indexOf(filt) > -1
      )
    },
    // 重置搜索过滤框
    resetFilter () {
      this.searchField = ''
      this.$refs.searchField.focus()
    },
    // 节点选择后
    nodeSelected (nodeKey) {
      // 叶子节点才返回
      this.$emit('selected-event', [this.$refs.tree.getNodeByKey(nodeKey)])
    },
    // 节点选择后(多选)
    Ok () {
      this.$emit('selected-event', this.$refs.tree.getTickedNodes())
    }
  }
}
</script>
<style>
</style>
