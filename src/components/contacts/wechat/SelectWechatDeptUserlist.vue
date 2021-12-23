<template>
  <q-dialog
    ref="dialog"
    :maximized="$q.platform.is.mobile"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin" :style="!$q.platform.is.mobile &&'width: 600px; max-width: 90vw;'">
      <q-card-section padding>
        <tw-search-panel :search.sync="search" :showPanelBtn="false" label="检索">
          <template v-slot:after>
             <q-btn round dense flat icon="close" v-close-popup />
          </template>
        </tw-search-panel>
      </q-card-section>
      <q-card-section padding style="height: calc(100vh - 60px - 94px);overflow: auto">
        <wechat-dept-userlist-panel :disable="disable" :search.sync="search" :root-depts="rootDepts" @update:selected="onSelectedClick" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'WechatDeptUserlist',
  props: {
    deptId: {
      type: Number,
      require: false,
      default: 1
    },
    transitionShow: {
      type: String,
      require: false,
      default: 'slide-up'
    },
    transitionHide: {
      type: String,
      require: false,
      default: 'slide-down'
    },
    disable: {
      type: Array,
      require: false,
      default: () => []
    }
  },
  data () {
    return {
      rootDepts: [],
      search: ''
    }
  },
  computed: {},
  created () {
    this.getWechatDeptlist().then(() => { this.rootDepts = this.$store.getters['wechat/deptsTree'](this.deptId) })
  },
  mounted () { },
  methods: {
    ...mapActions('wechat', ['getWechatDeptlist']),
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show () {
      this.$refs.dialog.show()
    },
    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit('hide')
    },
    onSelectedClick (user) {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit('ok', user)
      // 或带有有效负载：this.$emit('ok', { ... })
      // 然后隐藏对话框
      this.hide()
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    WechatDeptUserlistPanel: () => import('components/contacts/wechat/WechatDeptUserlistPanel')

  }
}
</script>

<style scoped lang="scss">
</style>
