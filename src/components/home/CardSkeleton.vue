<template>
  <q-card class="my-widget-card">
    <q-card-section>
      <q-skeleton type="text" />
    </q-card-section>

    <q-separator />

    <q-item
      v-for="item in [1, 2, 3]"
      :key="item"
    >
      <q-item-section>
        <q-item-label caption>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
export default {
  name: 'CardSkeleton'
}
</script>

<style lang="scss" scoped>
.my-widget-card {
  height: 270px;
  overflow: hidden;
}
</style>
