<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-detail :noMenu="$myinfo.id !== model.consultantID">
      <template #menu>
        <tw-menu
          :menus="model.status>=4?['copy']:['delete', 'copy']"
          @delete="deleteEvent"
          @copy="copyEvent"
        />
      </template>
    </tw-header-detail>
    <div class="q-px-xxl">
      <q-card-section class="q-gutter-y-sm ">
        <div class="row items-center justify-center">
          <tw-avatar
            :id="model&&model.consultantID"
            :size="$q.screen.lt.sm?'md':''"
          />

          <q-icon
            name="trending_flat"
            size="md"
            color="grey-7"
            class="q-px-sm"
          ></q-icon>

          <tw-avatar
            :id="model&&model.transactorID"
            :size="$q.screen.lt.sm?'md':''"
          />
        </div>
        <div class="text-center">
          <q-badge
            outline
            align="middle"
            color="secondary"
          >
            {{model.code}}
          </q-badge>
        </div>
        <div
          class="row justify-center text-title"
          style="word-wrap: break-word;"
          :title="item&&item.title"
        >{{item&&item.title}}</div>
      </q-card-section>

      <!-- 办理节点 -->
      <q-card-section :class="$q.screen.lt.sm?'q-pa-none':'q-px-lg'">
        <consult-node
          v-if="model"
          :style="$q.screen.lt.sm?'margin:0px -17px;':''"
          :step="model.status"
          :exceptFinishTime="model.exceptFinishTime"
          :progress="model.progress"
        />
      </q-card-section>

      <!-- 沟通记录 -->
      <q-card-section>
        <consult-communication
          v-if="Object.keys(model).length"
          :communications="model.communication"
          :consultantID="model.consultantID"
        />
        <!-- 引导咨询人结单 -->
        <q-card-actions
          v-if="!showInput&&$myinfo.id === model.consultantID&&[2,3].includes(model.status)"
          class="q-px-none q-my-md"
          align="left"
        >
          <q-btn
            v-for="(item,index) in consultantReply"
            :key="item.key"
            :outline="index>0"
            :label="item.label"
            color="primary"
            @click="item.click"
            class="q-px-sm"
            rounded
          />
        </q-card-actions>
        <!-- 输入框区域 -->
        <q-input
          v-if="addable&&!showInput"
          :key="model.status"
          class="q-mt-md"
          type="text"
          :placeholder="$t('consult.consultDetail.inputContent')"
          outlined
          Readonly
          @click="showInput=true"
        />
        <div
          v-if="showInput"
          class="q-pb-lg"
        >
          <quasar-editor
            v-if="model.status<4"
            @input="(val)=>{newCommunication=val}"
            folder="consult"
            :applied="goIntoAction"
            :placeholder="$t('consult.consultDetail.inputContentOrUpload')"
          ></quasar-editor>
          <!-- 操作按钮 -->
          <q-card-actions
            v-if="model.status<4"
            class="q-px-none q-gutter-sm"
            align="left"
          >
            <q-btn
              v-for="(item,index) in formAction"
              :key="index"
              :outline="index>0"
              :label="item.label"
              color="primary"
              @click="item.action==='transmit'?showTransmitPerson=true:debounceSubmit(item.action)"
              class="q-px-sm"
              rounded
              unelevated
            />
          </q-card-actions>
        </div>
        <!-- 评价区域 -->
        <consult-appraise
          v-if="$myinfo.id === this.model.consultantID&&+this.model.status===4"
          @appraise="onAppraise"
        ></consult-appraise>
      </q-card-section>
    </div>
    <!-- 转交人员面板 -->
    <q-dialog
      v-model="showTransmitPerson"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        :isSelectByGroup="false"
        :isVirtualScroll="true"
        :multiple="false"
        @select="selectTransimitPerson"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage } from '@/utils/show-message'
import { debounce } from 'quasar'
import htmlToText from '@/utils/html-to-text'
export default {
  name: 'ConsultDetail',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      formAction: [],
      showInput: false,
      isOperate: true,
      newCommunication: '',
      newRate: '',
      goIntoAction: false,
      showTransmitPerson: false,
      transimitPersonId: 0,
      consultantReply: [
        { key: 'comfirmDone', label: this.$t('consult.consultDetail.comfirmDone'), click: () => { this.debounceSubmit('comfirmDone') } },
        { key: 'continueConsult', label: this.$t('consult.consultDetail.or') + this.$t('consult.consultDetail.continueConsult'), click: () => { this.showInput = true } }
      ]
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('consult', ['consultFormAction']),
    model () {
      return this.$store.getters['consult/consult'](+this.id)
    },
    addable () {
      return Object.keys(this.model).length && this.model.status < 4 && this.isOperate
    },
    item () {
      return Object.keys(this.model).length ? this.$store.getters['consult/consultItem'](+this.model.itemID) : []
    },
    transactor () {
      return (this.model && this.selectPersons[+this.model.transactorID]) || []
    },
    consultant () {
      return (this.model && this.selectPersons[+this.model.consultantID]) || []
    }
  },
  watch: {
    'model.status': {
      deep: true,
      handler: function (newV, oldV) {
        if (Object.keys(this.model).length) {
          this.buttonShow()
        }
      }
    }
  },
  components: {
    ConsultNode: () => import('components/consult/detail/ConsultNode'),
    ConsultCommunication: () => import('components/consult/detail/ConsultCommunication'),
    ConsultAppraise: () => import('components/consult/detail/ConsultAppraise'),
    TwAvatar: () => import('components/base/TwAvatar'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  },
  methods: {
    ...mapActions('consult', ['deleteConsult', 'loadConsult', 'updateCommunication', 'loadConsultItem']),
    deleteEvent () {
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.deleteConsult(+this.model.id).then(res => {
          this.$router.push({
            name: 'consultHome'
          })
        })
      })
    },
    copyEvent () {
      this.$router.push({
        name: 'consultAdd',
        params: { openType: 'add', itemId: +this.model.itemID, transactorId: +this.model.transactorID }
      })
    },
    buttonShow () {
      // 如果我是申请人/办理人/访问者，根据当前状态判断显示什么按钮
      if (Object.keys(this.model).length) {
        if (this.$myinfo.id === this.model.consultantID) {
          switch (+this.model.status) {
            case 1: {
              this.formAction = this.consultFormAction['reply']
              break
            }
            case 2:
            case 3: {
              this.isOperate = false
              this.formAction = this.consultFormAction['send']
              break
            }
            default:
              this.isOperate = false
          }
        } else if (this.$myinfo.id === this.model.transactorID) {
          switch (+this.model.status) {
            case 1: {
              this.formAction = this.consultFormAction['startDeal']
              break
            }
            case 2: {
              this.formAction = this.consultFormAction['doneDeal']
              break
            }
            case 3: {
              this.formAction = this.consultFormAction['afterDoneDealByTransactor']
              break
            }
            default:
              this.isOperate = false
          }
        } else {
          this.isOperate = false
        }
      }
    },
    debounceSubmit: debounce(function (val) {
      this.onSubmit(val)
    }, 3000, true),
    onSubmit (action) {
      this.goIntoAction = true
      let status = this.model.status, type = 0, initCommunication = '', transactorID = this.model.transactorID
      switch (action) {
        case 'startDeal':
          // 开始受理：状态变为2，进度为2
          status = 2
          type = 2
          initCommunication = this.$t('consult.consultDetail.initStartDeal')
          break
        case 'doneDeal':
          // 处理完成：状态为3，进度为3
          status = 3
          type = 3
          initCommunication = this.$t('consult.consultDetail.initDoneDeal')
          break
        case 'comfirmDone':
          // 确认结单：状态为4，进度为4
          status = 4
          type = 4
          initCommunication = this.$t('consult.consultDetail.initComfirmDone')
          break
        case 'appraise':
          // 评价：状态为5，进度为5
          status = 5
          type = 5
          initCommunication = JSON.stringify({ newRate: this.newRate, newCommunication: this.newCommunication })
          break
        case 'transmit':
          // 转交：状态不变，进度不变，沟通记录中会记录为转交消息，type为6
          type = 6
          transactorID = this.transimitPersonId
          initCommunication = this.$t('consult.consultDetail.initTransmit')
          break
        default:
          break
      }
      const content = status === 5 ? initCommunication : (this.newCommunication || initCommunication)
      if (!htmlToText(content).trim()) {
        showWarningMessage(this.$t('consult.consultDetail.pleaseInputContent'))
        return
      }

      let receiveById = (this.$myinfo.id === this.model.consultantID || type === 6) ? transactorID : this.model.consultantID
      // 无论什么操作，均要插入沟通记录
      let communication = {
        Status: status,
        CreateByID: this.$myinfo.id,
        ConsultId: this.model.id,
        TransactorID: transactorID,
        CommunicationObj: {
          SenderID: this.$myinfo.id,
          ReceiverID: receiveById,
          Content: content,
          RoleName: this.$myinfo.id === this.model.consultantID ? 'Consultant' : (this.$myinfo.id === this.model.transactorID ? 'Transactor' : ''),
          Type: type
        }
      }
      let msgProps = status === 5 ? null : {
        route: this.$route,
        id: +this.model.itemID,
        title: this.item.title,
        content: this.newCommunication || initCommunication,
        receiveBy: receiveById,
        action: action,
        modelContent: this.model.content
      }
      this.updateCommunication({ communication: communication, msgProps: msgProps })
      this.newCommunication = ''
      this.showInput = false
    },
    onAppraise (value) {
      this.newRate = value.rate
      this.newCommunication = value.content
      this.debounceSubmit('appraise')
    },
    selectTransimitPerson (person) {
      this.transimitPersonId = person.id
      this.showTransmitPerson = false
      this.isOperate = false
      this.debounceSubmit('transmit')
    }
  },
  mounted () {
    this.loadConsult(+this.id).then(res => {
      if (res) {
        this.loadConsultItem(res.itemID)
      }
    })
    this.buttonShow()
  }
}
</script>

<style lang="scss" scoped>
</style>
