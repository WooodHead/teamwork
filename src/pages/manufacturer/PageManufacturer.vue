<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card
        :title="$t('manufacturer.title')"
        :actions="['add', 'select', 'menu']"
        :add="{
          label: $t('manufacturer.add'),
          click: addingEvent
        }"
        :select="sort"
        :selectOptions="options"
        @update:select="sortUpdate"
      >
        <template #menu>
          <resource-list-style category="manufacturer" />
        </template>
      </tw-header-card>

      <!-- 列表，key用来刷新resource-grid -->
      <resource-grid
        category='manufacturer'
        class="q-px-xxl"
        :key="$route.name"
        :selectCondition="currentCondition"
        ref="resourceGrid"
      />
      <tw-page-scroller />
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'PageManufacturer',
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    ResourceListStyle: () => import('components/resource/ResourceListStyle'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  data () {
    return {
      options: [
        { label: '名称', value: 'CONVERT(OrganizeName USING gbk)' },
        { label: '类型', value: 'Classify' },
        { label: '等级', value: 'Level' }
      ]
    }
  },

  watch: {
    sort () {
      this.resetState()
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapState('manufacturer', ['sort', 'listPageType', 'listStyle']),
    ...mapGetters('manufacturer', ['currentCondition']),
    queryList: {
      get () {
        let levelList = this.dictionary['manufacturer'] ? this.dictionary['manufacturer']['manufacturerLevel'] : []
        let _queryList = this.$store.getters[`manufacturer/queryList`]
        let valueArr = []
        levelList && _.forEach(levelList, element => {
          valueArr.push({ label: element.dictValue, value: element.dictValue, name: 'level' })
        })
        !_.isEmpty(levelList) && _queryList.push({ label: '单位等级', value: [...valueArr] })
        return _queryList
      }
    }
  },
  created () {
    this.loadDictionarys('manufacturer')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapMutations('manufacturer', ['setPage', 'updatePage', 'setSort', 'setListStyle', 'emptyManufacturers']),
    addingEvent () {
      this.$router.push({ name: 'manufacturerEdit', params: { openType: 'add' } })
    },
    sortUpdate (value) {
      this.setSort(value)
    },
    resetState () {
      this.emptyManufacturers()
      this.setPage({
        offset: 0,
        limit: 20,
        nextPageToken: 0
      })
      let that = this
      setTimeout(() => {
        that.$refs.resourceGrid.$refs.infiniteScroll.resume()
      }, 100)
    }
  }
}
</script>

<style lang='scss' scoped>
  .my-status-card {
    min-width: 9vw;
  }
</style>
