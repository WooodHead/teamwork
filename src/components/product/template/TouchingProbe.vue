<template>
  <div>
    <!-- 1.接触方式 z向触发力 -->
    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.TouchingMethod"
        @input="payload=>{fields.params.TouchingMethod=payload.dictValue}"
        module="product"
        field="touchingMethod"
        :label="$t('dictionary.touchingMethod')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.Z_DirectionTriggerForce"
        :label="$t('product.fields.z_DirectionTriggerForce')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="N"
      />
    </div>

    <!-- 2.接近方向 重复精度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ApproachingDirection"
        :label="$t('product.fields.approachingDirection')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
      </q-input>
      <q-input
        filled
        v-model="fields.params.Repeatability"
        :label="$t('product.fields.repeatability2σ')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="μm"
      />
    </div>

    <!-- 3.最小工作温度 最大工作温度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.OperatingTemperature.Min"
        :label="$t('product.fields.mininumOperatingTemperature')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="°C"
      />
      <q-input
        filled
        v-model="fields.params.OperatingTemperature.Max"
        :label="$t('product.fields.maxinumOperatingTemperature')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="°C"
      />
    </div>

    <!-- 4.防护等级 -->
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
