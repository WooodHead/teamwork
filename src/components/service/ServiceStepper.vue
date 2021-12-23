<template>
  <div>
    <!--步进器展示-->
    <tw-stepper
      class="stepper-nocontent"
      :step="stepId"
      :alternativeLabels="$q.screen.lt.sm"
      :stepList="stepList"
    />

    <!--变更对接人、指派/重新指派、开始对接、完成服务、确认结束-->
    <div class="flex justify-center">
      <div>
        <!--变更对接人-->
        <q-btn
          v-if="showChangeConnector"
          outline
          rounded
          :label="$t('service.action.changeConnector')"
          @click="changeNote = true"
        />
      </div>
      <div class="q-pl-sm">
        <!--指派/重新指派-->
        <q-btn
          v-if="model.connectorId === 0 ?showAssignTo:showAaginTo"
          outline
          rounded
          color="primary"
          :label="model.connectorId === 0 ?$t('service.action.assignTo'):$t('service.action.reAssignTo')"
          @click.stop="showConnectorSelect=true"
        />
        <!--开始对接-->
        <q-btn
          v-else-if="serviceStart"
          outline
          rounded
          color="primary"
          :label="$t('service.action.startDoing')"
          @click.native="startDoing"
        />
        <!--完成服务-->
        <q-btn
          v-else-if="serviceDone"
          outline
          rounded
          color="primary"
          :label="$t('service.action.serviceDone')"
          @click.native="ServiceDone"
        />
        <!--确认结束-->
        <q-btn
          v-if="serviceConfirm"
          outline
          rounded
          color="primary"
          :label="$t('service.action.serviceConfirm')"
          @click.native="ServiceConfirm"
        />
      </div>
    </div>

    <!-- 指派、重新指派对接人 -->
    <q-dialog
      v-model="showConnectorSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <connector-select-panel
        :model="model"
        @onAssignCallback="onAssignCallback"
        class="full-width"
      />
    </q-dialog>

    <!--变更对接人说明-->
    <q-dialog
      v-model="changeNote"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">变更说明</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="notes"
            autofocus
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            :label="$q.lang.label.ok"
            color="primary"
            @click="sureChangeNote"
          />
          <q-btn
            outline
            :label="$q.lang.label.cancel"
            color="primary"
            class="q-ml-md"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'ServiceStepper',
  props: {
    status: {
      type: String,
      required: true,
      default: 'wait'
    },
    id: {
      type: [String, Number],
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  inject: ['reload'],
  data () {
    return {
      myself: LocalStorage.getItem('myself'),
      changeNote: false,
      notes: '',
      query:
        [
          { Key: 'ObjectType', Value: 'service', Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: Number(this.id), Oper: 'eq' }
        ],
      limit: 10,
      showConnectorSelect: false
    }
  },
  mounted () {
    // 初始化变更说明数据
    this.loadService(this.id).then(res => {
      this.notes = res.connectChange.reason
    })
  },
  computed: {
    ...mapState('service', ['statusItems']),
    stepItem () {
      return this.statusItems[this.status] || {}
    },
    stepId () {
      return this.stepItem.id
    },
    stepList () {
      return [
        {
          name: 10,
          title: '提需求',
          icon: 'add_comment',
          doneColor: 'primary',
          done: this.stepId >= 10
        },
        {
          name: 20,
          title: this.stepId < 20 ? '待指派' : '已指派',
          icon: 'touch_app',
          doneIcon: this.stepId < 20 ? 'touch_app' : 'done',
          doneColor: 'secondary',
          done: this.stepId >= 20
        },
        {
          name: 30,
          title: this.stepId < 30 ? '待对接' : this.stepId < 40 ? '对接中' : '已完成',
          icon: 'compare_arrows',
          doneIcon: this.stepId < 40 ? 'compare_arrows' : 'done',
          doneColor: 'positive',
          done: this.stepId >= 30
        },
        {
          name: 50,
          title: this.stepId < 50 ? '待确认' : '已确认',
          icon: 'receipt',
          doneIcon: 'done',
          doneColor: 'dark',
          done: this.stepId === 50
        }
      ]
    },
    // 需求已发布未指派，仅管理员处显示'指派给'
    showAssignTo () {
      return (this.model.status === 'wait' || this.model.status === 'doing') &&
        (this.model.connectorId === 0 && this.$myinfo.auth.role.isServiceManager)
    },
    // 需求已指派,未完成，仅对接人处显示'变更对接人'
    showChangeConnector () {
      return this.model.status !== 'wait' &&
        this.model.status !== 'confirmed' &&
        this.model.status !== 'done' &&
        this.model.connectorId === this.myself.id
    },
    // 对接人申请变更，对接人处显示'变更对接人'，管理者显示'重新指派'
    showAaginTo () {
      return (this.model.status !== 'confirmed' && this.model.managerId === this.myself.id)
    },
    // 开始对接，由对接人触发
    serviceStart () {
      return this.model.status === 'start' &&
        this.model.connectorId === this.myself.id
    },
    // 完成服务
    serviceDone () {
      return this.model.status === 'doing' &&
        this.model.connectorId === this.myself.id
    },
    // 确认结束
    serviceConfirm () {
      return this.model.status === 'done' &&
        this.model.owner === this.myself.id
    }
  },
  methods: {
    ...mapActions('service', ['updateServiceField', 'updateStatus', 'updateActivity', 'sendMessage', 'loadService']),
    // 开始对接，更新状态
    startDoing () {
      let that = this
      let updateFields = {
        Id: this.model.id,
        ConnectorID: this.model.connectorId
      }
      this.updateServiceField(updateFields).then(res => {
        res && Object.assign(that.model, res)
        this.changeNote = false
        this.updateActivity({ status: 'startDoing', id: this.model.id })
        this.reload()
      })
      this.updateStatus({ id: this.id, status: 'doing' })
    },
    // 完成对接，更新状态
    ServiceDone () {
      let that = this
      let updateFields = {
        Id: this.model.id,
        ConnectorID: this.model.connectorId
      }
      this.updateServiceField(updateFields).then(res => {
        res && Object.assign(that.model, res)
        this.changeNote = false
        this.reload()
      })
      this.updateStatus({ id: this.id, status: 'done' })
    },
    // 客户确认服务结束,跳转评价页面
    ServiceConfirm () {
      this.$router.push({
        name: 'evaluation',
        params: { objectID: this.id, category: 'service' }
      })
    },
    // 变更说明
    sureChangeNote () {
      let that = this
      let updateFields = {
        Id: this.model.id,
        ConnectorID: this.model.connectorId
      }
      let connectChange = JSON.stringify({ changed: true, reason: this.notes })
      updateFields.ConnectChange = connectChange
      this.updateServiceField(updateFields).then(res => {
        res && Object.assign(that.model, res)
        that.sendMessage({ service: res, eventType: 'connectChange' })
        this.changeNote = false
        this.reload()
      })
    },
    onAssignCallback () {
      this.showConnectorSelect = false
    }
  },
  components: {
    TwStepper: () => import('components/base/TwStepper'),
    ConnectorSelectPanel: () => import('components/service/ConnectorSelectPanel')
  }
}
</script>

<style scoped lang="scss">
/deep/.q-stepper__header--alternative-labels .q-stepper__tab,
/deep/.q-stepper__tab {
  min-height: 0;
  padding: 0;
}
</style>
