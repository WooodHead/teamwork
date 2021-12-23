<template>
  <div>
    <!-- 1.适用刀柄 刀库容量 -->
    <div class="row q-col-gutter-x-md">
      <tw-select-edit
        filled
        :editable="$myinfo.auth.role.isProductManager"
        multiple
        :value="fields.params.ApplicableShank"
        @input="payload=>{fields.params.ApplicableShank= payload}"
        module="product"
        field="shankInterface"
        :label="$t('dictionary.applicableShank')"
        class="col-12 col-sm-6 g-padding-bottom20"
      />
      <q-input
        filled
        v-model="fields.params.ToolCapacity"
        :label="$t('product.fields.toolCapacity')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="把"
      />
    </div>

    <!-- 2.临刀满刀最大直径 临刀空刀最大直径 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.MaxToolDiameter.Full"
        :label="$t('product.fields.fullMaxToolDiameter')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
      <q-input
        filled
        v-model="fields.params.MaxToolDiameter.Empty"
        :label="$t('product.fields.emptyMaxToolDiameter')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="mm"
      />
    </div>

    <!-- 3.刀位最大配重 刀库最大总配重 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.MaxToolWeight.Single"
        :label="$t('product.fields.singleMaxToolWeight')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
      />
      <q-input
        filled
        v-model="fields.params.MaxToolWeight.Total"
        :label="$t('product.fields.totalMaxToolWeight')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
      />
    </div>

    <!-- 4.允许最大刀具长度 刀库换刀形式 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ToolLengthMax"
        :label="$t('product.fields.toolLengthMax')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        placeholder="主轴端面开始计算"
        suffix="mm"
      />
      <q-field
        filled
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-radio
          v-model="fields.params.ToolChanger"
          val="0"
          label="非机械手换刀"
        />
        <q-radio
          v-model="fields.params.ToolChanger"
          val="1"
          label="机械手换刀"
        />
      </q-field>

    </div>

    <!-- 5.刀对刀换刀时间 备刀功能 -->
    <div class="row q-col-gutter-x-md">
      <q-input
        filled
        v-model="fields.params.ToolChangeTime"
        :label="$t('product.fields.toolChangeTime')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="s"
      />
      <q-field
        filled
        class="col-12 col-sm-6 g-padding-bottom20"
      >
        <q-toggle
          label="备刀功能"
          icon="gamepad"
          false-value="off"
          true-value="on"
          v-model="fields.params.IsPrepareTool"
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
