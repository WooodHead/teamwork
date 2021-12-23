<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <q-card-section class="q-pa-sm">
      <q-input
        dense
        outlined
        clearable
        debounce
        v-model="search"
        :label="$t('contacts.placeholder.person')"
        class="q-pa-sm"
      />
      <q-list
        separator
        v-if="search"
      >
        <template v-for="(item,i) in personsBySearch">
          <q-item
            clickable
            v-ripple
            :key="'item'+item.id"
            @click="jumpRoute('frequentContact',item)"
          >
            <q-item-section avatar>
              <tw-avatar
                :id="item.id"
                :popupCard="false"
              />
            </q-item-section>
            <q-item-section>{{ item.name }}</q-item-section>
          </q-item>
          <q-separator
            inset="item"
            :key="'separator'+item.id"
            v-if="i<personsBySearch.length-1"
          />
        </template>
      </q-list>

      <q-list
        v-else
        v-for="group in groups"
        :key="group.id"
        separator
      >
        <q-item-label
          header
          class="bg-grey-1"
        >{{ group.label }}</q-item-label>
        <template v-for="(item,i) in mhome[group.name]">
          <q-item
            clickable
            v-ripple
            :key="'item'+group.name+item.id"
            @click="jumpRoute(['service','teamGroup'].includes(group.name)?item.type:group.name,item)"
          >
            <q-item-section avatar>
              <tw-avatar
                v-if="group.name==='frequentContact'"
                :id="item.id"
                :popupCard="false"
              />
              <q-avatar
                v-else
                rounded
                text-color="white"
                :color="item.color||'light-blue'"
                :icon="item.icon||group.icon"
              />
            </q-item-section>
            <q-item-section>{{ item.title|| item.label || item.name }}</q-item-section>
          </q-item>
          <q-separator
            inset="item"
            :key="'separator'+group.name+item.id"
            v-if="i<mhome[group.name].length-1"
          />
        </template>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ContactsMobile',
  data () {
    return {
      groups: [
        { id: 1, label: '组织机构', icon: 'group', color: 'text-teal', name: 'organize' },
        { id: 2, label: '服务', icon: 'group', color: 'text-info', name: 'service' },
        { id: 3, label: '团队群组', icon: 'group', color: 'text-primary', name: 'teamGroup' },
        { id: 4, label: '常联系人', icon: 'group', color: 'text-primary', name: 'frequentContact' }
      ],
      search: ''
    }
  },
  computed: {
    ...mapGetters('person', ['filterPersonsByContactsAcl']),
    ...mapState('contacts', ['mhome']),
    personsBySearch () {
      // 添加通讯录人员访问权限过滤
      let selectPersons = this.filterPersonsByContactsAcl(_.values(this.$store.state.person.selectPersons))
      // 添加检索过滤
      return _.filter(selectPersons, person =>
        (person.name && person.name.toLowerCase().includes(this.search.toLowerCase())) ||
        (person.pinyin && person.pinyin.toLowerCase().includes(this.search.toLowerCase()))
      )
    },
    isForbidden () {
      let isForbidden = false
      let contactsSettingsItems = this.$store.getters['settings/contactsItems']
      if (contactsSettingsItems.forbidden.orgIds.includes(this.$myinfo.organizeId)) {
        isForbidden = true
      }
      if (contactsSettingsItems.forbidden.psonIds.includes(this.$myinfo.id)) {
        isForbidden = true
      }
      return isForbidden
    }
  },
  created () {
    this.GetContactItems()
  },
  methods: {
    ...mapActions('contacts', ['GetContactItems']),
    jumpRoute (key, item) {
      key === 'frequentContact'
        ? this.$router.push({ name: 'chat', params: { category: 'person', objectID: item.id } })
        : this.$router.push({
          name: 'contactsSub',
          params: {
            type: key,
            id: item.id
          }
        })
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style scoped lang="scss">
</style>
