<template>
  <div>
    <q-checkbox
      :label="label"
      v-model="canEdit"
    >
    </q-checkbox>
  </div>
</template>

<script>
export default {
  name: 'TwOnlyICanHandle',
  props: {
    meEdit: {
      type: [Number, Boolean],
      required: true,
      default: 1
    },
    label: {
      type: String,
      required: false,
      default: '仅自己可编辑'
    }
  },
  computed: {
    canEdit: {
      get () {
        return !!this.meEdit
      },
      set (val) {
        this.$emit('update:meEdit', val === true ? 1 : 0)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
