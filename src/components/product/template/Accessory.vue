<template>
  <div>
    <!-- 配置类型、成熟度 -->
    <div class="row q-col-gutter-x-md">
      <q-field
        :class="['col-12', 'col-sm-6', { 'g-padding-bottom20': $q.screen.lt.sm }]"
        filled
      >
        <q-checkbox
          v-if="fields.classification!=='automation'"
          v-model="fields.configType"
          :true-value="2"
          :false-value="1"
          :label="$t('product.fields.specialConfig')"
          color="teal"
        />
        <template v-else>
          <q-radio
            v-model="fields.configType"
            :val="0"
            :label="$t('product.fields.configType0')"
          />
          <q-radio
            v-model="fields.configType"
            :val="1"
            :label="$t('product.fields.configType1')"
          />
          <q-radio
            v-model="fields.configType"
            :val="2"
            :label="$t('product.fields.configType2')"
          />
        </template>
      </q-field>
      <q-field
        class="col-12 col-sm-6"
        filled
      >
        <q-radio
          v-model="fields.maturity"
          :val="0"
          :label="$t('product.fields.maturity0')"
        />
        <q-radio
          v-model="fields.maturity"
          :val="1"
          :label="$t('product.fields.maturity1')"
          class="q-ml-md"
        />
        <q-radio
          v-model="fields.maturity"
          :val="2"
          :label="$t('product.fields.maturity2')"
          class="q-ml-md"
        />
      </q-field>
    </div>

    <!-- 规格型号、物料代码 -->
    <div class="row q-col-gutter-x-md g-margin-top20">
      <q-input
        filled
        v-model="fields.specModel"
        :label="$t('product.fields.specModel')"
        :rules="[val => !!val || $t('product.rules.specModelTips')]"
        class="col-12 col-sm-6"
      />
      <q-input
        filled
        v-model="fields.brand"
        :label="$t('product.fields.brand')"
        :rules="[val => !!val || $t('product.rules.brandTips')]"
        class="col-12 col-sm-6"
      />
    </div>

    <q-input
      filled
      v-model="fields.materialCode"
      :label="$t('product.fields.materialCode')"
      :rules="[val => materialCodeRule(val)]"
    />
  </div>
</template>

<script>
export default {
  name: 'Accessory',
  props: {
    fields: Object
  },
  methods: {
    materialCodeRule (value) {
      // if (this.fields.maturity > 0 && this.fields.configType < 2) {
      //   if (!value || (value && value.trim() === '')) {
      //     return '非设计中或非定制的附件需填写物料编码'
      //   } else if (!new RegExp('(^$)|^\\d*(\\.\\d+)*$').test(value)) {
      //     return '编码需由数字和小数点组成'
      //   }
      // } else {
      if (value && value.trim() !== '' && !new RegExp('(^$)|^\\d*(\\.\\d+)*$').test(value)) {
        return '编码需由数字和小数点组成'
      } else {
        return true
      }
      // }
    }
  }
}
</script>

<style lang='scss' scoped></style>
