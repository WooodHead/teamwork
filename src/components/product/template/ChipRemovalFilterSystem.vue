<template>
  <div>
    <!-- 2.容积 排屑能力 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Volume"
        :label="$t('product.fields.volume')"
        class="col-12 col-sm-6"
        suffix="L"
      />
      <q-input
        filled
        v-model="fields.params.ChipRemovalCapacity"
        :label="$t('product.fields.chipRemovalCapacity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg/h"
      />
    </div>

    <!-- 3.最小压力 最大压力 -->
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

    <!-- 4.最小流量 最大流量 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Flow.Min"
        :label="$t('product.fields.minimumFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
      <q-input
        filled
        v-model="fields.params.Flow.Max"
        :label="$t('product.fields.maximumFlow')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="L/min"
      />
    </div>

    <!-- 5.过滤精度-->
    <q-input
      filled
      v-model="fields.params.FiltrationAccuracy"
      :label="$t('product.fields.filtrationAccuracy')"
      :rules="[$rules.decimal($t('rule.numeric'))]"
      suffix="μm"
    />

    <!-- 1.适用切屑类型 -->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      multiple
      :value="fields.params.ApplicableChipTypes"
      @input="payload=>{fields.params.ApplicableChipTypes=payload}"
      module="product"
      field="applicableChipTypes"
      :label="$t('dictionary.applicableChipTypes')"
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
  },
  created () {
    // 修复多选历史数据问题
    !_.isObject(this.fields.params.ApplicableChipTypes) &&
      (this.fields.params.ApplicableChipTypes = this.fields.params.ApplicableChipTypes.split(','))
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
