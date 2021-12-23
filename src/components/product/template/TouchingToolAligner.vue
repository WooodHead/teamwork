<template>
  <div>
    <!-- 1.对刀面直径 重复精度2 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.FaceDiameter"
        :label="$t('product.fields.faceDiameter')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.CompressionStroke"
        :label="$t('product.fields.compressionStroke')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>

    <!-- 2.触发力 触发压缩行程 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.Repeatability"
        :label="$t('product.fields.repeatability2σ')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
      <q-input
        filled
        v-model="fields.params.TriggerForceMin"
        :label="$t('product.fields.triggerForceMin')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="N"
      />
    </div>

    <!-- 3.防护等级 可测最小刀具直径 -->
    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.ProtectionLevel"
        @input="payload=>{fields.params.ProtectionLevel=payload.dictValue}"
        module="product"
        field="protectionLevel"
        :label="$t('dictionary.protectionLevel')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.MeasurableToolDiameterMin"
        :label="$t('product.fields.measurableToolDiameterMin')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>

    <!-- 4.功能 -->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      multiple
      :value="fields.params.Features"
      @input="payload=>{fields.params.Features=payload}"
      module="product"
      field="features"
      :label="$t('dictionary.features')"
      class="col-12 col-sm-6 g-padding-bottom20"
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
