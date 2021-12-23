<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card :title="$t('consult.addSelect.consultItem')">
      <template
        #menu
        v-if="$q.platform.is.mobile&&selectOptions.length"
      >
        <item-list-menu
          :outline="false"
          :showConsultAdministrator="!!consultRolePsonIds.length"
          @chat="chat"
          @itemType="showItemType=true"
        />
      </template>
    </tw-header-card>

    <tw-search-sort
      :class="['q-px-xxl',$q.screen.lt.sm?'q-pt-md':'q-pt-sm' ]"
      :search.sync="search"
    />

    <q-card-section class="q-px-xxl">
      <div v-if="!selectOptions.length">
        <q-banner
          rounded
          class="bg-grey-3 col "
        >
          <template v-slot:avatar>
            <q-icon
              name="info"
              color="info"
            />
          </template>
          <div class="row items-center justify-between">
            {{$t('consult.noConsultItem')}}
            <q-btn
              v-if="$myinfo.auth.role.isSystemAdministrator || $myinfo.auth.role.isConsultAdministrator"
              outline
              rounded
              :label="$t('consult.item.addType')"
              color="primary"
              @click="showItemType=true"
            />
          </div>
        </q-banner>
      </div>
      <q-virtual-scroll
        v-else
        :items="itemsList"
      >
        <template v-slot="{ item}">
          <q-list :key="item.id">
            <a-type-items :consultItems="item" />
          </q-list>
        </template>
      </q-virtual-scroll>
      <item-list-menu
        v-if="!$q.platform.is.mobile&&selectOptions.length"
        class="q-pt-md q-ml-md"
        :dense="false"
        :flat="false"
        :showConsultAdministrator="!!consultRolePsonIds.length"
        @chat="chat"
        @itemType="showItemType=true"
      />
    </q-card-section>
    <q-dialog
      v-model="showItemType"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      :maximized="$q.screen.lt.sm"
    >
      <options-edit
        :select-options="itemTypes"
        :module="module"
        :field="field"
        :keys="keys"
        @close="showItemType=false"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ItemList',
  data () {
    return {
      showItemType: false,
      keys: ['type'],
      module: 'consult',
      field: 'itemType'
    }
  },
  computed: {
    ...mapState('consult', ['consultItemSearch']),
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('consult', ['consultItems']),
    search: {
      get () {
        return this.consultItemSearch
      },
      set (value) {
        this.setConsultItemSearch(value)
      }
    },
    selectOptions () {
      return this.dictionary[this.module] ? this.dictionary[this.module][this.field] : []
    },
    itemTypes () {
      return _.orderBy(this.selectOptions, ['orderNumber'], ['asc'])
    },
    itemsList () {
      let itemTypes = _.cloneDeep(this.itemTypes), items = _.cloneDeep(this.consultItems), itemsList = []
      _.forEach(itemTypes, m => {
        itemsList.push(Object.assign({}, {
          id: m.id,
          type: m.dictValue,
          items: items.filter(n => { return m.dictValue === n.type })
        }))
      })
      return itemsList
    },
    consultRolePson () {
      return this.$store.getters['person/selectPersonsOfRoleCode']('ConsultAdministrator')
    },
    consultRolePsonIds () {
      return _.filter(this.consultRolePson, f => f.isInService).map(n => n.id)
    }
  },
  mounted () {
    this.loadConsultItems()
    this.loadDictionarys(this.module)
  },
  methods: {
    ...mapActions('consult', ['loadConsultItems']),
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapMutations('consult', ['setConsultItemSearch']),
    chat () {
      // 打开与咨询管理员的聊天窗口。如果有多个则随机显示
      let psonId = 0
      if (this.consultRolePsonIds.length > 1) {
        let random = _.random(0, this.consultRolePsonIds.length - 1)
        psonId = this.consultRolePsonIds[random]
      } else {
        psonId = this.consultRolePsonIds[0]
      }
      psonId && this.$router.push({
        name: 'chat',
        params: { category: 'person', objectID: psonId }
      })
    }
  },
  components: {
    ATypeItems: () => import('components/consult/item/ATypeItems'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    OptionsEdit: () => import('components/base/select-edit/OptionsEdit'),
    TwSearchSort: () => import('components/base/TwSearchSort'),
    ItemListMenu: () => import('components/consult/item/ItemListMenu')
  }
}
</script>

<style lang="scss" scoped>
</style>
