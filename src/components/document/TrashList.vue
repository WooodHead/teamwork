<template>
<q-card
  :flat="$q.screen.lt.sm"
  class="card-grow-in-page"
>
  <tw-header-card :title="$t('trash.title')"></tw-header-card>
  <div class="full-width column items-center">
    <!-- 加载中 -->
    <div class="row justify-center q-my-md" v-if="isLoading">
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <div class="full-width q-pa-md" v-else>
      <!-- 有数据 -->
      <div class="flex flex-wrap flex-center" v-if="documentsInTrash&&documentsInTrash.length">
        <div
          v-for="(item, index) in documentsInTrash"
          :key="index"
          class="q-pa-sm trash-card"
        >
          <trash-card :model="item"></trash-card>
        </div>
      </div>
      <!-- 没有数据 -->
      <folder-no v-else :content="$t('trash.none')"></folder-no>
    </div>
  </div>
</q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TrashList',
  props: {
    category: {
      type: String,
      default: '',
      required: true,
      description: '类型：project、team、product、wiki'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '类型ID'
    }
  },
  data () {
    return {
      person: LocalStorage.getItem('myself'),
      isLoading: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('document', ['loadDocumentsInWikiTrash']),
    init () {
      this.loadDocumentsInWikiTrash({
        objectType: this.category,
        objectID: +this.objectID
      }).then(res => {
        this.isLoading = false
      })
    }
  },
  computed: {
    ...mapGetters('document', ['DocumentsInWikiTrash']),
    documentsInTrash () {
      return this.DocumentsInWikiTrash(this.category, this.objectID)
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    FolderNo: () => import('components/document/folder/FolderNo'),
    TrashCard: () => import('components/trash/TrashCard')
  }
}
</script>

<style lang="scss" scoped>
.trash-card {
  width: 24%;
  max-width: 220px;
  overflow: hidden;
}
@media screen and (max-width: 1024px) {
  .trash-card {
    width: 45%;
  }
}
</style>
