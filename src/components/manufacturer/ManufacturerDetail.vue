<template>
  <resource-layout
    category='manufacturer'
    :objectID='+id'
    :categoryModel="model"
    :showMenu="model.createByID===$myinfo.id || !!$myinfo.auth.role.isSystemAdministrator"
  >
    <template #titleBadge>
      <q-badge
        color="orange"
        align="top"
        class="q-pa-xs cursor-pointer q-mr-sm"
      >
        {{model.classification==='outsource'?'外协':'内部'}}
      </q-badge>

      <q-badge
        v-if="!$myinfo.auth.role.isOutsource"
        color="info"
        align="top"
        class="q-pa-xs cursor-pointer"
      >
        {{model.grade}}
      </q-badge>
    </template>

    <template slot="logo">
      <div>{{`${model.canControl?'生产可管控':'生产不管控'}`}}</div>
    </template>
  </resource-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ManufacturerDetail',
  components: {
    ResourceLayout: () => import('layouts/ResourceLayout')
  },
  props: {
    id: { type: [String, Number], required: true }
  },
  computed: {
    ...mapGetters('manufacturer', ['manufacturer']),
    model () {
      return this.manufacturer(+this.id)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
