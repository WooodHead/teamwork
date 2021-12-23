<template>
  <div>
    <q-input
      filled
      v-model="fields.params.OilCupStorage"
      :label="$t('product.fields.oilCupStorage')"
      :rules="[$rules.decimal($t('rule.numeric'))]"
      class="col-12 col-sm-6"
      suffix="mL"
    />

    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.OilBrand"
        @input="payload=>{fields.params.OilBrand= payload.dictValue}"
        module="product"
        field="oilBrand"
        :label="$t('dictionary.oilBrand')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.OilAgent"
        @input="payload=>{fields.params.OilAgent= payload.dictValue}"
        module="product"
        field="oilAgent"
        :label="$t('dictionary.oilAgent')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.SingleFuelConsumptionMax"
        :label="$t('product.fields.singleFuelConsumptionMax')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mL/h"
      />
      <q-input
        filled
        v-model="fields.params.SingleAirConsumption"
        :label="$t('product.fields.singleAirConsumption')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.AirPressure.Min"
        :label="$t('product.fields.minimumAirPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
      <q-input
        filled
        v-model="fields.params.AirPressure.Max"
        :label="$t('product.fields.maximumAirPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.AmbientTemperature.Min"
        :label="$t('product.fields.minimumAmbientTemperature')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="℃"
      />
      <q-input
        filled
        v-model="fields.params.AmbientTemperature.Max"
        :label="$t('product.fields.maximumAmbientTemperature')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="℃"
      />
    </div>

    <div class="row q-col-gutter-x-md g-padding-bottom20">
      <q-input
        filled
        v-model="fields.params.AdjustableFrequency.Min"
        :label="$t('product.fields.minimumAdjustableFrequency')"
        :class="['col-12', 'col-sm-6', { 'g-padding-bottom20': $q.screen.lt.sm }]"
      >
      </q-input>
      <q-input
        filled
        v-model="fields.params.AdjustableFrequency.Max"
        :label="$t('product.fields.maximumAdjustableFrequency')"
        class="col-12 col-sm-6"
      >
      </q-input>
    </div>

    <q-input
      filled
      v-model="fields.params.SinglePipingLength"
      :label="$t('product.fields.singlePipingLength')"
      :rules="[$rules.decimal($t('rule.numeric'))]"
      class="col-12 col-sm-6"
      suffix="m"
    />
  </div>

</template>

<script>
export default {
  props: {
    fields: Object
  },
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
