<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 头部区域 -->
    <tw-header-card
      title="归档区"
      :actions="['select']"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
    >
    </tw-header-card>
    <div class="q-px-xxl">
      <q-infinite-scroll
        @load="onLoadArchiveData"
        :offset="250"
        class="q-gutter-y-lg q-mb-lg q-pa-sm row q-gutter-md justify-center"
      >
        <template v-for="item in archiveList">
          <folder-card
            v-if="item.classify==='folder'"
            :folder="item"
            :key="item.id"
            class="q-mr-md span-stype handle"
          ></folder-card>

          <file-card
            :key="item.id"
            v-else
            :file="item"
            class="span-stype handle"
          >
          </file-card>
        </template>
        <template
          v-slot:loading
          v-if="showLoading"
        >
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ArchivedDocuments',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      options: [
        {
          label: this.$t('document.sortBy.UnSorted'),
          value: 'IsPublish asc,OrderNumber'
        },
        {
          label: this.$t('document.sortBy.Title'),
          value: 'Title'
        },
        {
          label: this.$t('document.sortBy.DueDate'),
          value: 'ModifyTime'
        }
      ]
    }
  },
  mounted () {
    const cardNum = this.archiveList.length
    const left = this.page.offset
    const right = +this.page.offset + this.page.limit
    if (!(cardNum > left && cardNum < right)) { // 需重置offset
      this.updatePage({
        offset: parseInt(cardNum / this.page.limit) * this.page.limit,
        limit: 20,
        nextPageToken: 0
      })
    }
    this.loadArchiveList(this.id)
  },
  computed: {
    ...mapState('document', ['documentList', 'page', 'sort', 'search']),
    archiveDocument () {
      return _.find(this.documentList, { 'id': +this.id }) || {}
    },
    archiveList () {
      let archiveList = _.filter(this.documentList, { 'parentId': +this.id, 'archived': true })
      if (this.sort === 'ModifyTime') {
        return _.orderBy(archiveList, ['modifyTime'], ['desc'])
      } else {
        return archiveList.sort((a, b) => {
          return b['title'].localeCompare(a['title'])
        })
      }
    },
    showLoading () {
      const pagePayload = this.page
      return !(pagePayload.nextPageToken === -1)
    }
  },
  methods: {
    ...mapMutations('document', ['setSortAndOrder', 'setSearch', 'updatePage', 'emptyDocuments']),
    ...mapActions('document', ['loadArchiveList']),
    sortUpdate (value) {
      this.setSortAndOrder(value)
    },
    // searchUpdate (value) {
    //   this.resetState()
    //   this.setSearch({ id: +this.id, value: value })
    //   this.loadArchiveList(+this.id)
    // },
    resetState () {
      this.emptyDocuments(+this.id)
      this.updatePage({
        offset: 0,
        limit: 20,
        nextPageToken: 0
      })
    },
    onLoadArchiveData (index, done) {
      if (index !== 1) {
        const that = this
        this.loadArchiveList(+this.id)
          .then(res => {
            const pagePayload = that.page
            if (pagePayload.nextPageToken === -1) {
              done(true)
            } else {
              done()
            }
          })
      } else {
        done()
      }
    }
  },
  components: {
    FolderCard: () => import('components/document/folder/FolderCard'),
    FileCard: () => import('components/document/DocumentCard'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
  .card-grow-in-page {
    max-width: 90vw;
  }
  @media (max-width: $breakpoint-xs-max) {
    .card-grow-in-page {
      min-width: 100%;
    }
  }
  @media (max-width: $breakpoint-xs-max) {
    .span-stype {
      width: 43% !important;
    }
  }
</style>
