<!-- 系统研发体系设置 -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card :title="$t('settings.devSystem.pageTitle')" />
    <!-- 非研发体系下的部门 -->
    <q-card-section class="q-px-xxl">
      <q-item>
        <q-item-label header>{{ $t("settings.devSystem.excludeOrgs") }}</q-item-label>
      </q-item>
      <!-- 列表 -->
      <q-item v-if="model.excludeOrganizeIDs && model.excludeOrganizeIDs.length">
        <div class="row">
          <q-chip
            v-for="id in model.excludeOrganizeIDs"
            :key="`ticked-${id}`"
            dense
            removable
            @remove="removeTick(id)"
          >
            {{mapOrganizes[id] && mapOrganizes[id].name}}
          </q-chip>
        </div>
      </q-item>
      <!-- 树状结构 -->
      <q-item>
        <q-item-section>
          <q-tree
            ref="expandTree"
            class="col-12"
            node-key="id"
            :nodes="selectOrganizesTree"
            label-key="name"
            selected-color="primary"
            tick-strategy="leaf"
            :ticked.sync="model.excludeOrganizeIDs"
          />
        </q-item-section>
      </q-item>
      <!-- 非研发体系下的职位 -->
      <q-item>
        <q-item-label header>{{ $t("settings.devSystem.excludeDutys") }}</q-item-label>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            outlined
            v-model="model.excludeDutyIDs"
            use-input
            use-chips
            multiple
            :label="$t('settings.devSystem.selectExcludeDutys')"
            option-value="id"
            option-label="name"
            input-debounce="0"
            :options="selectDutys"
            emit-value
            map-options
          />
        </q-item-section>
      </q-item>

      <!-- 保存 -->
      <q-item>
        <q-item-section>
          <q-btn
            color="primary"
            @click="submit"
            :loading="submitting"
          >
            {{$t('action.save')}}
          </q-btn>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'PageSettingsDevSystem',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  data () {
    return {
      submitting: false,
      model: {},
      dutyOptions: []
    }
  },
  computed: {
    ...mapGetters('duty', ['selectDutys']),
    ...mapGetters('organize', ['selectOrganizes', 'selectOrganizesTree']),
    ...mapState('settings', ['settings']),
    // 机构数据
    mapOrganizes () {
      return _.keyBy(this.selectOrganizes, 'id')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('settings', ['loadSettings', 'addSetting', 'updateSetting']),
    init () {
      this.model = _.cloneDeep(this.settings.devSystem)
      this.loadSettings().then(res => {
        this.model = _.cloneDeep(res.devSystem)
      })
    },
    removeTick (tick) {
      this.model.excludeOrganizeIDs.splice(this.model.excludeOrganizeIDs.indexOf(tick), 1)
    },
    submit () {
      this.submitting = true
      let setting = {
        id: this.model.id,
        type: 'devSystem',
        settings: {
          excludeDutyIDs: this.model.excludeDutyIDs,
          excludeOrganizeIDs: this.model.excludeOrganizeIDs
        }
      }
      if (this.model.id === 0) {
        this.addSetting(setting).then(res => {
          this.submitting = false
          this.init()
        })
      } else {
        this.updateSetting(setting).then(res => {
          this.submitting = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
