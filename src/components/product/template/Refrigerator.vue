<template>
  <div>
    <!-- 1.出风口数量 出风方向 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.OutletNumber"
        :label="$t('product.fields.outletNumber')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="个"
      />
      <q-field
        filled
        stack-label
        :label="$t('product.fields.windDirection')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          dense
          v-model="fields.params.WindDirection"
          val="侧出风"
          label="侧出风"
        />
        <q-radio
          dense
          v-model="fields.params.WindDirection"
          val="顶出风"
          label="顶出风"
          class="q-ml-md"
        />
      </q-field>
    </div>

    <!-- 2.电源类型 压缩机类型 -->
    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        :value="fields.params.Power"
        @input="payload=>{fields.params.Power=payload.dictValue}"
        module="product"
        field="power"
        :label="$t('dictionary.power')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-field
        filled
        stack-label
        :label="$t('product.fields.compressorType')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          dense
          v-model="fields.params.CompressorType"
          val="定频"
          label="定频"
        />
        <q-radio
          dense
          v-model="fields.params.CompressorType"
          val="变频"
          label="变频"
          class="q-ml-md"
        />
      </q-field>
    </div>

    <!-- 3.控制精度 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ControlPrecision"
        :label="$t('product.fields.controlPrecision')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="℃"
      />
      <q-input
        filled
        v-model="fields.params.RefrigeratingCapacity"
        :label="$t('product.fields.refrigeratingCapacity2')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kW"
      />
    </div>

    <!-- 4.制冷量 水泵扬程 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.PumpHead"
        :label="$t('product.fields.pumpHead')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="m"
      />
      <q-input
        filled
        v-model="fields.params.NetWeight"
        :label="$t('product.fields.netWeight')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
      />
    </div>

    <!-- 5.外形尺寸-长 宽 高-->
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

    <!-- 4.是否有脚轮包装箱 -->
    <div class="row q-col-gutter-x-md">
      <q-field
        filled
        stack-label
        :label="$t('product.fields.hasCasters')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          dense
          v-model="fields.params.HasCasters"
          val="无"
          label="无"
        />
        <q-radio
          dense
          v-model="fields.params.HasCasters"
          val="有"
          label="有"
          class="q-ml-md"
        />
      </q-field>

      <q-field
        filled
        stack-label
        :label="$t('product.fields.hasBoxes')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          dense
          v-model="fields.params.HasBoxes"
          val="无"
          label="无"
        />
        <q-radio
          dense
          v-model="fields.params.HasBoxes"
          val="有"
          label="有"
          class="q-ml-md"
        />
      </q-field>

      <!-- 6.语言种类-->
      <q-field
        filled
        stack-label
        :label="$t('product.fields.languageCategory')"
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          dense
          v-model="fields.params.LanguageCategory"
          val="中文"
          label="中文"
        />
        <q-radio
          dense
          v-model="fields.params.LanguageCategory"
          val="英文"
          label="英文"
          class="q-ml-md"
        />
      </q-field>
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
