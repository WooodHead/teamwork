<template>
  <div class="bg-white row q-col-gutter-sm full-width">
    <contacts-menu
      @initOnLoad="initOnLoad"
      @organizeEdit="organizeEdit"
    ></contacts-menu>
    <div
      v-if="isShow"
      class="col scroll"
    >
      <organize-edit
        :id="id"
        :openType="openType"
        :isShow="isShow"
        :node="node"
        @organizeShow="organizeShow"
      />
    </div>
    <div
      v-else
      class="col scroll"
    >
      <tw-search-sort
        :search.sync="search"
        :sort.sync="sort"
        :options="sortOptions"
        :searchTip="$t(`contacts.placeholder.person`)"
      >
        <template v-slot:append>
          <q-select
            dense
            outlined
            emit-value
            map-options
            options-dense
            :options="isInServiceOptions"
            v-model="isInService"
            :label="$t('person.leaveOfficeOrOnJob')"
          />
        </template>
      </tw-search-sort>
      <q-infinite-scroll
        class="scroll"
        ref="qInfiniteScroll"
        :offset="250"
        :style="`height:${$q.screen.height-106}px;`"
        @load="onLoad"
      >
        <div class="row justify-evenly">
          <person-card
            class="q-my-sm"
            v-for="person in persons"
            :key="person.id"
            :id="person.id"
          ></person-card>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-py-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { format } from 'quasar' // 格式化工具
const { capitalize } = format // 字符串首字母大写
export default {
  name: 'ContactsDesktop',
  data () {
    return {
      id: 0,
      openType: '',
      isShow: false,
      node: {
        organizeAddress: {
          type: 'none', // 三个值可选，none、cityname、poi
          value: '' // 与type关联，type=none是''，type=cityname是城市名，type=poi是地点对象
        }
      }
    }
  },
  computed: {
    ...mapGetters('contacts', ['selected', 'treed']),
    ...mapState('person', ['sortOptions', 'isInServiceOptions']),
    persons: {
      get () {
        return this.$store.getters[`person/filterPersonsByContactsAcl`](this.$store.getters[`person/personsOf${capitalize(this.selected.name)}`](this.treed.id))
      }
    },
    treedId: {
      get () {
        return this.$store.state.person[`${this.selected.name}Id`]
      },
      set (value) {
        this.$store.commit(`person/set${capitalize(this.selected.name)}Id`, value)
      }
    },
    sort: {
      get () {
        return this.$store.state.person.sort
      },
      set (value) {
        this.setSort(value)
        this.initOnLoad()
      }
    },
    search: {
      get () {
        return this.$store.state.person.search
      },
      set (value) {
        this.setSearch(value)
        this.initOnLoad()
      }
    },
    isInService: {
      get () {
        return this.$store.state.person.isInService
      },
      set (value) {
        this.setIsInService(value)
        this.initOnLoad()
      }
    }
  },
  methods: {
    ...mapActions('contacts', ['updateTreed']),
    ...mapActions('person', ['loadPersons']),
    ...mapMutations('person', ['setSort', 'setSearch', 'setIsInService', 'initPage']),
    onLoad (index, done) {
      if (index === 1) {
        // 设置当前选中的ID
        this.treedId = this.treed.id
        // 重置分页参数
        this.initPage()
      }
      // 获取用户列表信息
      this.loadPersons({ byPage: true, moduleName: this.selected.name }).then(() => {
        if (this.$store.state.person.page.nextPageToken > -1) {
          done()
        } else {
          done(true)
        }
      })
    },
    initOnLoad () {
      // 重新调用onLoad的方法
      this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
      this.$refs.qInfiniteScroll.resume() // 重新开启加载
      this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
    },
    organizeEdit (val, type) {
      this.node = val
      this.id = val.id
      this.openType = type
      this.isShow = true
    },
    organizeShow (show) {
      this.isShow = show
    }
  },
  components: {
    ContactsMenu: () => import('components/contacts/ContactsMenu'),
    OrganizeEdit: () => import('components/organize/OrganizeEdit'),
    TwSearchSort: () => import('components/base/TwSearchSort'),
    PersonCard: () => import('components/person/PersonCard')
  }
}
</script>

<style scoped lang="scss">
</style>
