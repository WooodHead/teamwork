<template>
  <q-card
    flat
    class="q-mb-md"
  >
    <q-card-section>
      <div class="q-gutter-sm">
        <div class="text-h5">
          {{ title }}
          <q-badge
            align="middle"
            color="primary"
            class="q-mr-sm"
          >
            {{ $t(`product.fields.axisCount${axisCount===void 0?5:axisCount}`) }}
          </q-badge>
          <q-badge
            align="middle"
            color="secondary"
            class="q-mr-sm"
          >
            {{ $t(`product.fields.configType${configType===void 0?1:configType}`) }}
          </q-badge>
          <q-badge
            v-if="maturity<2"
            align="middle"
            color="accent"
          >
            {{ $t(`product.fields.maturity${maturity===void 0?2:maturity}`) }}
          </q-badge>
        </div>
        <div style="white-space: pre-wrap;">{{ notes }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>

export default {
  name: 'MachinetoolBrief',
  props: {
    title: { type: String, required: true, default: '' },
    axisCount: { type: Number, required: true, default: 5 },
    configType: { type: Number, required: true, default: 1 },
    maturity: { type: Number, required: true, default: 2 },
    notes: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.key {
  font-size: 1rem;
  font-weight: 400;
}

.value {
  font-size: 1.1rem;
  font-weight: 600;
  color: $dark;
}
</style>
