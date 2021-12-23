<!--工件信息编辑页面-->
<template>
  <q-form
    @submit.prevent="onSubmit"
    @reset.native="onReset"
    class="q-px-md q-mt-md q-gutter-y-md bg-grey-1"
  >
    <q-tabs
      v-model="processJson.AxisCount"
      dense
      inline-label
      indicator-color="transparent"
      class="q-py-xs text-dark rounded-borders workpiece-tab"
      style="height: 40px;background: rgba(0, 0, 0, 0.05);"
    >
      <q-tab
        name="3"
        :label="$t('product.fields.axisCount3')"
        class="q-mr-md"
      />
      <q-tab
        name="5"
        :label="$t('product.fields.axisCount5')"
      />
    </q-tabs>

    <q-card>
      <q-card-section>
        <div class="text-bold">工件信息</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div v-if="processJson.AxisCount === '3'">
          <div :class="[{'row':!$q.screen.lt.sm},'q-col-gutter-xs']">
            <div class="col">
              <q-input
                filled
                dense
                v-model="processJson.Length"
                label="长"
                lazy-rules
                :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
                suffix="mm"
              />
            </div>
            <div
              v-if="!$q.screen.lt.sm"
              class="col-auto q-pt-sm text-h5"
            >×</div>
            <div class="col">
              <q-input
                filled
                dense
                v-model="processJson.Width"
                label="宽"
                lazy-rules
                :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
                suffix="mm"
              />
            </div>
            <div
              v-if="!$q.screen.lt.sm"
              class="col-auto q-pt-sm text-h5"
            >×</div>
            <div class="col">
              <q-input
                filled
                dense
                v-model="processJson.Height"
                label="高"
                lazy-rules
                :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
                suffix="mm"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div :class="[{'row':!$q.screen.lt.sm},'q-col-gutter-xs']">
            <div class="col">
              <q-input
                filled
                dense
                v-model="processJson.MaxDiameter"
                label="底径"
                placeholder="最大回转直径"
                lazy-rules
                :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
                suffix="mm"
              />
            </div>
            <div
              v-if="!$q.screen.lt.sm"
              class="col-auto q-pt-sm text-h5"
            >×</div>
            <div class="col">
              <q-input
                filled
                dense
                v-model="processJson.MaxHeight"
                label="高"
                placeholder="最大高度"
                lazy-rules
                :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
                suffix="mm"
              />
            </div>
          </div>
        </div>
        <q-input
          filled
          dense
          v-model="processJson.BearingWeight"
          label="承重需求"
          placeholder="工件+治具最大重量"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="kg"
        />
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-bold">工装信息</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div :class="[{'row':!$q.screen.lt.sm},'q-col-gutter-xs']">
          <div class="col">
            <q-input
              filled
              dense
              v-model="processJson.ToolingLength"
              label="长"
              lazy-rules
              :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
              suffix="mm"
            />
          </div>
          <div
            v-if="!$q.screen.lt.sm"
            class="col-auto q-pt-sm text-h5"
          >×</div>
          <div class="col">
            <q-input
              filled
              dense
              v-model="processJson.ToolingWidth"
              label="宽"
              lazy-rules
              :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
              suffix="mm"
            />
          </div>
          <div
            v-if="!$q.screen.lt.sm"
            class="col-auto q-pt-sm text-h5"
          >×</div>
          <div class="col">
            <q-input
              filled
              dense
              v-model="processJson.ToolingHeight"
              label="高"
              placeholder="超出工件底面高度"
              lazy-rules
              :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
              suffix="mm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-bold">主轴需求</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div
          class="bg-grey-3 my-border margin-bottom20"
          style="padding-left:12px;"
        >
          <q-checkbox
            left-label
            v-model="processJson.MotorForm"
            true-value="0"
            false-value="1"
            label="是否需要定向"
            color="teal"
          />
        </div>
        <tw-select-edit
          :editable="$myinfo.auth.role.isProductManager"
          filled
          dense
          :value="processJson.Shank"
          @input="payload=>{processJson.Shank=payload.dictValue}"
          module="product"
          field="shankInterface"
          :label="$t('dictionary.shankInfo')"
          class="margin-bottom20"
        />
        <q-input
          filled
          dense
          v-model="processJson.ClampingToolMax"
          label="刀具最大夹持直径"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="mm"
        />
        <q-input
          filled
          dense
          v-model="processJson.SpeedMax"
          label="最大转速"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="npm"
        />
        <q-input
          filled
          dense
          v-model="processJson.Torque"
          label="扭矩要求"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="N·m"
        />
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-bold">刀具需求</div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div :class="[{'row':!$q.screen.lt.sm},'q-col-gutter-xs']">
          <div class="col">
            <q-input
              filled
              dense
              v-model="processJson.ToolMinLength"
              label="最短刀具"
              placeholder="刀尖到主轴端面距离"
              lazy-rules
              :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
              suffix="mm"
            />
          </div>
          <div
            v-if="!$q.screen.lt.sm"
            class="col-auto q-pt-sm text-h5"
          >~</div>
          <div class="col">
            <q-input
              filled
              dense
              v-model="processJson.ToolMaxLength"
              label="最长刀具"
              placeholder="刀尖到主轴端面距离"
              lazy-rules
              :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
              suffix="mm"
            />
          </div>
        </div>
        <q-input
          filled
          dense
          v-model="processJson.ToolMaxDiameter"
          label="刀具最大直径"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="mm"
        />
        <q-input
          filled
          dense
          v-model="processJson.ToolCount"
          label="刀具数量"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="把"
        />
        <q-input
          filled
          dense
          v-model="processJson.SingleToolMaxWeight"
          label="单把刀具最大重量"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="kg"
        />
        <q-input
          filled
          dense
          v-model="processJson.ToolChangeTime"
          label="换刀时间需求"
          lazy-rules
          :rules="[ val => val==='' || (val && !isNaN(val)) || '请输入数字']"
          suffix="s"
        />
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-bold">其它需求</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-gutter-md">
        <div
          class="bg-grey-3 my-border"
          style="padding-left:12px;"
        >
          <q-checkbox
            left-label
            v-model="processJson.Probe"
            :true-value="1"
            :false-value="0"
            label="是否需要测头选型"
            color="teal"
          />
        </div>
        <q-select
          filled
          dense
          v-model="processJson.CoolingMethod"
          :options="['无','微量油雾润滑','水冷/油冷']"
          label="冷却润滑方式"
        />
        <q-select
          filled
          dense
          v-model="processJson.Material"
          :options="['金属','玻璃','陶瓷']"
          label="加工材质"
        />
        <q-select
          filled
          dense
          v-model="processJson.ApplicableChipTypes"
          :options="['短屑','长屑/团屑','长屑/团屑+短屑','粉末/颗粒']"
          label="切削形态"
        />
      </q-card-section>
    </q-card>

    <q-card
      flat
      class="bg-grey-1"
      style="position:sticky;bottom:0;"
    >
      <q-card-actions
        v-if="!isReverseCheck"
        class="q-px-none"
      >
        <div class="row full-width">
          <div class="col">
            <q-btn
              outline
              color="primary"
              :label="$t('product.reset')"
              type="reset"
              class="full-width"
            />
          </div>
          <div class="col-auto q-px-xs"></div>
          <div class="col">
            <q-btn
              color="primary"
              :label="$t('product.filter')"
              type="submit"
              @click="actionName='filter'"
              class="full-width"
            />
          </div>
        </div>
      </q-card-actions>
      <q-card-actions
        v-else
        class="q-px-none"
      >
        <q-btn
          color="primary"
          :label="$t('product.processCheck')"
          type="submit"
          @click="actionName='check'"
          class="full-width"
        />
      </q-card-actions>
    </q-card>

    <!-- 匹配度 -->
    <match-notes-panel
      fromReverse
      :id="+$route.params.id"
      :class="{'dialog-width':!$q.platform.is.mobile}"
      ref="matchNotesPanel"
    />
  </q-form>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { showWarningMessage } from '@/utils/show-message'
import Selection from '@/store/product-selection/model'
export default {
  name: 'WorkPieceForm',
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    MatchNotesPanel: () => import('components/product/selection/MatchNotesPanel')
  },
  data () {
    return {
      actionName: ''
    }
  },
  computed: {
    ...mapState('product', ['products', 'checkAccessoryIds']),
    ...mapState('productSelection', ['processJson', 'curSelectionId']),
    isReverseCheck () {
      let isaN = !isNaN(this.$route.params.id)
      if (isaN) {
        let p = _.find(this.products, { id: +this.$route.params.id })
        return p && p.tplCode === '' && p.classification === 'machinetool'
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations('product', ['setInSelection', 'setShowWorkPiece']),
    ...mapActions('product', ['matchByProcess']),
    onSubmit () {
      switch (this.actionName) {
        case 'filter':
          // 触发筛选
          this.$store.state.product.productMatchs = []
          this.setInSelection(true)
          this.matchByProcess(this.processJson)
          // 关闭窗口
          this.setShowWorkPiece(false)
          this.$router.push({
            name: 'matchByProcess'
          })
          break
        case 'check':
          // 反向校验
          // 判断轴数是否匹配
          let p = _.find(this.products, { id: +this.$route.params.id })
          if (p.params.axisCount === +this.processJson.AxisCount) {
            this.$refs.matchNotesPanel.showMatchNotes = true
          } else {
            showWarningMessage('轴数不匹配！')
          }
          break
        default:
          break
      }
    },
    // 取消编辑
    onReset () {
      Object.assign(this.processJson, new Selection().processJson)
    }
  }
}
</script>

<style lang="scss" scoped>
.workpiece-tab .q-tab {
  flex: unset;
  border-radius: 16px;
  min-height: 32px;
  padding: 0;

  height: 32px;
  line-height: 32px;
}
/deep/ .workpiece-tab .q-tabs__content {
  justify-content: center;
}
/deep/ .workpiece-tab .q-tab--active ::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 16px;
}
/deep/ .workpiece-tab .q-tab__content {
  display: inline-block;
  padding: 2px 16px;
}
/deep/ .q-tab__indicator {
  display: none;
}
/deep/ .workpiece-tab .q-tab__label {
  font-size: 14px;
  line-height: 20px;
  padding: 0 20px;
  display: inline-block;
}

.my-border {
  height: 40px;
  line-height: 40px;
  // border: solid 1px lightgray;
  border-radius: 4px;
}

.q-field__append > span {
  font-size: 16px;
}
.margin-bottom20 {
  margin-bottom: 20px;
}

.dialog-width {
  width: 700px;
  min-height: 500px;
  max-width: 80vw;
}
</style>
