<template>
  <q-dialog
    v-model="showMatchNotes"
    persistent
    :maximized="$q.platform.is.mobile"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card :class="{ 'q-px-md min-width': $q.screen.gt.sm }">
      <!-- 头部信息 -->
      <modal-header>{{panelTitle}}</modal-header>

      <!-- show match notes -->
      <q-card-section>
        <div v-html="prettierNotes">{{prettierNotes}}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MatchNotesPanel',
  components: {
    ModalHeader: () => import('components/base/TwDialogHeader')
  },
  props: {
    id: { type: Number, required: true },
    fromReverse: { type: Boolean, default: false },
    modelName: { type: String }
  },
  data () {
    return {
      showMatchNotes: false
    }
  },
  watch: {
    showMatchNotes (newVal, oldVal) {
      newVal && this.init()
    }
  },
  computed: {
    ...mapState('product', ['productCheck', 'checkAccessoryIds']),
    ...mapState('productSelection', ['processJson']),
    panelTitle () {
      return this.fromReverse ? '校验结果' : '匹配度'
    },
    prettierNotes () {
      let msgHtml = ''
      if (this.fromReverse) {
        msgHtml += '<span style="color:#e48600;">当前机床及您已选中的附件校验结果如下：</span>'
      } else {
        msgHtml += `<span style="color:#e48600;">${this.modelName}及其所有附件匹配度结果如下：</span>`
      }

      if (this.productCheck.length === 0) {
        // 全部匹配提醒
        msgHtml += '<div style="color: #999999;">完全匹配</div>'
      } else {
        // 不符合工艺要求的提醒
        let noMatch = this.productCheck.filter(item => item.NotifyType === 1)
        let noSelected = this.productCheck.filter(item => item.NotifyType === 2)
        let noConfig = this.productCheck.filter(item => item.NotifyType === 3)
        noMatch.length && (msgHtml += this.assembleNotify(noMatch))

        if (noMatch.length && (noSelected.length || noConfig.length)) { msgHtml += '<hr>' }
        noSelected.length &&
          (msgHtml += this.assembleNotify(noSelected, noMatch.length + 1))
        if (noSelected.length && noConfig.length) { msgHtml += '<hr>' }
        noConfig.length &&
          (msgHtml += this.assembleNotify(noConfig, noMatch.length + noSelected.length + 1))
      }

      return msgHtml
    }
  },
  methods: {
    ...mapActions('product', ['reverseByProcess']),
    init () {
      this.reverseByProcess({
        process: this.processJson,
        modelId: this.id,
        accessoryIds: this.checkAccessoryIds.join()
      })
    },
    assembleNotify (data, rowNum = 1) {
      let msgHtml = ''
      for (let item of data) {
        // 纠正后台数据换行问题
        if (item.StandardVal.slice(0, 4) === '<br>') {
          item.StandardVal = item.StandardVal.slice(4)
        }
        // 组装参考范围
        msgHtml += `<div>${rowNum}、【${item.ObjectName}】不匹配，参考范围如下：<div style="margin-left:30px;color: #999999;">${item.StandardVal}</div></div>`
        rowNum++
      }
      return msgHtml
    }
  }
}
</script>

<style lang='scss' scoped>
.min-width {
  min-width: 500px;
}
</style>
