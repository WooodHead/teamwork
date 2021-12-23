<template>
  <q-tree
    :style="`height:${$q.screen.height-106}px;`"
    class="scroll"
    ref="expandTree"
    :nodes="selected.data"
    node-key="id"
    label-key="name"
    selected-color="primary"
    default-expand-all
    :filter="search"
    :selected="treed.id"
  >
    <template v-slot:default-header="prop">
      <div class="fit row items-center">
        <div
          class="col cursor-pointer"
          @click.stop="treedEvent(prop.node)"
        >
          {{ prop.node.name }}
        </div>
        <div
          class="text-grey-9"
          v-if="!showForm&&treed.id===prop.node.id"
        >
          <q-icon
            class="q-mr-xs"
            v-ripple
            name="add"
            color="green-9"
            v-if="$myinfo.auth.role.isSystemAdministrator"
            @click.stop="addEvent(prop.node)"
          />
          <q-icon
            class="q-mr-xs"
            v-ripple
            name="edit"
            color="blue-9"
            v-if="$myinfo.auth.role.isSystemAdministrator"
            @click.stop="editEvent(prop.node)"
          />
          <q-icon
            v-ripple
            name="delete"
            color="red-9"
            v-if="$myinfo.auth.role.isSystemAdministrator"
            @click.stop="delEvent(prop.node)"
          />
          <q-icon
            v-ripple
            name="brightness_high"
            color="yellow-10"
            v-if="$myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isSeniorManager"
            @click.stop="toOrganizeDetail(prop.node)"
          />
        </div>
      </div>
    </template>
    <template v-slot:default-body="prop">
      <organize-form
        v-if="showForm&&prop.node.id===treed.id"
        :organize="organize"
        :showForm.sync="showForm"
      />
    </template>
  </q-tree>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { format } from 'quasar'
const { capitalize } = format // 字符串首字母大写
export default {
  name: 'OrganizeTree',
  props: {
    selected: {
      type: Object,
      required: true,
      default: () => { }
    },
    treed: {
      type: Object,
      required: true,
      default: () => { }
    },
    search: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showForm: false,
      organize: {
        organizeAddress: {
          type: 'none', // 三个值可选，none、cityname、poi
          value: '' // 与type关联，type=none是''，type=cityname是城市名，type=poi是地点对象
        }
      },
      opentype: ''
    }
  },
  components: {
    'organize-form': () => import('components/organize/OrganizeForm')
  },
  computed: {
    ...mapGetters('person', ['personsOfOrganize'])
  },
  methods: {
    ...mapActions('organize', ['deleteOrganize']),
    treedEvent (node) {
      this.$emit('treed-event', node)
    },
    addEvent (node) {
      this.organize = {
        id: 0,
        type: 1,
        parentId: node.id,
        path: node.path + '.' + 0,
        level: node.level + 1,
        name: '',
        shortName: '',
        organizeAddress: {
          type: 'none', // 三个值可选，none、cityname、poi
          value: '' // 与type关联，type=none是''，type=cityname是城市名，type=poi是地点对象
        }
      }
      // this.showForm = true
      this.$refs.expandTree.setExpanded(node.id, true)
      this.opentype = 'add'
      this.$emit('edit-event', this.organize, this.opentype)
    },
    editEvent (node) {
      this.organize = node
      // this.showForm = true
      this.$refs.expandTree.setExpanded(node.id, true)
      this.opentype = 'edit'
      this.$emit('edit-event', this.organize, this.opentype)
    },
    delEvent (node) {
      let that = this
      if (node.children && node.children.length > 0) {
        showConfirm(that.$t('contacts.organize.deleteAlert'))
      } else {
        let childs = that.personsOfOrganize(node.id)
        if (childs && childs.length) {
          showConfirm('该机构下还有成员未移除，请先移除成员，再删除该机构')
        } else {
          showConfirm(that.$t('message.reallyDelete'), () => {
            that.$store.state.contacts[`selected${capitalize(that.selected.name)}`] = node.parentId
            that.deleteOrganize(node.id)
          })
        }
      }
    },
    // 跳转机构详情页
    toOrganizeDetail (node) {
      this.$router.push({
        name: 'organizeDetail',
        params: { id: node.id }
      })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.q-tree__node--parent > .q-tree__node-collapsible > .q-tree__node-body {
  padding: 0px 0 6px 27px;
}
/deep/.q-tree__node-body {
  padding: 0px 0 6px 5px;
}
</style>
