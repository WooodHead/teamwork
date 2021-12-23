<template>
  <div>
    <!-- 1.制冷量 输入功率 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.CoolingCapacity"
        :label="$t('product.fields.coolingCapacity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
      <q-input
        filled
        v-model="fields.params.InputPower"
        :label="$t('product.fields.inputPower')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
    </div>

    <!-- 2.液箱容积 过滤精度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.TankVolume"
        :label="$t('product.fields.tankVolume')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L"
      />
      <q-input
        filled
        v-model="fields.params.FiltrationPrecision"
        :label="$t('product.fields.filtrationPrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
    </div>

    <!-- 3.制冷系统控制方式 温度调节精度 -->
    <div class="row q-col-gutter-x-md">
      <q-field
        filled
        stack-label
        :label="$t('product.fields.compressorType')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          dense
          v-model="fields.params.RefrigerationSystemControlMode"
          val="定频"
          label="定频"
        />
        <q-radio
          dense
          v-model="fields.params.RefrigerationSystemControlMode"
          val="变频"
          label="变频"
          class="q-ml-md"
        />
      </q-field>
      <q-input
        filled
        v-model="fields.params.TemperatureControlPrecision"
        :label="$t('product.fields.temperatureControlPrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="℃"
      />
    </div>

    <!-- 4.最小供液流量 最大供液流量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FeedFlow.Min"
        :label="$t('product.fields.minimumFeedFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
      <q-input
        filled
        v-model="fields.params.FeedFlow.Max"
        :label="$t('product.fields.maximumFeedFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
    </div>

    <!-- 5.最小供液压力 最大供液压力-->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FeedPressure.Min"
        :label="$t('product.fields.minimumFeedPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
      <q-input
        filled
        v-model="fields.params.FeedPressure.Max"
        :label="$t('product.fields.maximumFeedPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
    </div>

    <!-- 6.最低使用环境温度 最高使用环境温度-->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.OperatingAmbientTemperature.Min"
        :label="$t('product.fields.minimumOperatingAmbientTemperature')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="℃"
      />
      <q-input
        filled
        v-model="fields.params.OperatingAmbientTemperature.Max"
        :label="$t('product.fields.maximumOperatingAmbientTemperature')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="℃"
      />
    </div>

    <!-- 7.外形尺寸-长 宽 高-->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.OverallSize.Length"
        :label="$t('product.fields.length')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-4"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.OverallSize.Width"
        :label="$t('product.fields.width')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-4"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.OverallSize.Height"
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

// .my-radio {
//   line-height: 29px;
// }

// .my-radio-label {
//   margin-top: 8px;
//   font-size: 12px;
//   color: rgba(0, 0, 0, 0.6);
// }
</style>
