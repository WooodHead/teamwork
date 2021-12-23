<template>
  <div
    :style="`height:${$q.screen.height-128}px;overflow-x: hidden;`"
    class=" q-mt-md bg-white scroll"
  >
    <q-list>
      <!-- 根目录成员模块 -->
      <q-item v-if="newData.length===0">
        <q-item-section class="q-my-sm ellipsis text-grey-6">
          暂无{{selected.name==='group'?'群组':selected.name==='role'?'角色':'职位'}}
        </q-item-section>
      </q-item>     
      <q-item
        dense
        clickable
        v-for="d in newData"
        :key="d.id"
        :active="treed.id===d.id"
        active-class="text-primary"
        @click="treedEvent(d)"
      >
        <q-item-section class="q-my-sm">
          <span
            class="ellipsis"
            :style="$q.screen.width > 1024?'width: 100%;':'width:100%'"
          >
            {{d.name||d.title}}
          </span>
        </q-item-section>
        <q-item-section
          side
          v-if="treed.id===d.id"
        >
          <div>
            <q-btn
              flat
              round
              dense
              icon="person_add"
              color="info"
              title="添加成员"
              v-if="($myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist||selected.name==='group')&&selected.name!='team'&&selected.name!='duty'"
              @click.stop="showSelect=true"
            />
            <q-btn
              flat
              round
              dense
              icon="sms"
              color="green-3"
              title="群聊"
              v-if="selected.name=='group'"
              @click.stop="chat(d)"
            />
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="blue-9"
              title="编辑"
              v-if="($myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist||selected.name==='group')&&selected.name!='team'"
              @click.stop="editEvent(d)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              title="删除"
              v-if="($myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist||selected.name==='group')&&selected.name!='team'"
              @click.stop="deleteEvent(d)"
            />
          </div>
          <!-- 成员关系批量添加弹窗 -->
          <q-dialog
            v-model="showSelect"
            transition-show="slide-up"
            transition-hide="slide-down"
          >
            <person-select-panel
              style="width: 600px; max-width: 90vw;"
              @multiSelect="multiSelect"
              :isVirtualScroll="true"
              :multiple="true"
              :initSelectedPersonIDs="members"
            />
          </q-dialog>
        </q-item-section>
      </q-item>
      <!-- 新建按钮 -->
      <q-item v-if="!isAdd">
        <q-btn
          flat
          stack
          :label="$t(`contacts.add.${selected.name}`)"
          icon="add"
          class="fit"
          color="green-9"
          v-if="($myinfo.auth.role.isSystemAdministrator||$myinfo.auth.role.isHRSpecialist||selected.name==='group')&&selected.name!='team'"
          @click.stop="selected.name==='duty'? addDuty(): isAdd = true "
        />
      </q-item>
      <!-- (角色、群组、职位)新建组件动态引入 -->
      <role-add
        v-if="isAdd&&selected.name==='role'"
        @cancelAdd="isAdd = false"
        @saveAdd="isAdd = false"
      />
      <duty-add
        v-if="isAdd&&selected.name==='duty'"
        @cancelAdd="isAdd = false"
        @saveAdd="isAdd = false"
      />
      <group-add
        v-if="isAdd&&selected.name==='group'"
        @cancelAdd="isAdd = false"
        @saveAdd="isAdd = false"
      />
    </q-list>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format // 字符串首字母大写
import { showConfirm } from '@/utils/show-confirm'
export default {
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
      isAdd: false, // 定义用于控制添加按钮的可见性
      showSelect: false, // 定义控制人员选择框的可见性
      members: [] // 定义选中的人员列表
    }
  },
  components: {
    RoleAdd: () => import('components/role/RoleAdd'),
    // DutyEdit: () => import('components/duty/DutyEdit'),
    DutyAdd: () => import('components/duty/DutyAdd'),
    GroupAdd: () => import('components/group/GroupAdd'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  },
  computed: {
    // （角色、职位、群组）数据列表
    newData: {
      get () {
        var treeData = []
        if (this.selected.name === 'group') {
          treeData = this.selected.data.filter(d => { return (d.name || d.title).indexOf(this.search) !== -1 && (d.psonId === this.$myinfo.id) })
        } else {
          treeData = this.selected.data.filter(d => { return (d.name || d.title).indexOf(this.search) !== -1 })
        }
        return treeData
      }
    }
  },
  methods: {
    // 引入异步处理方法
    ...mapActions('role', ['updateRoleMembers', 'deleteRole']),
    ...mapActions('duty', ['deleteDuty']),
    ...mapActions('group', ['updateGroupField', 'deleteGroup']),
    ...mapActions('member', ['loadMembers']),
    ...mapActions('person', ['loadPersons']),
    ...mapMutations('person', ['setGroupId', 'setRoleId']),
    // 
    addDuty () {
      // 弹出编辑弹框
      this.$q.dialog(
        {
          component: require(`components/${this.selected.name}/`).default,
          parent: this,
          dObj: {
            code: undefined,
            des: null,
            id: 0,
            level: 10,
            name: '' 
          }
        })
    },
    // 改变节点选中
    treedEvent (node) {
      this.$emit('treed-event', node)
      this.loadMembers({ objectID: node.id, category: this.selected.name })
    },
    // 编辑（角色、职位、群组）
    editEvent (node) {
      // 弹出编辑弹框
      this.$q.dialog(
        {
          component: require(`components/${this.selected.name}/`).default,
          parent: this,
          dObj: node // 传入子组件的参数对象
        })
    },
    // 删除（角色、职位、群组）
    deleteEvent (node) {
      var _this = this
      // 弹出删除弹框
      showConfirm(_this.$t('message.reallyDelete'), () => {
        this.$store.state.contacts[`selected${capitalize(_this.selected.name)}`] = _this.selected.data[0].id
        _this[`delete${capitalize(_this.selected.name)}`](node.id).then(res => {
          if (res) {
            _this.$emit('treed-event', _this.selected.data[0])
          }
        })
      })
    },
    multiSelect (selectedTeamers) {
      // 关闭人员选择弹框
      this.showSelect = false
      if (this.selected.name === 'role') {
        var roleID = this.treed.id
        var oldMembers = this.members
        var newMembers = _.map(selectedTeamers, 'id')
        this.updateRoleMembers({ roleID, newMembers, oldMembers }).then(() => {
          this.setRoleId(roleID)
          this.loadPersons({ byPage: false, moduleName: 'role' }).then(() => {
            var psons = this.$store.getters[`person/personsOf${capitalize(this.selected.name)}`](roleID)
            this.members = _.map(psons, 'id')
          })
        })
      } else if (this.selected.name === 'group') {
        var id = this.treed.id
        var fieldName = 'members'
        var value = _.map(selectedTeamers, 'id').join(',')
        this.updateGroupField({ id, fieldName, value }).then(() => {
          this.setGroupId(id)
          this.loadPersons({ byPage: false, moduleName: 'group' }).then(() => {
            var psons = this.$store.getters[`person/personsOf${capitalize(this.selected.name)}`](id)
            this.members = _.map(psons, 'id')
          })
        })
      }
    },
    // 群聊
    chat (treed) {
      // 打开聊天窗口
      this.$router.push({
        name: 'chat',
        params: { category: this.selected.name, objectID: treed.id }
      })
    }
  },
  watch: {
    selected (val) {
      this.isAdd = false
    },
    showSelect (val) {
      var psons = this.$store.getters[`person/personsOf${capitalize(this.selected.name)}`](this.treed.id)
      this.members = _.map(psons, 'id')
    }
  }

}
</script>

<style scoped lang="scss">
</style>
