<template>
  <div class="flex full-width q-gutter-y-md">
    <!-- 物料列表 -->
    <template>
      <q-list
        dense
        padding
        class="rounded-borders"
        style="width:100%"
      >
        <div
          v-for="model in matList"
          :key="model.ID"
        >
          <q-item
            clickable
            v-ripple
          >
            <q-item-section
              v-if="model.CreateByID"
              avatar
            >
              <tw-avatar
                size="lg"
                :id="model.CreateByID"
              />
            </q-item-section>
            <q-item-section style="max-width: 5vw">
              <q-item-label :class="bomColor[model.BomType]">{{model.BomTypeName}}
              </q-item-label>
            </q-item-section>
            <q-item-section style="min-width: 15vw; max-width: 15vw">
              <q-item-label>{{model.Name}}</q-item-label>
              <q-item-label
                caption
                :class="matColor[model.MaterialType]"
              >{{model.MatTypeName}}</q-item-label>
            </q-item-section>
            <q-item-section style="min-width: 12vw; max-width: 12vw">
              <q-item-label class="text-bold"> {{model.Code}}<br>{{model.DeployCode}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>编制人</q-item-label>
              <q-item-label caption> {{model.PrepareBy}}
                <span class="text-primary">{{model.BuditTime}}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>校验人</q-item-label>
              <q-item-label caption> {{model.CheckBy}}
                <span class="text-primary">{{model.CheckTime}}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>审核人</q-item-label>
              <q-item-label caption> {{model.BuditBy}}
                <span class="text-primary">{{model.BuditTime}}</span>
              </q-item-label>
            </q-item-section>
            <!-- <q-item-section>
              <q-item-label>导入人</q-item-label>
              <q-item-label caption> {{model.CreateBy}}
                <span class="text-primary">{{getFormatTime(model.CreateTime)}}</span>
              </q-item-label>
            </q-item-section> -->
          </q-item>
        </div>
      </q-list>
    </template>
  </div>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'MatMainList',
  props: {
    matList: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      bomColor: { 1: 'text-bold text-primary', 2: 'text-bold text-indigo' },
      matColor: { 1: 'text-bold text-brown', 2: 'text-bold text-cyan', 3: 'text-bold text-blue', 4: 'text-bold text-teal' }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')

  },
  methods: {
    getFormatTime (val) {
      return formatDate(val, 'YYYYMMDD')
    }
  }
}
</script>
