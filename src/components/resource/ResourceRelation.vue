<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pb-md"
  >
    <!-- 标题 -->
    <tw-header-card
      :title="title"
      :actions="['add','menu']"
      :add="{label:$t(`${relates}.relate`),click:addingEvent}"
    >
      <template #menu>
        <resource-list-style :category="relates" />
      </template>
    </tw-header-card>
    <!-- 列表，key用来刷新resource-grid -->
    <resource-grid
      v-if="relatedIds !== null"
      :category="relates"
      :class="listStyle==='showtable'?'q-px-lg':'q-px-xxl'"
      :relatedResource="relatedResource"
      :key="$route.name+relatedIds.join('')"
    />
    <!-- 资源选择弹窗 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <resource-select-panel
        :objectID="objectID"
        :category="relates"
        :normalCategory="category"
        flat
        multiple
        :initSelectedResourceIDs="relatedIds"
        @multiSelect="multiSelect"
        style="width: 600px; max-width: 90vw;"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { format } from 'quasar'
import { mapState, mapGetters, mapActions } from 'vuex'
const { capitalize } = format
export default {
  name: 'ResourceRelation',
  props: {
    category: { type: String, required: true },
    objectID: { type: [String, Number], required: true },
    relates: { type: String, required: true }
  },
  data () {
    return {
      menus: this.$q.platform.is.mobile
        ? ['showcards', 'showlist']
        : ['showcards', 'showlist', 'showtable'],
      relatedTitle: '',
      showSelect: false
    }
  },
  computed: {
    ...mapState('resource', ['relationType']),
    ...mapGetters('resource', ['resourceRelations', 'disableResourceRelation', 'categoryRelations']),
    title () {
      return this.relatedTitle && `[${this.relatedTitle}] ${this.$t(`${this.relates}.relate`)}`
    },
    relatedIds () {
      let realtions = this.resourceRelations({ category1: this.category, id1: +this.objectID, category2: this.relates, type: this.relationType[this.category][this.relates] })
      return realtions && realtions.map(r => r.selectId)
    },
    relatedResource () {
      return this.categoryRelations({ category: this.relates, ids: this.relatedIds })
    },
    disableIds () {
      let relation = this.disableResourceRelation({ category: this.category, id: +this.objectID, type: this.relationType[this.category][this.relates] })
      return relation && relation.path.split(',').map(Number)
    },
    listStyle () {
      return this.$store.state[this.relates].listStyle
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('resource', ['addResourceRelations', 'deleteResourceRelations', 'loadResourceRelations']),
    init () {
      this.relates && this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, +this.objectID).then(m => {
        this.relatedTitle = m.title
      })
      this.loadResourceRelations({ category1: this.category, id1: +this.objectID, category2: this.relates, type: this.relationType[this.category][this.relates], fields: 'Select' })
    },
    addingEvent () {
      this.showSelect = true
    },
    multiSelect (selectedResources) {
      this.showSelect = false
      let relates = [], ids = selectedResources.map(r => r.id), resType = this.relationType[this.category][this.relates]
      _.map(ids, m => {
        relates.push(Object.assign({}, {
          category1: this.category,
          id1: +this.objectID,
          category2: this.relates,
          id2: m,
          type: resType || 'correlation',
          path: resType === 'inherit' ? (this.disableIds && this.disableIds.length ? _.concat(this.disableIds, m).join(',') : _.concat(+this.objectID, m).join(',')) : _.concat(+this.objectID, m).join(',')
        }))
      })
      // 更新关联关系
      if (selectedResources && selectedResources.length > 0) {
        this.addResourceRelations(relates)
        // 清空关联关系
      } else {
        this.relatedIds && this.relatedIds.length && this.deleteResourceRelations({ category1: this.category, objectId: +this.objectID, category2: this.relates, type: resType || 'correlation' })
      }
    }
  },
  components: {
    ResourceSelectPanel: () => import('components/resource/ResourceSelectPanel'),
    ResourceGrid: () => import('components/resource/ResourceGrid'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ResourceListStyle: () => import('components/resource/ResourceListStyle')
  }
}
</script>

<style lang="scss" scoped>
.my-status-card {
  min-width: 9vw;
}
</style>
