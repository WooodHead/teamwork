<template>
  <tw-form @primary="submit">
    <quasar-editor
      @input="(val)=>{editor=val}"
      folder="project"
      :applied="goIntoAction"
      placeholder="原因是..."
    />
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProjectStatus',
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
    ...mapActions('project', ['updateStatus']),
    submit () {
      this.goIntoAction = true
      // 更新立项或者结项时间
      this.updateStatus({
        ProjectID: Number(this.id),
        Status: this.openType.replace('activate', 'doing'),
        Reason: this.editor
      }).then(res => {
        if (res) {
          // 路由跳转
          this.$router.push({
            name: 'projectDetail',
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
