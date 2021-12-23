<template>
  <tw-form @primary="onSubmit">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6">
        <div class="row items-center q-py-sm bg-grey-3">
          <div
            class="row col-6"
            v-for="(t, index) in codeType"
            :key="index"
          >
            <q-radio
              v-model="model.type"
              :val="t.type"
              :label="t.label"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6">
        <q-input
          filled
          v-model="num"
          type="Number"
          :disable="openType === 'edit' ? 'disable' : null"
          :label="$t('recommendCode.useNumber')"
          lazy-rules
          :rules="[val => (val && val > 0) || '推荐码生成个数必须大于0']"
        />
      </div>
      <div
        class="col-12 col-sm-6"
        :class="$q.screen.gt.sm ? 'q-pt-none' : 'q-pt-none'"
        v-if="model.type === 0"
      >
        <q-input
          v-model="model.disabledTime"
          filled
          :disable="openType === 'edit' ? 'disable' : null"
          :label="$t('recommendCode.disabledTime')"
          mask="date"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :value="model.disabledTime"
                  @input="disabledTimeInput($event)"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div
        class="col-12 col-sm-6"
        :class="$q.screen.gt.sm ? 'q-pt-none' : ''"
      >
        <q-input
          filled
          v-model="model.owner"
          :label="$t('recommendCode.owner')"
          lazy-rules
          :rules="[val => (val && val.length > 0) || '请输入持有者姓名']"
        />
      </div>

      <div
        class="col-12 col-sm-6 q-pt-none"
        :class="$q.screen.gt.sm ? '' : 'q-pt-none'"
      >
        <q-input
          filled
          v-model="model.ownerTel"
          :label="$t('recommendCode.ownerTel')"
          lazy-rules
          :rules="ownerTelRules"
        />
      </div>

      <div
        class="col-12 col-sm-6 q-pt-none"
        :class="$q.screen.gt.sm ? '' : 'q-pt-none'"
      >
        <q-input
          filled
          v-model="model.notes"
          :label="$t('recommendCode.notes')"
        />
      </div>

      <div
        class="col-12 col-sm-6"
        :class="$q.screen.gt.sm ? 'q-pt-none' : ''"
      >
        <tw-select-edit
          filled
          module="recommendCode"
          field="recommendType"
          :value="model.recommendType"
          @input="
            payload => {
              model.recommendType = payload.dictValue;
            }
          "
          :editable="canOp"
          :label="$t('recommendCode.recommendType')"
        />
      </div>

      <div class="col-12 code">
        <div
          v-for="code in codeList"
          :key="code"
          class="codeName"
        >
          <span class="q-px-md text-h5">{{ code }}</span>
        </div>
      </div>
      <div
        class="col-12 q-pt-md"
        v-if="showBtn === true && openType !== 'edit'"
      >
        <q-btn
          outline
          color="primary"
          class="col-12 col-sm-6"
          :label="$t('recommendCode.againCodes')"
          @click="createCodes()"
        />
      </div>

      <div
        v-if="!showBtn && openType !== 'edit'"
        align="left"
        class="col-12"
      >
        <q-btn
          unelevated
          color="primary"
          :label="$t('recommendCode.createCodes')"
          @click="createCodes()"
        />
      </div>
    </div>
  </tw-form>
</template>

<script>
import RecommendCode from '@/store/recommend-code/model'
import { mapState, mapActions, mapMutations } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'RecommendCodeForm',
  props: {
    openType: {
      type: String,
      default: 'add'
    },
    id: {
      type: [Number, String],
      default: 0
    }
  },

  data () {
    return {
      model: new RecommendCode(),
      showBtn: false,
      codeList: [], // 推荐码列表
      num: 1 // 生成个数
    }
  },
  mounted () {
    if (this.openType === 'edit') {
      this.loadRecommendCode(Number(this.id)).then(res => {
        this.model = _.cloneDeep(res)
        this.initBreadcrumb()
      })
    }
  },
  computed: {
    ...mapState('recommendCode', ['codeType']),
    // 手机号校验
    ownerTelRules () {
      return [
        val => (val !== null && val !== '') || '手机号码不能为空',
        val => {
          const reg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
          if (reg.test(val)) {
            return true
          } else {
            return '请输入正确的手机号码'
          }
        }
      ]
    },
    // HR、系统管理员具有操作权限
    canOp () {
      return !!(
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'HRSpecialist'
        }) ||
        _.find(LocalStorage.getItem('myself').roles, {
          code: 'SystemAdministrator'
        })
      )
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      async handler (newVal, oldVal) {
        this.initBreadcrumb()
      }
    }
  },
  methods: {
    ...mapMutations('breadcrumbs', [
      'pushModuleBreadcrumb',
      'pushWidgetBreadcrumb',
      'clearBreadcrumbs'
    ]),
    ...mapActions('recommendCode', [
      'loadRecommendCode',
      'addRecommendCode',
      'updateRecommendCode'
    ]),
    disabledTimeInput (value) {
      this.model.disabledTime = value
      this.$refs.qDateProxy.hide()
    },
    // 生成/重新生成推荐码
    createCodes () {
      // 随机数
      if (this.model.type === 0) {
        // 1对N推荐码
        let random = [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z'
        ]
        this.codeList = []
        var codeLength = 6 // 验证码的长度
        for (let j = 0; j < Number(this.num); j++) {
          for (var i = 0; i < codeLength; i++) {
            // 循环操作
            var index = Math.floor(Math.random() * 62) // 取得随机数的索引（0~62）
            this.model.code += random[index] // 根据索引取得随机数加到code上
          }
          this.codeList.push(this.model.code)
          this.model.code = ''
        }
      } else {
        let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        // 1对1内推码
        this.codeList = []
        let prefix = 'JD'
        for (let j = 0; j < Number(this.num); j++) {
          var codeLength = 4 // 验证码的长度
          for (let i = 0; i < codeLength; i++) {
            // 循环操作
            let index = Math.floor(Math.random() * 9) // 取得随机数的索引（0~9）
            this.model.code += random[index] // 根据索引取得随机数加到code上
          }
          this.model.code = prefix + this.model.code
          this.codeList.push(this.model.code)
          this.model.code = ''
        }
      }
      this.showBtn = true
    },
    onSubmit () {
      this.model.createByID = LocalStorage.getItem('myself').id
      this.model.createBy = LocalStorage.getItem('myself').name
      this.model.jobNumber = 0
      if (this.openType === 'add') {
        _.forEach(this.codeList, code => {
          this.model.code = code
          this.addRecommendCode(this.model).then(res => {
            if (res) {
              this.toDetail(res.id)
            }
          })
        })
      } else {
        this.updateRecommendCode(this.model).then(res => {
          if (res) {
            this.model = res
            this.toDetail(res.id)
          }
        })
      }
    },
    // 路由跳转首页
    toDetail (id) {
      this.$router.push({
        name: 'recommendCodeDetail',
        params: {
          id: id
        }
      })
    },
    // 面包屑处理
    initBreadcrumb (route) {
      this.clearBreadcrumbs()
      this.pushModuleBreadcrumb({
        id: `jobHome`,
        title: this.$t('job.jobHome'),
        to: {
          name: 'jobHome'
        }
      })
      this.pushWidgetBreadcrumb({
        id: `recommendCode`,
        title: this.$t('recommendCode.module'),
        to: {
          name: 'recommendCode'
        }
      })
      this.openType === 'edit' &&
        this.model &&
        this.pushWidgetBreadcrumb({
          id: `recommendCodeDetail`,
          title: this.model.owner,
          to: {
            name: 'recommendCodeDetail',
            params: {
              id: +this.id
            }
          }
        })
    }
  },
  components: {
    TwForm: () => import('components/base/TwForm'),
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit')
  }
}
</script>

<style scoped>
.code {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.codeName {
  width: 10%;
  height: auto;
}
</style>
