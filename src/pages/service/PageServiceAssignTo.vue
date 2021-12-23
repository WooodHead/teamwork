<template>
  <q-page>
    <q-card
      class="card-grow-in-page"
      :flat="$q.screen.lt.sm"
    >
      <tw-header-card :title="cardTitle" />
      <q-card-section class="q-pt-none q-px-xxl">
        <q-banner
          v-if="showAssigned"
          rounded
          class="q-mb-md bg-grey-3 col text-body1"
        >
          <template v-slot:avatar>
            <q-icon
              name="warning"
              color="warning"
            />
          </template>
          {{$t('service.assignedNotes')}}
        </q-banner>

        <q-card class="borderLine q-pa-md">
          <div v-if="showChangeNotes">
            <div class="q-pb-md text-caption">
              <tw-avatar
                size="xs"
                :id="model.connectorId"
              />
              <span>{{selectPersons[model.connectorId] && selectPersons[model.connectorId].name}}</span>
              <i>{{$t('service.reason')}}</i>
              <span class="q-ml-xs text-grey-7">{{ model.connectChange.reason }}</span>
            </div>
            <q-separator class="q-mb-md" />
          </div>

          <div class="q-pb-sm">
            <span>
              <tw-avatar
                size="md"
                :id="model.owner"
              />
              {{selectPersons[model.owner] && selectPersons[model.owner].name}}
            </span>

            <q-icon
              name="arrow_forward"
              class="q-px-sm"
            />

            <span class="q-ml-md">
              <tw-avatar
                v-if="model.connectorId>0"
                size="md"
                :id="model.connectorId"
              />
              {{selectPersons[model.connectorId]&&selectPersons[model.connectorId].name}}
            </span>

            <q-btn
              v-if="activedConfirm"
              rounded
              unelevated
              :label="assignLabel"
              color="primary"
              @click.stop="showConnectorSelect=true"
            />
          </div>

          <service-card-detail
            v-if="model"
            :id="+id"
          />
        </q-card>
      </q-card-section>
    </q-card>

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

    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'PageServiceAssignTo',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwAvatar: () => import('components/base/TwAvatar'),
    ConnectorSelectPanel: () => import('components/service/ConnectorSelectPanel'),
    ServiceCardDetail: () => import('components/service/card/ServiceCardDetail'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  props: {
    id: { type: [String, Number], required: true, desc: '需求id' }
  },
  data () {
    return {
      showConnectorSelect: false
    }
  },
  watch: {
    id (newVal, oldVal) {
      if (+newVal !== +oldVal) {
        this.init()
      }
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapGetters('service', ['service']),
    model () {
      return this.service(+this.id)
    },
    cardTitle () {
      return this.$t('service.cardTitle.assign')
    },
    assignLabel () {
      return this.model.connectorId === 0
        ? this.$t('service.action.assignTo')
        : this.$t('service.action.reAssignTo')
    },
    showAssigned () {
      return this.$myinfo.auth.role.isServiceManager &&
        this.model.connectorId > 0 &&
        this.model.managerId !== this.$myinfo.id
    },
    activedConfirm () {
      return this.$myinfo.auth.role.isServiceManager &&
        (this.model.managerId === 0 || this.model.managerId === this.$myinfo.id)
    },
    showChangeNotes () {
      return this.model.connectChange &&
        this.model.connectChange.changed
    }
  },
  methods: {
    ...mapActions('service', ['loadService']),
    init () {
      this.loadService(+this.id)
    },
    onAssignCallback () {
      this.showConnectorSelect = false
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
.borderLine {
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 0.6rem;
}
</style>
