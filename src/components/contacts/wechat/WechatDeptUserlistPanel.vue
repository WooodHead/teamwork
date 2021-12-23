<template>
  <div>
    <q-list v-if="departments.length===0">
      <q-item v-for="i in 3" :key="i">
        <q-item-section avatar>
          <q-skeleton type="QAvatar" animation="fade" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list v-else v-for="department in departments" :key="department.id">
      <div v-if="!department.users.length&&!department.children.length">
        <tw-banner-no-result info="暂无成员" />
      </div>
      <template v-for="user in department.users">
        <q-item clickable :disable="disable.includes(user.userid)" @click="$emit('update:selected',user)" :key="'user-item-'+user.userid">
          <q-item-section
            avatar
            top
          >
            <q-avatar rounded>
              <img :src="user.avatar">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{user.name}}</q-item-label>
            <q-item-label caption>{{user.position}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset="item" :key="'user-separator-'+user.userid" />
      </template>
      <template v-for="d in department.children">
        <q-item clickable @click="nextDeptUserlistPanel(d.id)" :key="'dept-item-'+ d.id">
          <q-item-section
            avatar
            top
          >
            <q-avatar
              icon="folder"
              rounded
              color="blue-grey-1"
              text-color="light-blue"
            ></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{d.name}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
        </q-item>
        <q-separator
          inset="item"
          :key="'dept-separator-'+ d.id"
        />
      </template>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'WechatDeptUserlistPanel',
  props: {
    search: {
      type: String,
      require: true,
      default: ''
    },
    rootDepts: {
      type: Array,
      require: true,
      default: () => []
    },
    disable: {
      type: Array,
      require: false,
      default: () => []
    }
  },
  data () {
    return {
      departments: []
    }
  },
  computed: {
    changeParams () {
      let { search, rootDepts } = this
      return { search, rootDepts }
    }
  },
  watch: {
    changeParams: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal.search != null && newVal.search !== '') {
          this.departments = [{ users: _.filter(this.$store.state.wechat.users, u => u.name.toLowerCase().includes(newVal.search) > 0), children: [] }]
        } else {
          this.departments = newVal.rootDepts
        }
      }
    }
  },
  methods: {
    nextDeptUserlistPanel (deptId) {
      this.$q.dialog({
        component: () => import('components/contacts/wechat/SelectWechatDeptUserlist'),
        // 如果要访问自定义组件中的
        // 路由管理器、Vuex存储等,
        // 则为可选：
        parent: this, // 成为该Vue节点的子元素
        deptId: deptId,
        transitionShow: 'slide-left',
        transitionHide: 'slide-right',
        disable: this.disable
        // ...更多属性...
      }).onOk(user => {
        this.$emit('update:selected', user)
      }).onCancel(() => {

      }).onDismiss(() => {

      })
    }
  },
  components: {
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style scoped lang="scss">
</style>
