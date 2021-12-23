<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- tabs -->
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="center"
        narrow-indicator
      >
        <q-tab
          name="selfService"
          icon="import_contacts"
          :label="$t('service.tab.selfService')"
        />
        <q-tab
          name="serviceList"
          icon="polymer"
          :label="$t('service.tab.serviceList')"
        />
        <q-tab
          name="serviceContact"
          icon="contacts"
          :label="$t('service.tab.serviceContact')"
        />
      </q-tabs>

      <!-- 自助服务的报警和维保查询按钮 -->
      <q-card-section
        v-if="tab==='selfService'"
        class="q-pb-none"
      >
        <div class="row justify-center q-gutter-md">
          <!-- <q-btn
            no-caps
            rounded
            unelevated
            icon="account_balance_wallet"
            color="positive"
            :label="$t('service.action.maintenanceQuery')"
          /> -->
          <folder-add-menu
            category="selfService"
            :id="selfServiceDocID"
          />
          <q-btn
            outline
            no-caps
            rounded
            unelevated
            icon="error"
            color="positive"
            :label="$t('service.action.alarmQuery')"
            @click="$router.push({name:'jd50AlarmQuery'})"
          />
        </div>
      </q-card-section>

      <q-card-section
        v-if="!showForm&&tab==='serviceList'"
        class="q-pb-none"
      >
        <div class="row justify-center q-gutter-md">
          <q-btn
            no-caps
            rounded
            unelevated
            icon="add"
            color="positive"
            :label="$t('service.action.add')"
            @click="addEvent"
          />
          <q-btn
            no-caps
            rounded
            outline
            unelevated
            icon="insert_chart"
            color="positive"
            @click="$router.push({name:'serviceChart'})"
            :label="$t('service.action.chart')"
          />
        </div>
      </q-card-section>
      <!-- form -->
      <q-card-section
        v-if="showForm&&tab==='serviceList'"
        :class="{'q-px-none':$q.platform.is.mobile}"
      >
        <service-form
          @cancel="showForm = false"
          :id="0"
        />
      </q-card-section>

      <q-tab-panels
        v-model="tab"
        animated
        infinite
        swipeable
        keep-alive
        transition-prev="fade"
        transition-next="fade"
        :class="$q.screen.gt.xs?'q-px-xl q-pt-md':'q-px-md q-pt-md'"
      >
        <q-tab-panel
          name="selfService"
          class="q-pa-none"
        >
          <!-- 自助服务 -->
          <!-- <self-service /> -->
          <folder-content
            category="selfService"
            :id.sync="selfServiceDocID"
          />
        </q-tab-panel>

        <q-tab-panel
          name="serviceList"
          class="q-pa-none"
        >
          <service-card-list
            :showForm="showForm"
            @nodata="showForm=true"
          />

          <!-- 归档区 -->
          <q-card-section
            v-if="archivedCount"
            class="q-pa-none"
          >
            <tw-archived-count
              :label="$t('archive.someArchived',{count:archivedCount,something:$t('service.title')})"
              @click="showArchiveList()"
            />
          </q-card-section>

        </q-tab-panel>

        <!-- 联系我们 -->
        <q-tab-panel
          name="serviceContact"
          class="q-pa-none"
        >
          <contacts-child
            title="工程服务"
            type="service"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
const localTabKey = 'service-tab-newest'
let localTabValue = LocalStorage.getItem(localTabKey) || {}
export default {
  name: 'PageService',
  components: {
    FolderContent: () => import('components/document/folder/FolderContent.vue'),
    ServiceCardList: () => import('components/service/card/ServiceCardList'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    ContactsChild: () => import('components/contacts/ContactsChild'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    ServiceForm: () => import('components/service/ServiceForm'),
    FolderAddMenu: () => import('components/document/folder/FolderAddMenu')
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself'),
      showForm: false,
      selfServiceDocID: 0
    }
  },
  computed: {
    ...mapState('service', ['curPsonId', 'curTab', 'listServices', 'archivedCount']),
    tab: {
      get: function () {
        return this.curTab
      },
      set: function (newValue) {
        this.setCurTab(newValue)

        localTabValue[this.myself.id] = newValue
        this.$q.localStorage.set(localTabKey, localTabValue)
      }
    },
    serviceList () {
      return this.listServices
    }
  },
  methods: {
    ...mapMutations('service', ['setCurPsonId', 'setCurTab', 'setPage', 'emptyServices']),
    ...mapActions('service', ['loadArchivedCount']),
    addEvent () {
      this.tab !== 'serviceList' && (this.tab = 'serviceList')
      this.showForm = true
    },
    showArchiveList () {
      this.$router.push({
        name: 'serviceArchive'
      })
    },
    resetState () {
      this.setCurTab('selfService')
      this.emptyServices()
      this.setPage({
        offset: 0,
        limit: 20,
        total: 0,
        nextPageToken: 0
      })
    }
  },
  created () {
    // 重置state，防止退出系统换人登录后数据权限问题
    if (this.curPsonId !== this.myself.id) {
      this.setCurPsonId(this.myself.id)
      this.resetState()
      this.loadArchivedCount()
    }

    // 设置为上次进入时的tab
    const localTabValue = this.$q.localStorage.getItem(localTabKey)
    if (localTabValue && localTabValue[this.myself.id] !== void 0) {
      this.setCurTab(localTabValue[this.myself.id])
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
