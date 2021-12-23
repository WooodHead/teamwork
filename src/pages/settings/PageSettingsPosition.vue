<!-- 职级查看权限设置 -->
<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card :title="$t('settings.position.pageTitle')" />
    <!-- 允许以下范围的职工查看职级信息 -->
    <q-card-section class="q-px-xxl">
      <q-item>
        <q-item-label class="text-h5">{{ $t("settings.position.allowedRange") }}</q-item-label>
      </q-item>
      <!-- 列表 -->
      <q-item v-if="model.allowedOrganizeIDs && model.allowedOrganizeIDs.length">
        <div class="row">
          <q-chip
            v-for="id in model.allowedOrganizeIDs"
            :key="`ticked-${id}`"
            dense
            removable
            @remove="removeTick(id)"
          >
            {{keyOrganizes[id] && keyOrganizes[id].name}}
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
            :ticked.sync="model.allowedOrganizeIDs"
            @update:ticked="onUpdateTicked"
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
import { showSuccessMessage } from '@/utils/show-message'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'PageSettingsPosition',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  },
  data () {
    return {
      submitting: false,
      model: {}
    }
  },
  computed: {
    ...mapGetters('duty', ['selectDutys']),
    ...mapGetters('organize', ['selectOrganizes', 'selectOrganizesTree', 'selectOrganizes']),
    ...mapState('settings', ['settings']),
    // 机构数据
    keyOrganizes () {
      return _.keyBy(this.selectOrganizes, 'id')
    },
    flatOrganizes () {
      return this.flatChildren(this.selectOrganizesTree)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    showSuccessMessage,
    ...mapActions('settings', ['loadSettings', 'addSetting', 'updateSetting']),
    init () {
      this.loadSettings().then(res => {
        this.model = res.position
      })
    },
    removeTick (tick) {
      let org = this.flatOrganizes.find(org => org.id === tick)
      if (org.children.length) {
        let children = this.flatChildren(org.children)
        _.pull(this.model.allowedOrganizeIDs, ...children.map(a => a.id))
      }
      this.model.allowedOrganizeIDs.splice(this.model.allowedOrganizeIDs.indexOf(tick), 1)
      this.model.allowedOrganizeIDs = this.filterdAllowedOrganizeIDs(this.model.allowedOrganizeIDs)
    },
    onUpdateTicked (ids) {
      this.model.allowedOrganizeIDs = this.filterdAllowedOrganizeIDs(ids)
    },
    // 剔除未选择子节点的父节点
    filterdAllowedOrganizeIDs (ids) {
      let orgs = this.flatOrganizes.filter(org => ids.includes(org.id))
      let parentIds = _.union(orgs.map(org => org.parentId)).sort()
      // 过滤父节点，当所有子节点选中时包含父节点，否则剔除
      parentIds = parentIds.filter(parentId => {
        // 排除 parentId = 0
        if (parentId === 0) {
          return false
        }
        let parentOrg = this.flatOrganizes.find(org => org.id === parentId)
        let nodesIDs = this.flatChildren(parentOrg.children).filter(org => org.children.length === 0).map(node => node.id)
        if (_.isEqual(_.intersection(ids, nodesIDs), nodesIDs)) {
          return true
        } else {
          _.pull(ids, parentId)
          return false
        }
      })
      return _.union([...parentIds, ...ids])
    },
    flatChildren (children) {
      let temp = []
      flat(children)
      function flat (orgs) {
        orgs.map(org => {
          temp.push(org)
          if (org.children.length) {
            flat(org.children)
          }
        })
      }
      return temp
    },
    submit () {
      this.submitting = true
      let setting = {
        id: this.settings.position.id,
        type: 'position',
        settings: {
          allowedOrganizeIDs: this.model.allowedOrganizeIDs
        }
      }
      if (this.model.id === 0) {
        this.addSetting(setting).then(res => {
          showSuccessMessage('操作成功')
          this.submitting = false
          this.init()
        })
      } else {
        this.updateSetting(setting).then(res => {
          showSuccessMessage('操作成功')
          this.submitting = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
