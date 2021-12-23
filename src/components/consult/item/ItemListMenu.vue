<template>
  <div class="row">
    <q-btn
      v-if="$myinfo.auth.role.isSystemAdministrator || $myinfo.auth.role.isConsultAdministrator"
      :class="{'q-mr-md':!$q.platform.is.mobile}"
      :outline="outline"
      :dense="dense"
      rounded
      :flat="flat"
      unelevated
      :label="$t('consult.item.editType')"
      color="primary"
      @click="$emit('itemType')"
    />
    <q-btn
      v-if="showConsultAdministrator"
      :outline="outline"
      :dense="dense"
      :flat="flat"
      rounded
      unelevated
      :label="$t('consult.item.canNotFind')"
      :title="$t('consult.item.canNotFindTitle')"
      color="primary"
      @click="$emit('chat')"
    />
  </div>
</template>

<script>
export default {
  name: 'ItemListMenu',
  props: {
    outline: {
      type: Boolean,
      default: true
    },
    showConsultAdministrator: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
