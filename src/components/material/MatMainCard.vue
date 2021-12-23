<template>
  <!-- 物料卡片列表 -->
  <q-card
    flat
    bordered
    class="cursor-pointer base-card"
  >
    <q-card-section>
      <!-- 订单单号、订单状态 -->
      <div class="flex items-center q-mb-sm">
        <q-item-label class="col text-h6-g text-weight-bold ellipsis"> {{model.Code}}<br>{{model.DeployCode}}
        </q-item-label>
        <q-badge :color="bomColor[model.BomType]">
          {{model.BomTypeName}}
        </q-badge>
      </div>
      <q-item-label caption>{{model.AutoFileName}} </q-item-label>
      <q-separator class="q-my-sm" />
      <div class="text-body-g text-text1">
        <p class="q-mb-xs">编制人：{{model.PrepareBy}}&nbsp;&nbsp;
          <span class="text-primary1">{{model.PrepareTime}}</span>
        </p>
        <p class="q-mb-xs">校验人：{{model.CheckBy}}&nbsp;&nbsp;
          <span class="text-primary1">{{model.CheckTime}}</span>
        </p>
        <p class="q-mb-xs">审核人：{{model.BuditBy}}&nbsp;&nbsp;
          <span class="text-primary1">{{model.BuditTime}}</span>
        </p>
        <p class="q-mb-xs">导入人：{{model.CreateBy}}&nbsp;&nbsp;
          <span class="text-primary1">{{getFormatTime(model.CreateTime)}}</span>
        </p>
        <q-separator class="q-mt-sm" />
        <p class="q-mb-xs">文件名称：{{model.FileName}}</p>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'MatMainCard',
  props: {
    model: {
      type: Object,
      required: false,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      bomColor: { 1: 'primary', 2: 'secondary' }
    }
  },
  methods: {
    getFormatTime (val) {
      return formatDate(val, 'YYYYMMDD')
    }
  }
}
</script>
