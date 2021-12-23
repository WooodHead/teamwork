<template>
  <div>
    <!-- 1.总容积 供应机床数量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.TotalVolume"
        :label="$t('product.fields.totalVolume')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L"
      />
      <q-input
        filled
        v-model="fields.params.MachineNum"
        :label="$t('product.fields.machineNum')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="台"
      />
    </div>

    <!-- 2.供液泵扬程 供液泵流量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FeedPumpPressure"
        :label="$t('product.fields.feedPumpPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="m"
      />
      <q-input
        filled
        v-model="fields.params.FeedPumpFlow"
        :label="$t('product.fields.feedPumpFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
    </div>

    <!-- 3.污液提升泵扬程 污液提升泵流量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.SewageLiftPumpPressure"
        :label="$t('product.fields.sewageLiftPumpPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="m"
      />
      <q-input
        filled
        v-model="fields.params.SewageLiftPumpFlow"
        :label="$t('product.fields.sewageLiftPumpFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
    </div>

    <!-- 4.过滤精度 制冷剂制冷量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FiltrationPrecision"
        :label="$t('product.fields.filtrationPrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
      <q-input
        filled
        v-model="fields.params.RefrigeratingCapacity"
        :label="$t('product.fields.refrigeratingCapacity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
    </div>

    <!-- 5.供液循环周期-->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      :value="fields.params.FeedingCycle"
      @input="payload=>{fields.params.FeedingCycle=payload.dictValue}"
      module="product"
      field="feedingCycle"
      :label="$t('dictionary.feedingCycle')"
      class="g-padding-bottom20"
    />

    <!-- 6.换液循环周期-->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      :value="fields.params.LiquidExchangeCycle"
      @input="payload=>{fields.params.LiquidExchangeCycle=payload.dictValue}"
      module="product"
      field="liquidExchangeCycle"
      :label="$t('dictionary.liquidExchangeCycle')"
      class="g-padding-bottom20"
    />

    <!-- 7.总站内循环周期-->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      :value="fields.params.CycleInTerminus"
      @input="payload=>{fields.params.CycleInTerminus=payload.dictValue}"
      module="product"
      field="cycleInTerminus"
      :label="$t('dictionary.cycleInTerminus')"
      class="g-padding-bottom20"
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
  }
}
</script>
<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
