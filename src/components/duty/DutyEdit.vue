<template>
  <q-dialog
    ref="dialog"
    :persistent="true"
    :maximized="!$q.screen.gt.xs ? true : false"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-form @submit.prevent="onSubmit" @reset.native="onReset">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">编辑</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            filled
            dense
            class="q-pb-lg"
            v-model="dutyObj.name"
            label="名称"
            placeholder="请输入名称"
            lazy-rules
            autofocus
            :rules="[val => (val && val.length > 0) || '请正确编辑职位名称']"
          />
          <q-input
            filled
            dense
            class="q-pb-lg"
            v-model="dutyObj.level"
            label="等级"
            placeholder="请输入正整数，数字越小，等级越高"
            lazy-rules
          />
        </q-card-section>
        <!-- 按钮示例 -->
        <q-card-actions align="right">
          <q-btn
            outline
            color="primary"
            label="取消"
            type="reset"
            autofocus
            @keyup.esc.native="onReset"
          />
          <q-btn
            color="primary"
            autofocus
            label="保存"
            type="submit"
            @keyup.enter.native="onSubmit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    dObj: {
      type: Object
    }
  },
  data () {
    return {
      dutyObj: Object.assign({}, this.dObj)
    }
  },
  methods: {
    ...mapActions('duty', ['updateDuty']),
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
    onSubmit () {
      this.updateDuty(this.dutyObj)
      this.hide()
    },
    onReset () {
      this.hide()
    }
  }
}
</script>
