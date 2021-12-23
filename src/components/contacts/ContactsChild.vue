<template>
  <q-card-section style="margin-top:50px;">
    <q-input
      dense
      outlined
      clearable
      class="q-pb-sm"
      v-model="search"
      :label="$t('contacts.placeholder.person')"
    />

    <div v-if="!loaded" class="row justify-center q-py-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div
      v-if="loaded && !Object.keys(personGroups).length"
      class="row justify-center q-py-md text-grey"
    >
      {{ notes[type] }}
    </div>
    <q-infinite-scroll v-if="loaded" ref="qInfiniteScroll" @load="onLoad">
      <q-list
        class="bg-white"
        v-for="(persons, key, index) in personGroups"
        :key="key"
      >
        <q-item
          class="bg-grey-1"
          v-if="
            type === 'consult' ||
              type === 'service' ||
              (type === 'organize' && !!index)
          "
        >
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ key }}</q-item-label>
          </q-item-section>
        </q-item>
        <div v-for="(person, index) in persons" :key="person.id">
          <q-separator inset="item" v-if="index != 0" />
          <q-item clickable v-ripple @click="chatEvent(person)">
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
              </q-item-label>
              <q-item-label caption>{{
                type != "service" ? person.dutyName : person.description
              }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="type === 'service'">
              <q-chip
                outline
                color="positive"
                size="sm"
                class="text-weight-bold"
                v-if="
                  connectorInServiceCount.find(
                    s => s.connectorId === person.id
                  ) &&
                    connectorInServiceCount.find(
                      s => s.connectorId === person.id
                    ).count
                "
              >
                {{
                  connectorInServiceCount.find(
                    s => s.connectorId === person.id
                  ) &&
                    connectorInServiceCount.find(
                      s => s.connectorId === person.id
                    ).count
                }}
              </q-chip>
              <q-chip
                outline
                color="primary"
                size="sm"
                class="text-weight-bold"
                v-else
              >
                空闲
              </q-chip>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <q-page-sticky
      v-if="type === 'group' && Object.keys(personGroups).length"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-fab icon="add" direction="up" color="accent">
        <q-fab-action
          @click="addGroupMembers()"
          color="primary"
          icon="person_add"
        />
        <q-fab-action @click="groupChat()" color="primary" icon="chat" />
      </q-fab>
    </q-page-sticky>
    <!-- 成员关系批量添加弹窗 -->
    <q-dialog
      v-model="selectedShow"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        @multiSelect="multiSelect"
        :isVirtualScroll="true"
        :multiple="true"
        :initSelectedPersonIDs="model.members"
      />
    </q-dialog>
  </q-card-section>
</template>

<script>
import { mapGetters } from 'vuex'
import indexedDB from '@/boot/indexed-db'
export default {
  name: 'ContactsChild',
  props: {
    type: {
      type: String,
      required: true,
      default: 'organize',
      description: '类型'
    },
    id: {
      type: [String, Number],
      required: false,
      default: 0,
      description: '通过id进行人员匹配的，如：机构'
    }
  },
  data () {
    return {
      search: '',
      model: {},
      loaded: false,
      selectedShow: false,
      personGroups: {},
      notes: {
        group: '暂无我的群组，请在PC端创建我的群组',
        team: '暂无该团队成员',
        service: '暂无工程服务人员',
        consult: '暂无咨询台服务人员',
        organize: '暂无该机构成员',
        undefined: '暂无数据'
      }
    }
  },
  computed: {
    ...mapGetters('consult', ['transactors']),
    ...mapGetters('service', ['connectorInServiceCount']),
    ...mapGetters('person', [
      'selectPersonsFiltered',
      'selectPersonsOfOrganize',
      'selectPersonsOfAllConsult',
      'selectPersonsOfRoleCode',
      'filterPersonsByContactsAcl'
    ]),
    typePersons () {
      let typePersons = []
      switch (this.type) {
        case 'organize':
          typePersons = this.selectPersonsOfOrganize(this.id)
          break
        case 'service':
          typePersons = this.selectPersonsOfRoleCode('ServiceConnector')
          break
        case 'consult':
          typePersons = this.selectPersonsOfAllConsult
          break
        case 'group':
        case 'team':
          typePersons = _.filter(this.selectPersonsFiltered, p =>
            _.map(this.model.members, Number).includes(p.id)
          )
          break
        default:
          break
      }
      // 添加通讯录人员访问权限控制
      typePersons = this.filterPersonsByContactsAcl(typePersons)
      // 添加检索条件控制
      return this.search
        ? _.filter(
          typePersons,
          s =>
            ((s.name &&
                s.name.toLowerCase().includes(this.search.toLowerCase())) ||
                (s.pinyin &&
                  s.pinyin.toLowerCase().includes(this.search.toLowerCase())) ||
                (s.email &&
                  s.email.toLowerCase().includes(this.search.toLowerCase())) ||
                (s.phone && s.phone.includes(this.search)) ||
                (s.jobNumber && s.jobNumber.includes(this.search))) &&
              !!s.orgShortName
        )
        : typePersons
    },
    changeParams () {
      let {
        selectPersonsFiltered,
        transactors,
        model,
        type,
        search,
        loaded
      } = this
      return {
        selectPersonsFiltered,
        transactors,
        model,
        type,
        search,
        loaded
      }
    },
    isForbidden () {
      let isForbidden = false
      let contactsSettingsItems = this.$store.getters['settings/contactsItems']
      if (
        contactsSettingsItems.forbidden.orgIds.includes(this.$myinfo.organizeId)
      ) {
        isForbidden = true
      }
      if (contactsSettingsItems.forbidden.psonIds.includes(this.$myinfo.id)) {
        isForbidden = true
      }
      return isForbidden
    }
  },
  methods: {
    chatEvent (person) {
      this.$router.push({
        name: 'chat',
        params: { category: 'person', objectID: person.id },
        query: { type: this.type }
      })
    },
    addGroupMembers () {
      this.selectedShow = true
    },
    groupChat () {
      this.$router.push({
        name: 'chat',
        params: { category: 'group', objectID: this.model.id }
      })
    },
    multiSelect (selectedGroupPersons) {
      let id = this.model.id
      let fieldName = 'members'
      let value = _.map(selectedGroupPersons, 'id').join(',')
      this.$store
        .dispatch('group/updateGroupField', { id, fieldName, value })
        .then(() => {
          this.model.members = _.map(selectedGroupPersons, 'id')
          this.selectedShow = false
        })
    },
    onLoad (index, done) {
      let typePersons = _.orderBy(this.typePersons, ['organizeNum'], ['asc'])
      this.personGroups = _.groupBy(_.slice(typePersons, 0, index * 20), p =>
        p.orgShortName !== 'undefined' &&
        p.orgShortName !== null &&
        p.orgShortName.trim() !== ''
          ? p.orgShortName
          : '其他'
      )
      if (index * 20 >= this.typePersons.length) {
        done(true)
      } else {
        done()
      }
    }
  },
  watch: {
    changeParams: {
      deep: true,
      handler () {
        if (this.$refs.qInfiniteScroll) {
          this.$refs.qInfiniteScroll.reset()
          this.$refs.qInfiniteScroll.resume()
          this.$refs.qInfiniteScroll.trigger()
        }
      }
    }
  },
  async created () {
    if (!this.isForbidden) {
      if (['organize', 'team', 'group'].includes(this.type)) {
        await this.$store
          .dispatch('resource/loadResourceItem', {
            objectID: this.id,
            objectType: this.type
          })
          .then(res => {
            this.model = res
          })
      }
      if (this.type === 'consult') {
        await this.$store.dispatch('consult/loadTransactors')
      }
      if (this.type === 'service') {
        await this.$store.dispatch(`service/loadConnectorInServiceCount`)
      }
      let getLastUpdateTime = await indexedDB.getLastUpdateTime()
      if (!_.isEmpty(getLastUpdateTime)) this.loaded = true
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel')
  }
}
</script>

<style scoped lang="scss"></style>
