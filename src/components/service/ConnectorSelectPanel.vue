<template>
  <q-card>
    <q-card-section>
      <q-input
        dense
        outlined
        clearable
        class="bg-white q-ma-sm"
        v-model="search"
        :label="$t('contacts.placeholder.person')"
      />
      <div
        class="q-px-sm"
        v-if="typeList.length===0"
      >
        <tw-banner-no-result :info="$t('service.noConnector')" />
        <!-- <q-spinner-dots
          color="primary"
          size="40px"
        /> -->
      </div>
      <q-list
        v-else
        class="bg-white"
        v-for="tl in typeList"
        :key="tl.id"
      >
        <!-- <q-item-label
        header
        class="bg-grey-1"
      >{{ tl.name||tl.title }}</q-item-label> -->
        <div
          v-for="(person,index) in typePersons(tl.id)"
          :key="person.id"
        >
          <q-separator v-if="index!==0" />
          <q-item
            clickable
            @click="onClickEvent(person)"
          >
            <q-item-section avatar>
              <tw-avatar
                :id="person.id"
                :name="person.name"
                :img="person.img"
                :popupCard="true"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ person.name }}
                <q-chip
                  outline
                  color="secondary"
                  size="sm"
                  class="text-weight-bold"
                >
                  {{connectorInServiceCount.find(s=>s.connectorId===person.id)&&connectorInServiceCount.find(s=>s.connectorId===person.id).count?connectorInServiceCount.find(s=>s.connectorId===person.id)&&connectorInServiceCount.find(s=>s.connectorId===person.id).count:'空闲'}}
                </q-chip>
              </q-item-label>
              <q-item-label caption>{{person.description}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { date, LocalStorage } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { showWarningMessage } from '@/utils/show-message'
const { formatDate } = date
export default {
  name: 'ServiceAssignToPanel',
  inject: ['reload'],
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  props: {
    model: { type: Object, required: true, desc: '需求对象' }
  },
  data () {
    return {
      search: '',
      myself: LocalStorage.getItem('myself'),
      limit: 10
    }
  },
  watch: {
    search (val) {
      // 先检索人员列表。从而检索所属节点列表
      this.$store.commit('person/setSearch', val)
      // 判断是否存在要检索的人员列表
      if (this.persons.length) {
        // 有人员信息时先重置类别关键字，防止无法根据类别列表获取类别ID集合
        this.$store.commit('service/setSearch', '')
        // 没有检索到人员列表。从而检索匹配的节点列表以及底下的所有人员列表
      } else {
        // 检索节点
        this.$store.commit('service/setSearch', val)
      }
    }
  },
  computed: {
    ...mapGetters('role', ['roles']),
    ...mapGetters('service', ['connectorInServiceCount']),
    ...mapGetters('person', ['persons', 'personsOfRole']),
    typeList () {
      let typeList = _.filter(this.roles, r => r.code === 'ServiceConnector')
      return _.filter(typeList, tl => this.typePersons(tl.id).length > 0)
    },
    typePersons () {
      return typeId => {
        return this[`personsOfRole`](typeId)
      }
    }
  },
  methods: {
    ...mapActions('person', ['loadPersons']),
    ...mapActions('role', ['loadRoles']),
    ...mapActions('service', ['updateServiceField', 'updateActivity', 'sendMessage']),
    onClickEvent (person) {
      let that = this
      showConfirm(this.$t('service.assigntoConfirm', { name: person.name }),
        () => { that.onPersonSelect(person) },
        () => { })
    },
    onPersonSelect (person) {
      let that = this
      if (person.id !== this.model.connectorId) {
        let updateFields = {
          Id: this.model.id,
          ConnectorID: person.id,
          ConnectTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          Status: 'start'
        }
        // 如果是重新指派，移除原对接人，同时ConnectChange恢复到初始状态
        let newMembers = _.uniq(_.flatten([this.model.members, person.id, this.myself.id]))
        _.remove(newMembers, m => m === this.model.connectorId)
        if (this.model.connectChange && this.model.connectChange.changed) {
          let connectChange = JSON.stringify({ changed: false, reason: '' })
          updateFields.ConnectChange = connectChange
        } else {
          updateFields.ManagerID = this.myself.id
        }
        updateFields.Members = _.join(_.uniq(newMembers), ',')
        // 指派
        if (this.model.connectorId === 0) {
          this.updateServiceField(updateFields).then(res => {
            res && Object.assign(that.model, res)
            that.sendMessage({ service: res, eventType: 'assignTo' })
            that.$emit('onAssignCallback', person)
            this.updateActivity({ status: 'showAssignTo', id: this.model.id }).then(res => {
              this.reload()
            })
          })
        } else if (this.model.connectorId !== 0) { // 重新指派
          this.updateServiceField(updateFields).then(res => {
            res && Object.assign(that.model, res)
            that.sendMessage({ service: res, eventType: 'assignTo' })
            that.$emit('onAssignCallback', person)
            this.updateActivity({ status: 'showAaginTo', id: this.model.id }).then(res => {
              this.reload()
            })
          })
        }
      } else {
        showWarningMessage(this.$t('service.note.repeatAssign'))
      }
    }
  },
  mounted () {
    var _this = this
    _this.$nextTick(() => {
      _this.loadPersons()
      _this.loadRoles()
      _this.$store.dispatch(`service/loadConnectorInServiceCount`)
    })
  }
}
</script>

<style lang='scss' scoped>
</style>
