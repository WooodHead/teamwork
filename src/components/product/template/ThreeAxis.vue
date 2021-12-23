<template>
  <tw-anchor-tab
    :anchors="anchors"
    :offsetHeight="36"
    class="g-margin-top20"
  >
    <!-- 机床尺寸 -->
    <template v-slot:machinetool-size>
      <div class="row q-col-gutter-x-md q-mt-md">
        <q-input
          filled
          v-model="fields.params.MachineToolSize.Length"
          :label="$t('product.fields.length')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.MachineToolSize.Width"
          :label="$t('product.fields.width')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.MachineToolSize.Height"
          :label="$t('product.fields.height')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
      </div>

      <q-input
        filled
        v-model="fields.params.MachineToolSize.Weight"
        :label="$t('product.fields.weight')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="kg"
      />

      <q-input
        filled
        v-model="fields.params.MachineToolSize.Area"
        :label="$t('product.fields.area')"
        class="g-padding-bottom20"
      />

      <q-input
        filled
        v-model="fields.params.MachineToolSize.Foundation"
        :label="$t('product.fields.foundation')"
      />
    </template>

    <!-- 加工范围 -->
    <template v-slot:processing-range>
      <div class="row q-col-gutter-x-md q-mt-md">
        <q-input
          filled
          v-model="fields.params.ProcessingRange.MaxBearingWeight"
          :label="$t('product.fields.maxBearingWeight')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="kg"
        />

        <q-input
          filled
          v-model="fields.params.ProcessingRange.MaxWorkpieceHeight"
          :label="$t('product.fields.maxWorkpieceHeight')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
      </div>

      <!-- 工作行程 -->
      <div class="text-subtitle1">{{$t('product.captions.workStroke')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.ProcessingRange.WorkStroke.XAxis"
          :label="$t('product.fields.xAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.ProcessingRange.WorkStroke.YAxis"
          :label="$t('product.fields.yAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.ProcessingRange.WorkStroke.ZAxis"
          :label="$t('product.fields.zAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
      </div>

      <!-- 主轴的端面到工作台面距离 -->
      <div class="text-subtitle1">{{$t('product.captions.faceToFaceStroke')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.ProcessingRange.SpindleWorkbenchDistance.Min"
          :label="$t('product.fields.minimum')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.ProcessingRange.SpindleWorkbenchDistance.Max"
          :label="$t('product.fields.maximum')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
      </div>

      <!-- 台面尺寸 -->
      <div class="text-subtitle1">{{$t('product.captions.platFormSize')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.ProcessingRange.WorkbenchSize.Length"
          :label="$t('product.fields.length')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.ProcessingRange.WorkbenchSize.Width"
          :label="$t('product.fields.width')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="mm"
        />
      </div>
      <q-input
        filled
        v-model="fields.params.ProcessingRange.ProcessingAreaSpace"
        :label="$t('product.fields.processingAreaSpace')"
        :rules="[$rules.decimal($t('rule.numeric'))]"
        class="col-12 col-sm-6"
        suffix="m³"
      />
    </template>

    <!-- 机床精度 -->
    <template v-slot:accuracye>
      <!-- 定位精度 -->
      <div class="text-subtitle1">{{$t('product.captions.accuracyPosition')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.Accuracy.Position.XAxis"
          :label="$t('product.fields.xAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.Accuracy.Position.YAxis"
          :label="$t('product.fields.yAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.Accuracy.Position.ZAxis"
          :label="$t('product.fields.zAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
      </div>

      <!-- 重复定位精度 -->
      <div class="text-subtitle1">{{$t('product.captions.accuracyRepeated')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.Accuracy.Repeated.XAxis"
          :label="$t('product.fields.xAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.Accuracy.Repeated.YAxis"
          :label="$t('product.fields.yAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
        <q-input
          filled
          v-model="fields.params.Accuracy.Repeated.ZAxis"
          :label="$t('product.fields.zAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="mm"
        />
      </div>
    </template>

    <!-- 进给速度 -->
    <template v-slot:feed-speed>
      <!-- 快进速度 -->
      <div class="text-subtitle1">{{$t('product.captions.fastForwardSpeed')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.FeedSpeed.FastForwardSpeed.XAxis"
          :label="$t('product.fields.xAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="m/min"
        />
        <q-input
          filled
          v-model="fields.params.FeedSpeed.FastForwardSpeed.YAxis"
          :label="$t('product.fields.yAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="m/min"
        />
        <q-input
          filled
          v-model="fields.params.FeedSpeed.FastForwardSpeed.ZAxis"
          :label="$t('product.fields.zAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="m/min"
        />
      </div>

      <!-- 切削速度 -->
      <div class="text-subtitle1">{{$t('product.captions.cuttingSpeed')}}</div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.FeedSpeed.CuttingSpeed.XAxis"
          :label="$t('product.fields.xAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="m/min"
        />
        <q-input
          filled
          v-model="fields.params.FeedSpeed.CuttingSpeed.YAxis"
          :label="$t('product.fields.yAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="m/min"
        />
        <q-input
          filled
          v-model="fields.params.FeedSpeed.CuttingSpeed.ZAxis"
          :label="$t('product.fields.zAxis')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-4"
          suffix="m/min"
        />
      </div>
    </template>

    <!-- 能耗 -->
    <template v-slot:energy-consume>
      <div class="row q-col-gutter-x-md q-mt-md">
        <tw-select-edit
          filled
          :editable="$myinfo.auth.role.isProductManager"
          :value="fields.params.EnergyConsume.Voltage"
          @input="(payload)=>{fields.params.EnergyConsume.Voltage= payload.dictValue}"
          module="product"
          field="energyConsume"
          :label="$t('dictionary.energyConsume')"
          class="col-12 col-sm-6 g-padding-bottom20"
        />
        <q-input
          filled
          v-model="fields.params.EnergyConsume.AirSourcePressure"
          :label="$t('product.fields.airSourcePressure')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="MPa"
        />
      </div>
      <div class="row q-col-gutter-x-md">
        <q-input
          filled
          v-model="fields.params.EnergyConsume.FuelTankCapacity"
          :label="$t('product.fields.fuelTankCapacity')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="L"
        />
        <q-input
          filled
          v-model="fields.params.EnergyConsume.TotalPower"
          :label="$t('product.fields.totalPower')"
          :rules="[$rules.decimal($t('rule.numeric'))]"
          class="col-12 col-sm-6"
          suffix="kVA"
        />
      </div>
    </template>
  </tw-anchor-tab>
</template>

<script>
import { positiveNum } from '@/utils/form-rules'
export default {
  name: 'ThreeAxis',
  components: {
    TwAnchorTab: () => import('components/base/TwAnchorTab'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  },
  props: {
    fields: Object
  },
  data () {
    return {
      anchors: [
        { label: this.$t('product.tabs.machinetoolSize'), containerId: 'machinetool-size' },
        { label: this.$t('product.tabs.processingRange'), containerId: 'processing-range' },
        { label: this.$t('product.tabs.accuracye'), containerId: 'accuracye' },
        { label: this.$t('product.tabs.feedSpeed'), containerId: 'feed-speed' },
        { label: this.$t('product.tabs.energyConsume'), containerId: 'energy-consume' }
      ]
    }
  },
  methods: {
    positiveNum
  }
}
</script>

<style lang='scss' scoped>
.q-field__append > span {
  font-size: 16px;
}

.my-bar {
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  z-index: 999;
}
</style>
