<template>
  <q-banner
    rounded
    class="bg-grey-3 col text-body1"
  >
    <template v-slot:avatar>
      <q-icon
        name="info"
        color="info"
      />
    </template>
    {{content||$t('document.blank')}}
  </q-banner>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
      required: false,
      description: '自定义内容'
    }
  },
  name: 'FolderNo'
}
</script>

<style>
</style>
