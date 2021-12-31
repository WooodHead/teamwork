<template>
  <div>
    <q-tree
      v-if="treeNodes[0].children.length"
      no-connectors
      :nodes="treeNodes"
      selected-color="primary"
      default-expand-all
      node-key="id"
      class="q-pt-sm"
      :selected.sync="selected"
      @update:selected="updateSelect"
    />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'BookmarkTree',
  props: {
    type: {
      type: String,
      default: '',
      required: true,
      description: '类型：project、team、product、wiki'
    },
    id: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '类型ID'
    }
  },
  data () {
    return {
      person: LocalStorage.getItem('myself'),
      selected: null
    }
  },
  mounted () {
    this.loadBookmarks({
      query: [
        { Key: 'Owner', Value: this.person.id, Oper: 'eq' }
      ]
    }).then(bookmarks => {
      this.addBookmarkTree(bookmarks)
      this.initSeleted()
    })
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkTree']),
    treeNodes () {
      let treeNodes = [
        {
          id: -1,
          icon: 'grade',
          label: '我的收藏',
          header: 'root',
          children: []
        }
      ]
      _.forEach(this.bookmarkTree(this.type, this.id), bookmark => {
        treeNodes[0].children.push({
          id: bookmark.id,
          icon: 'app:tw-icon-file',
          label: bookmark.objectTitle
        })
      })
      return treeNodes
    }
  },
  methods: {
    ...mapActions('bookmark', ['loadBookmarks']),
    ...mapMutations('bookmark', ['addBookmarkTree']),
    // 切换选中项处理
    updateSelect (nodeKey) {
      let bookmark = _.find(this.bookmarkTree(this.type, this.id), { id: nodeKey })
      bookmark && bookmark.route && bookmark.route.path && this.$router.push({ path: bookmark.route.path })
    },
    // 初始化选中项
    initSeleted (path = this.$route.path) {
      let bookmark = _.find(this.bookmarkTree(this.type, this.id), (b) => {
        return b.route && b.route.path && b.route.path === this.$route.path
      })
      this.selected = (bookmark && bookmark.id) || null
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initSeleted(newVal.path)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .q-tree__icon,
  .q-tree__node-header-content .q-icon,
  .q-tree__spinner {
    font-size: 14px;
  }
</style>
