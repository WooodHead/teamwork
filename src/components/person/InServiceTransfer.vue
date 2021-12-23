<template>
  <q-dialog
    ref="dialog"
    :maximized="$q.platform.is.mobile"
    :persistent="persistent"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :style="!$q.platform.is.mobile &&'width: 90vh; max-width: 90vh;'"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">负责人业务交接</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-separator />
      <q-card-section
        style="max-height: 60vh;min-height:60vh"
        class="scroll"
      >
        <q-list
          v-for="(list,key) in objectTypes"
          :key="key"
        >
          <q-item-label
            v-if="list.length"
            header
            class="text-blue"
          >{{$t(`${key}.title`)}}</q-item-label>
          <q-item
            v-for="(item,index) in list"
            :key="key+'_'+index"
          >
            <q-item-section avatar>
              <tw-avatar
                :id="item.leaderID||item.connectorId"
                :popupCard="false"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{item.title||item.name||item.label}}</q-item-label>
              <q-item-label
                caption
                class="ellipsis"
                v-html="item.notes"
              ></q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                dense
                label="更换负责人"
                @click="changeLeader(key,item)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <tw-banner-no-result
          info="暂无要交接的业务"
          v-if="!visible&&!isHaveValues"
        />
        <q-inner-loading :showing="visible">
          <q-spinner
            color="primary"
            name="dots"
            size="50px"
          />
        </q-inner-loading>
      </q-card-section>
      <q-card-section></q-card-section>
    </q-card>
    <!-- 添加人员弹框 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        @select="updateLeader"
        @multiSelect="updateLeader"
        :isVirtualScroll="true"
        :multiple="multiple"
        :initSelectedPersonIDs="initSelectedPersonIDs"
      />
    </q-dialog>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'InServiceTransfer',
  props: {
    psonID: {
      type: Number,
      require: true,
      default: 0
    },
    persistent: {
      type: Boolean,
      require: false,
      default: false
    },
    transitionShow: {
      type: String,
      require: false,
      default: 'slide-up'
    },
    transitionHide: {
      type: String,
      require: false,
      default: 'slide-down'
    }
  },
  data () {
    return {
      visible: true,
      showSelect: false,
      selectKey: '',
      model: null,
      multiple: false,
      initSelectedPersonIDs: [],
      objectTypes: {}
    }
  },
  computed: {
    isHaveValues () {
      return !!(_.flattenDeep(_.values(this.objectTypes)).length)
    }
  },
  async created () {
    // 获取负责项目、产品、团队、订单、商机、工程服务等资源项列表
    await this.loadMembersByLeader({ psonID: this.psonID }).then(async members => {
      await this.initData(members)
    })
    // 获取咨询事务的相关负责人
    await this.loadConsultItems({
      query: [{ Key: 'PsonIDs', Value: this.psonID, Oper: 'inset' }]
    }).then(async consults => {
      this.$set(this.objectTypes, 'consult', consults)
    })
    // 获取负责的机构列表
    this.$set(this.objectTypes, 'organize', _.filter(_.values(this.$store.state.organize.selectOrganizes), o => o.leaderID === this.psonID))
    // 关闭加载框
    this.visible = false
  },
  methods: {
    ...mapActions('member', ['loadMembersByLeader']),
    ...mapActions('consult', ['loadConsultItems']),
    async initData (members) {
      let groupMembers = _.groupBy(_.filter(members, m => m.duty === 'leader' && m.psonID === this.psonID), 'objectType')
      for (const key in groupMembers) {
        if (Object.hasOwnProperty.call(groupMembers, key)) {
          const ms = groupMembers[key]
          let query = []
          switch (key) {
            case 'project':
              query = [{ Key: 'ProjectID', Value: _.map(ms, 'objectID').join(','), Oper: 'in' }]
              break
            case 'customer':
              query = [{ Key: 'CustomerID', Value: _.map(ms, 'objectID').join(','), Oper: 'in' }]
              break
            case 'service':
            case 'team':
            case 'opportunity':
            case 'order':
            case 'productDev':
              query = [{ Key: 'Id', Value: _.map(ms, 'objectID').join(','), Oper: 'in' }]
              break
            default:
              break
          }
          await this.$store.dispatch(`${key}/load${capitalize(key)}s`, { query, byPage: false }).then(res => {
            this.$set(this.objectTypes, key, res)
          })
        }
      }
    },
    changeLeader (key, item) {
      if (key === 'consult') this.multiple = true
      else this.multiple = false
      this.showSelect = true
      this.selectKey = key
      this.model = item
      this.initSelectedPersonIDs = item.psonIDs || [item.leaderID || item.connectorId]
    },
    async updateLeader (item) {
      let isPass = true
      if (this.multiple) {
        if (this.selectKey === 'consult') {
          this.model.psonIDs = _.map(item, 'id', Number)
          if (item.length) {
            await this.$store.dispatch('consult/updateConsultItem', this.model).then(res => {
              _.find(this.objectTypes['consult'], c => c.id === this.model.id).psonIDs = this.model.psonIDs
            })
            isPass = true
          } else {
            showWarningMessage('事务项必须至少指定一位对接人')
            isPass = false
          }
        } else {
          isPass = false
        }
      } else {
        if (this.selectKey === 'service') {
          await this.$store.dispatch(`service/updateServiceField`, { Id: this.model.id, ConnectorID: item.id }).then(res => {
            _.find(this.objectTypes['service'], c => c.id === this.model.id).connectorId = item.id
          })
        } else {
          this.model.leaderID = item.id
          await this.$store.dispatch(`${this.selectKey}/update${capitalize(this.selectKey)}`, this.model).then(res => {
            _.find(this.objectTypes[this.selectKey], c => c.id === this.model.id).leaderID = this.model.leaderID
          })
        }
        isPass = true
      }
      if (isPass) {
        this.multiple = false
        this.showSelect = false
        this.selectKey = ''
        this.model = null
        this.initSelectedPersonIDs = []
      }
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick () {
      this.hide()
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  }
}
</script>

<style scoped lang="scss">
</style>
