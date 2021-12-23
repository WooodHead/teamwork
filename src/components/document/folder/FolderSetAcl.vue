<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <!--
        ...内容
        ...使用q-card-section展现它?
      -->
      <q-card-section>
        <tw-secrecy-acl :secrecy.sync="secrecy" />
      </q-card-section>

      <!-- 按钮示例 -->
      <q-card-actions align="right">
        <q-btn
          outline
          color="primary"
          :label="$q.lang.label.cancel"
          @click="onCancelClick"
        />
        <q-btn
          class="bg-primary text-white"
          :label="$q.lang.label.ok"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    // ...你自定义的属性
    model: {
      type: Object,
      required: true,
      default: null
    }
  },
  components: {
    TwSecrecyAcl: () => import('components/base/TwSecrecyAcl')
  },
  data () {
    return {
      secrecy: { acl: this.model.acl, whiteList: this.model.whiteList }
    }
  },
  methods: {
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

    onOKClick () {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      // this.$emit('ok')
      // 或带有有效负载：this.$emit('ok', { ... })
      this.model.acl = this.secrecy.acl
      this.model.whiteList = this.secrecy.acl ? _.uniq(this.secrecy.whiteList) : []
      this.$emit('ok', this.model)
      // 然后隐藏对话框
      this.hide()
    },

    onCancelClick () {
      // 我们只需要隐藏对话框
      this.hide()
    }
  }
}
</script>
