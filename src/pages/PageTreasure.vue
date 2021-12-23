<template>
  <q-page padding>
    <q-list bordered>
      <q-item-label header>应用宝藏</q-item-label>

      <q-item-label header>web-apis</q-item-label>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'webApis'}"
      >
        <q-item-section>
          <q-item-label>手机原生api</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item-label header>qrcode-reader</q-item-label>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'qrcodeReader'}"
      >
        <q-item-section>
          <q-item-label>扫描二维码</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item-label header>barcode-reader</q-item-label>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'barcodeReader'}"
      >
        <q-item-section>
          <q-item-label>扫描条形码</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item-label header>vue-3d-model</q-item-label>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: '3dModel'}"
      >
        <q-item-section>
          <q-item-label>预览3D模型</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item-label header>位置Demo（高德地图）</q-item-label>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'geolocationAMap'}"
      >
        <q-item-section>
          <q-item-label>当前位置</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'location'}"
      >
        <q-item-section>
          <q-item-label>附近位置</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'poiAMap'}"
      >
        <q-item-section>
          <q-item-label>搜索位置</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item
        tag="label"
        v-ripple
        :to="{ name: 'districtLayerAMap'}"
      >
        <q-item-section>
          <q-item-label>行政区图</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>

export default {

}
</script>
