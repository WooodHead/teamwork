<template>
  <div>
    <!-- 3.防护等级 重复精度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Repeatability"
        :label="$t('product.fields.repeatability2σ')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.ProtectionLevel"
        @input="payload=>{fields.params.ProtectionLevel= payload.dictValue}"
        module="product"
        field="protectionLevel"
        :label="$t('dictionary.protectionLevel')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
    </div>

    <!-- 1.最小可测刀具直径 最大可测刀具直径 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.MeasurableToolDiameter.Min"
        :label="$t('product.fields.mininumMeasurableToolDiameter')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.MeasurableToolDiameter.Max"
        :label="$t('product.fields.maxinumMeasurableToolDiameter')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>

    <!-- 2.最小绝对精度 最大绝对精度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.AbsolutePrecision.Min"
        :label="$t('product.fields.mininumAbsolutePrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
      <q-input
        filled
        v-model="fields.params.AbsolutePrecision.Max"
        :label="$t('product.fields.maxinumAbsolutePrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
    </div>

    <!-- 4.功能 -->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      multiple
      :value="fields.params.Features"
      @input="payload=>{ fields.params.Features=payload}"
      module="product"
      field="features"
      :label="$t('dictionary.features')"
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
    !_.isObject(this.fields.params.Features) &&
      (this.fields.params.Features = this.fields.params.Features.split(','))
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
