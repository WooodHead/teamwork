<template>
  <div>
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ManipulatorLoad"
        :label="$t('product.fields.manipulatorLoad')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
      />
      <q-input
        filled
        v-model="fields.params.ManipulatorZAxisStroke"
        :label="$t('product.fields.manipulatorZAxisStroke')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>

    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.BinCapacity"
        :label="$t('product.fields.binCapacity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="料位"
      />
      <q-input
        filled
        v-model="fields.params.TotalWeight"
        :label="$t('product.fields.totalWeightOnly')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
      />
    </div>
    <!-- 配套卡盘 -->
    <tw-select-edit
      filled
      :editable="$myinfo.auth.role.isProductManager"
      multiple
      :value="fields.params.Chuck"
      @input="payload=>{fields.params.Chuck=payload}"
      module="product"
      field="chuck"
      :label="$t('dictionary.chuck')"
      class="g-padding-bottom20"
    />

    <q-field
      filled
      class="g-margin-bottom20"
    >
      <q-toggle
        :label="{off:'非回转体',on:'回转体'}[fields.params.IsCyclotron]"
        icon="trip_origin"
        false-value="off"
        true-value="on"
        v-model="fields.params.IsCyclotron"
      />
    </q-field>

    <template v-if="fields.params.IsCyclotron==='on'">
      <!-- 最大工件尺寸 -->
      <div class="text-subtitle1">{{$t('product.fields.maxWorkpieceSize')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.MaxWorkpieceSize.Diameter"
          :label="$t('product.fields.diameter')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.MaxWorkpieceSize.Height"
          :label="$t('product.fields.height')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
      </div>
      <!-- 托盘尺寸 -->
      <div class="text-subtitle1">{{$t('product.fields.palletSize')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.PalletSize.Diameter"
          :label="$t('product.fields.diameter')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.PalletSize.Height"
          :label="$t('product.fields.height')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
      </div>
    </template>
    <template v-else>
      <!-- 最大工件尺寸 -->
      <div class="text-subtitle1">{{$t('product.fields.maxWorkpieceSize')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.MaxWorkpieceSize.Length"
          :label="$t('product.fields.length')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.MaxWorkpieceSize.Width"
          :label="$t('product.fields.width')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.MaxWorkpieceSize.Height"
          :label="$t('product.fields.height')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
      </div>
      <!-- 托盘尺寸 -->
      <div class="text-subtitle1">{{$t('product.fields.palletSize')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.PalletSize.Length"
          :label="$t('product.fields.length')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.PalletSize.Width"
          :label="$t('product.fields.width')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.PalletSize.Height"
          :label="$t('product.fields.height')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
      </div>
    </template>

    <!-- 外形尺寸 -->
    <div class="text-subtitle1">{{$t('product.fields.overallSizeOnly')}}</div>
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
  },
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  },
  created () {
    // 修复多选历史数据问题
    !_.isObject(this.fields.params.Chuck) &&
      (this.fields.params.Chuck = this.fields.params.Chuck.split(','))
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}
</style>
