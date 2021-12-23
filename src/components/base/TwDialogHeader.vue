<template>
  <q-card-section>
    <div class="row">
      <div class="text-h6">
        <slot></slot>
      </div>
      <q-space />
      <q-btn
        flat
        round
        dense
        v-close-popup
        icon="close"
      />
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: 'TwDialogHeader'
}
</script>
