<template>
  <q-page>

    <q-card class="card-grow-in-page">
      <q-card-section v-if="!$q.platform.is.mobile">
        <div class="text-h6 text-center">消息面板</div>
      </q-card-section>

      <q-separator v-if="!$q.platform.is.mobile" />

      <q-card-section class="q-pa-sm">
        <message-panel add-header />
      </q-card-section>

    </q-card>

  </q-page>
</template>
<script>
export default {
  components: {
    'message-panel': () => import('components/message/MessagePanel.vue')
  }
}
</script>
<style lang='scss' scoped>
</style>
