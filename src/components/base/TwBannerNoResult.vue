<template>
  <q-banner class="bg-grey-3">
    <template v-slot:avatar>
      <q-icon
        :name="icon"
        :color="color"
      />
    </template>
    {{ info }}
    <template v-slot:actions>
      <slot name="header">
      </slot>
    </template>
  </q-banner>
</template>

<script>
export default {
  name: 'TwBannerNoResult',
  props: {
    icon: {
      type: String,
      required: false,
      default: 'info'
    },
    info: {
      type: String,
      required: false,
      default: function () {
        return this.$t('toolbar.noSearchResults')
      }
    },
    color: {
      type: String,
      required: false,
      default: 'info'
    }
  }
}
</script>

<style>
</style>
