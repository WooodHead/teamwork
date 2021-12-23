
<template>
  <tw-form @primary="onSubmit">
    <!-- 表单内容 -->
    <q-card-section>
      <div class="q-gutter-md">
        <!-- 评估单位 -->
        <!-- 评估单位 -->
        <manufacturer-select
          :value.sync="model.manufacturerID"
          :label="$t('assess.manufacturer')"
          :rules="[val => val && val.id > 0 || $t('rule.fieldIsRequired')]"
          @selected-event="manufacturerSelected($event)"
          lazyRules
          filled
        />
        <!-- 评估截止日期 -->
        <q-input
          filled
          input-class="text-center"
          v-model="model.endDate"
          :label="$t('assess.endDate')"
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
                  :value="model.endDate"
                  @input="val=>{model.endDate = val;$refs.qDateProxy.hide()}"
                  minimal
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- 评估任务说明，包括上传加工件的图纸-->
        <div class="q-my-sm">
          <quasar-editor
            style="padding: 8px 0px;"
            :focus="false"
            folder="opportunity"
            :applied="true"
            :value="model.assessRequire"
            @input="(val)=>{model.assessRequire=val}"
            class="col-12"
            placeholder="可描述客户加工要求等信息"
            ref="assessRequire"
            :rules="[ val => val && val.trim().length > 0 || $t('rule.fieldIsRequired')]"
          ></quasar-editor>
        </div>
      </div>
      <!-- 提醒订阅 -->
      <tw-choose-notify
        :module="{category,id:+objectID}"
        :widget="{category:moduleType,id: +id}"
        :category="category"
        :objectID="+objectID"
        :always="true"
        :subscribers.sync="subscribers"
      />
    </q-card-section>
  </tw-form>
</template>

<script>
import { LocalStorage } from 'quasar'
import Assess from '@/store/assess/model'
import { mapActions } from 'vuex'
export default {
  name: 'AssessForm',
  components: {
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    ManufacturerSelect: () => import('components/manufacturer/ManufacturerSelect'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwForm: () => import('components/base/TwForm')
  },
  props: {
    // 评估id
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    openType: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      model: new Assess(),
      selectManufacturers: [],
      manufacturersOptionsFilter: [],
      // 初始化备注中提及的人员姓名
      mentionedPersons: [],
      // 备注中新提及的人员
      myinfo: LocalStorage.getItem('myself'),
      goIntoAction: false,
      submitModel: { id: 0 },
      moduleType: 'assess',
      subscribers: [],
      opportunity: {} // 商机对象
    }
  },
  computed: {

  },
  mounted () {
    // 获取商机对象
    this.loadOpportunity(this.objectID).then(res => {
      if (res) {
        this.opportunity = _.clone(res)
        this.model.assessRequire = this.opportunity ? this.opportunity.requirement : ''
      }
    })
    // 编辑页，获取评估对象
    if (this.openType === 'edit') {
      this.loadAssess(this.id).then(res => {
        if (res) {
          this.model = _.clone(res)
        }
      })
    } else {
      this.subscribers = [this.$myinfo.id] // 初始化默认，订阅人
    }
    // 读取评估单位
    this.loadManufacturers().then(res => {
      this.selectManufacturers = _.clone(res)
      this.manufacturersOptionsFilter = this.selectManufacturers
    })
  },
  methods: {
    ...mapActions('assess', ['loadAssess', 'addAssess', 'updateAssess']),
    ...mapActions('opportunity', ['loadOpportunity', 'refreshOpportunity']),
    ...mapActions('manufacturer', ['loadManufacturers']),
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.manufacturersOptionsFilter = this.selectManufacturers
        } else {
          console.log(val.toLowerCase())
          const needle = val.toLowerCase()
          this.manufacturersOptionsFilter = this.manufacturersOptionsFilter.filter(
            customer => customer.title.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    // 生产单位选择后
    manufacturerSelected (manufacturer) {
      // 更新生产单位负责人
      this.model.manufacturerLeaderID = manufacturer.leaderId
      // 将生产单位负责人，更新订阅者
      this.subscribers = [this.$myinfo.id, manufacturer.leaderId]
    },
    onSubmit () {
      window.RichTextEditting = false
      const requireValidate = this.model.manufacturerID > 0
      if (requireValidate) {
        this.model.opportunityID = this.$route.params.objectID
        this.model.opportunityNo = this.opportunity.opportunityNo
        this.model.subscribers = this.subscribers
        this.goIntoAction = true
        this.opportunity.status = 'assessing'// 更新商机状态，返回商机明细页时，需要根据商机状态自动更新流程图和控制按钮
        if (this.openType === 'add') {
          this.addAssess(this.model).then(res => {
            this.refreshOpportunity(+this.model.opportunityID) // 刷新商机状态
            res && this.routerJump(res)
          })
        } else {
          this.updateAssess(this.model).then(res => {
            res && this.routerJump(res)
          })
        }
      }
    },
    routerJump (assess) {
      this.$router.push({
        name: 'assessDetail',
        params: { category: this.category, objectID: this.objectID, id: assess.id }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.quotationForm .editor {
  border-bottom: unset !important;
  cursor: initial !important;
}
</style>
