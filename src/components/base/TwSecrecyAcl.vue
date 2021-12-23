<template>
  <div>
    <q-checkbox
      :true-value="2"
      :false-value="0"
      v-model="secrecy.acl"
      :label="!secrecy.acl?'保密':`保密：仅以下${secrecy.whiteList.length}个人具有访问权限`"
    >
    </q-checkbox>
    <div
      class="row q-pl-sm"
      v-if="secrecy.acl===2"
    >
      <resource-team-view
        class="q-pl-xs"
        size="md"
        fontSize="0.7rem"
        position="text-left"
        :initPersonScope="initWhiteListScope"
        :members="secrecy.whiteList"
        @updateMembers="updateMembers"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwSecrecyAcl',
  props: {
    secrecy: {
      type: Object,
      required: true,
      default: () => { return { acl: 0, whiteList: [] } },
      desc: '保密的'
    },
    initWhiteListScope: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: '初始化白名单选择范围IDs'
    }
  },
  watch: {
    secrecy: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        !(this.secrecy.whiteList.includes(this.$myinfo.id)) && this.secrecy.whiteList.push(this.$myinfo.id)
      }
    }
  },
  methods: {
    updateMembers (ids) {
      !(ids.includes(this.$myinfo.id)) && ids.push(this.$myinfo.id)
      this.secrecy.whiteList = ids
      this.$emit('update:secrecy', this.secrecy)
    }
  },
  components: {
    ResourceTeamView: () => import('components/resource/ResourceTeamView')
  }
}
</script>

<style scoped lang="scss">
</style>
