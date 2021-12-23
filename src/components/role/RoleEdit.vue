<template>
  <q-dialog
    ref="dialog"
    :persistent="true"
    :maximized="!$q.screen.gt.xs?true:false"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-form
        @submit.prevent="onSubmit"
        @reset.native="onReset"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">编辑</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            outlined
            dense
            class="q-pb-lg"
            v-model="roleObj.name"
            label="名称"
            placeholder="Placeholder"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请正确输入角色名称']"
          />
          <q-input
            outlined
            dense
            class="q-pb-lg"
            v-model="roleObj.code"
            label="编码"
            placeholder="Placeholder"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请正确输入编码']"
          />
          <q-input
            outlined
            dense
            class="q-pb-lg"
            v-model="roleObj.notes"
            label="说明"
            placeholder="Placeholder"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '请正确输入说明']"
          />
        </q-card-section>
        <!-- 按钮示例 -->
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="保存"
            type="submit"
          />
          <q-btn
            color="primary"
            label="取消"
            type="reset"
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
      roleObj: Object.assign({}, this.dObj)
    }
  },
  methods: {
    ...mapActions('role', ['updateRole']),
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onSubmit () {
      this.updateRole(this.roleObj)
      this.hide()
    },
    onReset () {
      this.hide()
    }
  }
}
</script>
