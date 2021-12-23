<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题菜单 -->
    <tw-header-card :title="$t('chat.files')"></tw-header-card>
    <!-- 文件列表 -->
    <q-card-section>
      <q-infinite-scroll
        ref="infiniteScroll"
        @load="loadData"
      >
        <div class="row justify-evenly">
          <file-card  
            class="q-my-sm"
            v-for=" file in files" 
            :key="file.id" 
            :model="file" 
          />
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots
              color="primary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
      <tw-banner-no-result v-if="files.length==0" />
    </q-card-section>
  </q-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ChatFiles',
  props: {
    category: {
      type: String,
      default: undefined,
      required: false
    },
    objectID: {
      type: [String, Number],
      default: '0',
      required: false
    }
  },
  methods: {
    ...mapActions('chat', ['loadFilesMessages']),
    // 加载列表数据
    loadData (index, done) {
      this.loadFilesMessages({
        msgToId: Number(this.objectID),
        roomType: this.category
      }).then(res => {
        let filesMessageNextPageToken = this.$store.state.chat.filesPage.nextPageToken
        if (filesMessageNextPageToken === -1) {
          done(true)
        } else {
          done()
        }
      })
    }
  },
  computed: {
    ...mapGetters('chat', ['filesMessagesResource']),
    files: {
      get () {
        return this.filesMessagesResource(Number(this.objectID), this.category)
      }
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    FileCard: () => import('components/chat/FileCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style lang="scss">
</style>
