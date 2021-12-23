<template>
  <tw-form @primary="onSubmit">
    <quasar-editor
      @input="(val)=>{editor=val}"
      folder="productDev"
      :applied="goIntoAction"
      placeholder="原因是..."
    />
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProductDevStatus',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    openType: {
      type: String,
      default: 'suspended'
    }
  },
  data () {
    return {
      editor: '',
      goIntoAction: false
    }
  },
  methods: {
    ...mapActions('productDev', ['updateStatus']),
    onSubmit () {
      this.goIntoAction = true
      // 更新激活或挂起
      this.updateStatus({
        Id: Number(this.id),
        Status: this.openType,
        Reason: this.editor
      }).then(res => {
        if (res) {
          // 路由跳转
          this.$router.push({
            name: 'productDevDetail',
            params: { id: Number(this.id) }
          })
        }
      })
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  }
}
</script>

<style scoped>
</style>
