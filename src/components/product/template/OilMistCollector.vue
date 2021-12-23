<template>
  <div>
    <!-- 1.最大风量 静压 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.AirVolumeMax"
        :label="$t('product.fields.airVolumeMax')"
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

    <!-- 2.额定功率 过滤原理 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.RatedPower"
        :label="$t('product.fields.ratedPower')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="W"
      />
      <q-input
        filled
        v-model="fields.params.FilterPrinciples"
        :label="$t('product.fields.filterPrinciples')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
      </q-input>
    </div>

    <!-- 3.精度 效率 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Precision"
        :label="$t('product.fields.filtrationPrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
      <q-input
        filled
        v-model="fields.params.Effectiveness"
        :label="$t('product.fields.effectiveness')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="%"
      />
    </div>

    <!-- 4.噪声 总质量 -->
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
        v-model="fields.params.TotalWeight"
        :label="$t('product.fields.totalWeight')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
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
