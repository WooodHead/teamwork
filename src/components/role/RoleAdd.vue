<template>
  <q-form
    class="fit"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    autofocus
    @submit.prevent="onSubmit"
    @reset.native="onReset"
  >
    <q-item>
      <!-- 名称 -->
      <q-item-section>
        <q-input
          flat
          dense
          placeholder="请输入角色名称"
          v-model="role.name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请正确输入角色名称']"
        ></q-input>
        <q-input
          flat
          dense
          placeholder="请输入角色编码"
          v-model="role.code"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请正确输入角色编码']"
        ></q-input>
      </q-item-section>
      <!-- 保存/取消 -->
      <q-item-section side>
        <div>
          <q-btn
            flat
            round
            dense
            icon="done"
            title="保存"
            type="submit"
          >
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="clear"
            title="取消"
            type="reset"
          >
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      role: {
        id: 0,
        name: '',
        code: '',
        notes: ''
      }
    }
  },
  methods: {
    ...mapActions('role', ['updateRole']),
    // 保存添加
    onSubmit () {
      // 添加角色
      this.updateRole(this.role)
      this.$emit('saveAdd')
    },
    // 取消添加
    onReset () {
      this.$emit('cancelAdd')
    }
  }
}
</script>
