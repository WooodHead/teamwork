<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="$t('team.module')"
        :actions="['add', 'select','menu']"
        :select="sort"
        :selectOptions="options"
        @update:select="sortUpdate"
      >
        <template v-slot:add>
          <add-btn-with-template
            category="team"
            @addingEvent="addingEvent"
          />
        </template>
        <template #menu>
          <resource-list-style category="team" />
        </template>
      </tw-header-card>

      <!-- 列表，key用来刷新resource-grid -->
      <resource-grid
        v-if="onLoadResource"
        needTemplate
        category='team'
        :class="listStyle==='showtable'?'q-px-lg':($q.screen.gt.xs?'q-px-xl':'q-px-md')"
        :key="$route.name"
        :selectCondition="selectCondition"
        ref="resourceGrid"
      />

      <!-- 归档文档说明区 -->
      <q-card-section v-if="archivedCount">
        <tw-archived-count
          :label="$t('archive.someArchived',{count:archivedCount,something:$t('team.title')})"
          @click="showArchiveList()"
        />
      </q-card-section>

    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'PageTeam',
  data () {
    return {
      onLoadResource: false, // 防止加载异步
      options: [
        {
          label: this.$t('team.sortBy.myFocus'),
          value: 'myFocus'
        },
        {
          label: this.$t('team.sortBy.type'),
          value: 'CONVERT(Type USING gbk)'
        },
        {
          label: this.$t('team.sortBy.title'),
          value: 'CONVERT(Title USING gbk)'
        },
        {
          label: this.$t('team.sortBy.organizeName'),
          value: 'OrganizeID'
        }
      ]
    }
  },

  watch: {
    sort () {
      this.resetState()
    }
  },
  computed: {
    ...mapState('team', ['sort', 'archivedCount', 'listStyle']),
    ...mapGetters('team', ['selectCondition'])
  },
  mounted () {
    this.onLoadResource = true
    // 初始化团队类型、创建时间
  },
  methods: {
    ...mapMutations('team', ['setPage', 'setSort', 'setQuery', 'setSearch', 'setListStyle', 'emptyTeams']),
    ...mapActions('team', ['existMyTeam', 'loadArchivedCount']),
    addingEvent () {
      this.$router.push({
        name: 'teamAdd'
      })
    },
    showArchiveList () {
      this.$router.push({
        name: 'archivedTeams'
      })
    },

    sortUpdate (value) {
      this.setSort(value)
    },

    resetState () {
      this.emptyTeams()
      this.setPage({
        offset: 0,
        limit: 20,
        nextPageToken: 0
      })
      let that = this
      setTimeout(() => {
        that.$refs.resourceGrid.$refs.infiniteScroll.resume()
      }, 100)
    },
    resetSearchState () {
      this.setSearch('')
      this.setQuery([])
    }

  },

  components: {
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    AddBtnWithTemplate: () => import('components/template/AddBtnWithTemplate')
  }
}
</script>

<style lang="scss" scoped>
.my-status-card {
  min-width: 9vw;
}
</style>
