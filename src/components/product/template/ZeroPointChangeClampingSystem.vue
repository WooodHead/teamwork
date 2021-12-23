<template>
  <div>
    <!-- 1.是否回转体 -->
    <q-field
      filled
      class="col-12 col-sm-6 g-padding-bottom20"
    >
      <q-toggle
        :label="{off:'非回转体',on:'回转体'}[fields.params.IsRevolvingBody]"
        icon="trip_origin"
        false-value="off"
        true-value="on"
        v-model="fields.params.IsRevolvingBody"
      />
    </q-field>

    <!-- 2.外形尺寸-长 宽 高-->
    <div
      v-if="fields.params.IsRevolvingBody==='on'"
      class="q-col-gutter-md row"
    >
      <q-input
        filled
        v-model="fields.params.Size.Diameter"
        :label="$t('product.fields.diameter')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.Size.Height"
        :label="$t('product.fields.height')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>
    <div
      v-else
      class="q-col-gutter-md row"
    >
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

    <!-- 3.最大重复定位精度 使用寿命 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.RepeatabilityMax"
        :label="$t('product.fields.repeatabilityMax')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.ServiceLife"
        :label="$t('product.fields.serviceLife')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="万次"
      />
    </div>

    <!-- 4.最小工作压力 最大工作压力 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.WorkPressure.Min"
        :label="$t('product.fields.mininumWorkPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
      <q-input
        filled
        v-model="fields.params.WorkPressure.Max"
        :label="$t('product.fields.maxinumWorkPressure')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="MPa"
      />
    </div>

    <!-- 4. 拓展功能 -->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      multiple
      :value="fields.params.ExtendedFeatures"
      @input="payload=>{fields.params.ExtendedFeatures=payload}"
      module="product"
      field="extendedFeatures"
      :label="$t('dictionary.extendedFeatures')"
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
    !_.isObject(this.fields.params.ExtendedFeatures) &&
      (this.fields.params.ExtendedFeatures = this.fields.params.ExtendedFeatures.split(','))
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
