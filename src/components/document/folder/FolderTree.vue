<template>
  <div>
    <slot :data="selectModel"></slot>
    <q-tree
      :nodes="treeData"
      node-key="id"
      label-key="title"
      accordion
      ref="tree"
      :expanded.sync="expanded"
      :selected.sync="selected"
      @update:selected="updateSelect($event)"
      class="q-mt-md"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'FolderTree',
  props: {
    parentID: {
      type: Number,
      default: 0,
      required: false
    },
    objectCondition: {
      type: Object,
      default: () => { return { category: '', objectID: 0 } },
      description: '获取文件夹树结构的条件，根据模块和ID获取不同的文件夹'
    }
  },
  data () {
    return {
      treeData: [],
      expanded: [0],
      selected: null,
      filter: '',
      selectModel: {}
    }
  },
  mounted () {
    this.loadTreeData()
  },
  watch: {
    objectCondition: {
      handler: function (val) {
        this.loadTreeData()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('document', ['getFolderOfDiffType']),
    loadTreeData () {
      this.getFolderOfDiffType(this.objectCondition).then(res => {
        if (res) {
          this.treeData = res
        }
      })
      this.expanded.push(this.parentID)
      this.selected = this.parentID
    },
    updateSelect ($event) {
      this.$emit('update:subId', $event)
      this.selectModel = this.$refs.tree.getNodeByKey($event)
    }
  }
}
</script>

<style lang='scss' scoped>
  /deep/.q-tree__node--selected {
    background: #e6f1fc;
  }
</style>
