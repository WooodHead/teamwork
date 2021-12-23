<template>
  <div>
    <!-- 1.最小压力 最大压力 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Pressure.Min"
        :label="$t('product.fields.minimumPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
      <q-input
        filled
        v-model="fields.params.Pressure.Max"
        :label="$t('product.fields.maximumPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
    </div>

    <!-- 2.最大压力 功率 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FlowMax"
        :label="$t('product.fields.flowMax')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
      <q-input
        filled
        v-model="fields.params.Power"
        :label="$t('product.fields.power')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
    </div>

    <!-- 3.过滤精度 -->
    <q-input
      filled
      v-model="fields.params.ThirdFiltrationAccuracy"
      :label="$t('product.fields.thirdFiltrationAccuracy')"
      :rules="[$rules.decimal($t('rule.numeric'))]"
      class="col-12 col-sm-6"
      suffix="μm"
    />

    <!-- 5.结构形式 -->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      :value="fields.params.StructureType"
      @input="payload=>{fields.params.StructureType=payload.dictValue}"
      module="product"
      field="structureType"
      :label="$t('dictionary.structureType')"
      class="g-padding-bottom20"
    />

    <!-- 6.适用刀具 循环周期 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ApplicableTool"
        :label="$t('product.fields.applicableTool')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.FeedingCycle"
        @input="payload=>{fields.params.FeedingCycle=payload.dictValue}"
        module="product"
        field="feedingCycle"
        :label="$t('dictionary.feedingCycle')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <!-- 7.最小粘度 最大粘度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.LiquidViscosity.Min"
        :label="$t('product.fields.minimumLiquidViscosity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="cSt"
      />
      <q-input
        filled
        v-model="fields.params.LiquidViscosity.Max"
        :label="$t('product.fields.maximumLiquidViscosity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="cSt"
      />
    </div>

    <!-- 8.适用要求 -->
    <q-input
      filled
      v-model="fields.params.Requirements"
      :label="$t('product.fields.requirements')"
      type="textarea"
    />
  </div>
</template>

<script>
export default {
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  },
  props: {
    fields: Object
  },
  created () {
    // 修复多选历史数据问题
    !Object.keys(this.fields.params).includes('ApplicableSpindle') &&
      (this.$set(this.fields.params, 'ApplicableSpindle', []))
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
