<template>
  <q-card
    flat
    bordered
    class="cursor-pointer"
    :class="['service-card base-card',{'archived':model.archived}]"
    @click.stop="onDetail"
  >
    <q-item class="q-pa-md">
      <q-item-section>
        <q-item-label
          :lines="1"
          :title="model.title"
          class="flex items-center text-h2-g text-text1 text-weight-bold q-mb-sm"
        >
          <p class="q-mb-none col ellipsis">{{model.title}}</p>

          <q-space />

          <q-badge
            :color="statusColor"
            :label="statusLabel"
            class="col-auto q-ml-xs"
          />
        </q-item-label>
        <q-item-label class="text-body-g text-text1">
          <p class="q-mb-xs">需求者：{{fullName(model.owner)}}</p>
          <p class="q-mb-xs">对接者：{{fullName(model.connectorId)}}</p>
          <p class="q-mb-xs">创建时间：{{model.createTime}}</p>
        </q-item-label>
        <q-separator class="q-my-sm" />
        <!-- 描述 -->
        <q-item-label
          class="text-body-g ellipsis-2-lines text-text2"
          v-html="htmlToText(model.notes)"
          :title="htmlToText(model.notes)"
        >
        </q-item-label>
        <!-- <q-item-label
          caption
          :lines="2"
          :title="model.notes"
          class="height28"
        >{{model.notes}}</q-item-label>
        <q-item-label caption>
          {{model.createTime}}
        </q-item-label> -->
      </q-item-section>
    </q-item>

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
  </q-card>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
import { mapState } from 'vuex'
export default {
  name: 'ServiceCard',
  components: {
    // TwAvatar: () => import('components/base/TwAvatar'),
    ConnectorSelectPanel: () => import('components/service/ConnectorSelectPanel')
  },
  props: {
    model: { type: Object, required: true, desc: '需求对象' }
  },
  data () {
    return {
      showConnectorSelect: false
    }
  },
  computed: {
    ...mapState('service', ['statusItems']),
    ...mapState('person', ['selectPersons']),
    statusColor () {
      return this.statusItems[this.model.status].color
    },
    statusLabel () {
      return this.statusItems[this.model.status].label
    },
    assignLabel () {
      return this.model.connectorId === 0
        ? this.$t('service.action.assignTo')
        : this.$t('service.action.reAssignTo')
    },
    showAssignTo () {
      return (this.model.status === 'wait' || this.model.status === 'doing') &&
        ((this.model.connectorId === 0 && this.$myinfo.auth.role.isServiceManager) ||
          (this.model.connectorId > 0 &&
            this.model.managerId === this.$q.localStorage.getItem('myself').id))
    },
    person () {
      return function (id) { return this.selectPersons[id] || {} }
    },
    fullName () {
      return function (id) { return this.person(id).name || '' }
    }
  },
  methods: {
    htmlToText,
    onDetail () {
      this.$router.push({
        name: 'serviceDetail',
        params: { id: this.model.id }
      })
    },
    onAssignCallback () {
      this.showConnectorSelect = false
    }
  }
}
</script>

<style lang='scss' scoped>
.line-height32 {
  line-height: 32px;
}

.height28 {
  height: 28px;
}
.q-badge {
  padding: 4px 6px;
}
</style>
