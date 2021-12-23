<template>
  <div class="full-width q-pt-sm">
    <q-separator
      v-show="separator"
      spaced
      :inset="inset"
    />
    <div
      class="flex "
      :class="'justify-'+align"
    >
      <q-btn
        flat
        :label="label"
        icon="archive"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwArchivedCount',
  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },
    align: {
      type: String,
      default: 'center' // start,end
    },
    separator: {
      type: Boolean,
      default: true
    },
    inset: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss"  scoped >
/deep/.q-btn__wrapper {
  padding-left: 0;
}
</style>
