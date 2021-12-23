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
            v-model="groupObj.name"
            label="名称"
            placeholder="Placeholder"
            lazy-rules
            :rules="[val => (val && val.length > 0) || '请正确编辑群组名称']"
          />
          <q-input
            filled
            dense
            class="q-pb-lg"
            v-model="groupObj.notes"
            label="说明"
            placeholder="Placeholder"
            lazy-rules
            :rules="[val => (val && val.length > 0) || '请正确输入群组说明']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="取消"
            type="reset"
            outline
            autofocus
            @keyup.esc.native="hide"
          />
          <q-btn
            color="primary"
            label="保存"
            type="submit"
            autofocus
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
  directives: {
    foucs: {
      inserted: function (el) {
        el.foucs()
      }
    }
  },
  data () {
    return {
      groupObj: Object.assign({}, this.dObj)
    }
  },
  methods: {
    ...mapActions('group', ['updateGroup']),
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
      this.updateGroup(this.groupObj)
      this.hide()
    },
    onReset () {
      this.hide()
    }
  }
}
</script>
