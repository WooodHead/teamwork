<template>
  <q-card-actions :align="align">
    <q-btn
      v-for="(item,index) in action"
      :key="item.type"
      :outline="index>0"
      :label="item.label"
      :color="item.color||'primary'"
      @click="$emit(item.action)"
      :class="{'save-draft': item.action === 'save','q-px-sm':item.label&&item.label.length===2}"
      :disable="item.disable||false"
      rounded
    />
  </q-card-actions>
</template>

<script>
export default {
  name: 'TwFormAction',
  props: {
    action: {
      type: Array,
      required: true
    },
    align: {
      type: String,
      default: 'center',
      required: false
    }
  }
}
</script>

<style>
</style>
