<template>
  <div>
    <q-toolbar class="q-px-none">
      <div class="row q-gutter-x-sm">
        <q-btn
          flat
          dense
          v-for="status in Object.keys(consultStatus)"
          :key="+status"
          :label="consultStatus[status].label"
          :color="+selectedStatus === +status ? 'primary' : ''"
          :class="+selectedStatus === +status ? 'text-primary' : 'text-black'"
          @click="$emit('statusChanged', +status)"
        />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ConsultStatusBar',
  computed: {
    ...mapState('consult', ['consultStatus', 'selectedStatus'])
  }
}
</script>

<style lang='scss' scoped>
</style>
