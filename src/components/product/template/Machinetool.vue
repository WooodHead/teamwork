<template>
  <div>
    <!-- 配置类型、成熟度 -->
    <div class="row q-col-gutter-x-md">
      <q-field
        class="col-12 col-sm-6"
        filled
      >
        <q-radio
          v-model="fields.configType"
          :val="0"
          :label="$t('product.fields.configType0')"
        />
        <q-radio
          v-model="fields.configType"
          :val="1"
          :label="$t('product.fields.configType1')"
          class="q-ml-md"
        />
        <q-radio
          v-model="fields.configType"
          :val="2"
          :label="$t('product.fields.configType2')"
          class="q-ml-md"
        />
      </q-field>
      <q-field
        filled
        :class="['col-12', 'col-sm-6', { 'g-margin-top20': $q.screen.lt.sm }]"
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

    <!-- 三轴、五轴 -->
    <q-field
      filled
      class="g-margin-top20"
    >
      <q-radio
        v-model="fields.params.axisCount"
        :val="3"
        :label="$t('product.fields.axisCount3')"
      />
      <q-radio
        v-model="fields.params.axisCount"
        :val="5"
        :label="$t('product.fields.axisCount5')"
        class="q-ml-md"
      />
    </q-field>
  </div>
</template>

<script>
export default {
  name: 'Machinetool',
  props: {
    fields: Object
  }
}
</script>

<style lang='scss' scoped></style>
