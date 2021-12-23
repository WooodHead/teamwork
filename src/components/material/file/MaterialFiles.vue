<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 标题菜单 -->
    <tw-header-card :title="$t('material.allFiles')"></tw-header-card>
    <!-- 文件列表 -->
    <q-infinite-scroll
      @load="loadData"
      :offset="250"
      :class="['q-mb-lg row q-gutter-md q-px-xxl justify-center', $q.screen.lt.sm?'q-pa-xs q-gutter-sm':'q-pa-sm q-gutter-md']"
      style="overflow: auto;padding-bottom:2px"
      ref="infiniteScroll"
    >
      <!-- 加载中logo -->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
      <div
        v-for=" file in fileList"
        :key="file.PathName"
        :model="file"
        class="span-stype handle"
      >
        <file-card :model="file.FileInfo" />
      </div>
      <!-- 初始化更新后-->
      <template v-if="fileList.length==0">
        <tw-banner-no-result />
      </template>
    </q-infinite-scroll>
  </q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'MaterialFiles',
  props: {

  },
  data () {
    return {
      search: '',
      fileList: []
    }
  },
  computed: {
    ...mapGetters('chat', ['filesMessagesResource']),
    ...mapState('material', ['Files'])
  },
  methods: {
    ...mapActions('material', ['loadMatMainData']),
    // 加载列表数据
    loadData (index, done) {
      let count = this.$store.state.material.filesPage.nextPageToken
      if (count === -1) {
        done(true)
        return
      }
      let orgPath = LocalStorage.getItem('myself').organizeNum + '%'
      let condition = [{ Key: 'IsDelete', Value: 0, Oper: 'eq' }]
      condition.push('and', { Key: 'OrganizePath', Value: orgPath, Oper: 'like' })
      this.loadMatMainData({
        loderType: 'file',
        query: condition,
        limit: this.$store.state.material.filesPage.limit,
        offset: this.$store.state.material.filesPage.offset,
        byPage: true
      }).then(res => {
        if (count === -1) {
          done(true)
        } else {
          done()
        }
      })
    },
    searchUpdate (val) {
      if (val) {
        this.fileList = _.filter(this.Files, el => (el.FileInfo.Title && el.FileInfo.Title.includes(val)))
      } else {
        this.fileList = this.Files
      }
    }
  },
  mounted () {

  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    FileCard: () => import('components/material/file/FileCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  watch: {
    search: {
      immediate: true,
      handler (newVal, oldVal) {
        this.searchUpdate(newVal)
      }
    }
  }
}
</script>
