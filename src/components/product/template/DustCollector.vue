<template>
  <div>
    <!-- 1.风量 静压 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.AirVolume"
        :label="$t('product.fields.airVolume')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="m³/h"
      />
      <q-input
        filled
        v-model="fields.params.StaticPressure"
        :label="$t('product.fields.staticPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="Pa"
      />
    </div>

    <!-- 2.功率 过滤精度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Power"
        :label="$t('product.fields.power')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
      <q-input
        filled
        v-model="fields.params.FiltrationAccuracy"
        :label="$t('product.fields.filtrationAccuracy')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
    </div>

    <!-- 3.过滤原理 滤芯数量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FilterPrinciples"
        :label="$t('product.fields.filterPrinciples')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
      </q-input>
      <q-input
        filled
        v-model="fields.params.FilterElementCount"
        :label="$t('product.fields.filterElementCount')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="个"
      />
    </div>

    <!-- 4.噪声 噪声浮动范围 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Noise"
        :label="$t('product.fields.noise')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="dB"
      />
      <q-input
        filled
        v-model="fields.params.NoiseRange"
        :label="$t('product.fields.noiseRange')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="dB"
      />
    </div>

    <!-- 5.外形尺寸-长 宽 高-->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Size.Length"
        :label="$t('product.fields.length')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-4"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.Size.Width"
        :label="$t('product.fields.width')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-4"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.Size.Height"
        :label="$t('product.fields.height')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-4"
        suffix="mm"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fields: Object
  }
}
</script>
<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
