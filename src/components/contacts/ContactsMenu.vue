<template>
  <div style="width:300px;">
    <!-- 模糊搜索 -->
    <select-search
      :selects="($myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isSeniorManager)?selects.filter(s=>s.used):selects.filter(s=>s.used&&s.name!='role')"
      :selected="selected"
      :search.sync="search"
      @selected-event="selectedEvent"
    ></select-search>
    <!-- 机构树 -->
    <organize-tree
      v-if="$q.screen.width > 1024&&selected.name==='organize'"
      :selected="selected"
      :treed="treed"
      :search="search"
      @treed-event="treedEvent"
      @edit-event="ediEvent"
    ></organize-tree>
    <!-- PC端除去机构，其它切换成列表的形式-->
    <contacts-list
      v-else-if="$q.screen.width > 1024&&selected.name!=='organize'"
      :selected="selected"
      :treed="treed"
      :search="search"
      @treed-event="treedEvent"
    ></contacts-list>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'ContactsMenu',
  data () {
    return {
      search: ''
    }
  },
  components: {
    SelectSearch: () => import('components/contacts/SelectSearch'),
    OrganizeTree: () => import('components/organize/OrganizeTree'),
    ContactsList: () => import('components/contacts/ContactsList')
  },
  computed: {
    ...mapGetters('contacts', ['selects', 'selected', 'treed'])
  },
  mounted () {
    this.loadAllTeams()
    this.loadDutys()
    this.loadRoles()
    this.loadGroups()
  },
  methods: {
    ...mapActions('team', ['loadAllTeams']),
    ...mapActions('role', ['loadRoles']),
    ...mapActions('group', ['loadGroups']),
    ...mapActions('duty', ['loadDutys']),
    ...mapMutations('contacts', ['updateSelected', 'updateTreed']),
    selectedEvent (selected) {
      // 更改选中的下拉类型
      this.updateSelected(selected)
      // 默认选择列表中的第一个并且选中它
      var treedList = []
      if (this.selected.name === 'group') {
        treedList = treedList.filter(t => { return t.psonId === this.$myinfo.id })
      } else {
        treedList = this.selected.data
      }
      this.treedEvent(treedList.length > 0 ? treedList[0] : { id: 0 })
    },
    // 点击节点后，渲染人员数据
    treedEvent (node) {
      this.updateTreed({ name: this.selected.name, id: node.id })
      this.$emit('initOnLoad')
    },
    ediEvent (organizeNode, type) {
      this.$emit('organizeEdit', organizeNode, type)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
