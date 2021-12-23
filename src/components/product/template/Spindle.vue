<template>
  <div>
    <!-- 1.刀柄接口 最高转速 -->
    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.ShankInterface"
        @input="payload=>{fields.params.ShankInterface=payload.dictValue}"
        module="product"
        field="shankInterface"
        :label="$t('dictionary.shankInterface')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.SpeedMax"
        :label="$t('product.fields.speedMax')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="r/min"
      />
    </div>

    <!-- 2.额定功率 额定电流 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.RatedPower"
        :label="$t('product.fields.ratedPower')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
      <q-input
        filled
        v-model="fields.params.RatedCurrent"
        :label="$t('product.fields.ratedCurrent')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="A"
      />
    </div>

    <!-- 3.额定扭矩 最大夹持刀具直径 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.RatedTorque"
        :label="$t('product.fields.ratedTorque')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="N·m"
      />
      <q-input
        filled
        v-model="fields.params.ClampingToolMax"
        :label="$t('product.fields.clampingToolMax')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>

    <!-- 4.电机形式 主轴外径 -->
    <q-input
      filled
      v-model="fields.params.Diameter"
      :label="$t('product.fields.spindleDiameter')"
      :rules="[$rules.decimal($t('rule.numeric'))]"
      class="col-12 col-sm-6"
      suffix="mm"
    />

    <div class="row q-col-gutter-x-md">
      <q-field
        filled
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-toggle
          :label="['同步电机','异步电机'][+fields.params.MotorForm]"
          icon="toys"
          false-value="0"
          true-value="1"
          v-model="fields.params.MotorForm"
        />
      </q-field>

      <q-field
        filled
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-toggle
          :label="{off:'非中空',on:'中空'}[fields.params.IsHollow]"
          icon="trip_origin"
          false-value="off"
          true-value="on"
          v-model="fields.params.IsHollow"
        />
      </q-field>
    </div>

    <!-- 5.主轴制冷液流量 主轴制冷液温度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.RefrigerantFlow"
        :label="$t('product.fields.refrigerantFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.RefrigerantTemperature"
        @input="payload=>{fields.params.RefrigerantTemperature=payload.dictValue}"
        module="product"
        field="refrigerantTemperature"
        :label="$t('dictionary.refrigerantTemperature')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <!-- 6.主轴制冷液压力 主轴正压密封气源质量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.RefrigerantPressure"
        :label="$t('product.fields.refrigerantPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.AirSourceQuality"
        @input="payload=>{fields.params.AirSourceQuality=payload.dictValue}"
        module="product"
        field="airSourceQuality"
        :label="$t('dictionary.airSourceQuality')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <!-- 7.主轴正压密封气源质量最小值 最大值 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.AirSourcePressure.Min"
        :label="$t('product.fields.minAirSourcePressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
      <q-input
        filled
        v-model="fields.params.AirSourcePressure.Max"
        :label="$t('product.fields.maxAirSourcePressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  },
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
