<template>
  <q-card
    class="cursor-pointer text-center widget-card"
    style="overflow:hidden"
    :class="folder.color"
  >
    <div class="widget-card-section">
      <!-- 头部区域 -->
      <!-- 左边 -->
      <a
        v-if="!folder.isPublish"
        class="card-header-left"
        title="当前案例库还未发布"
        @click="showCardDetail"
      ></a>
      <!-- 右边 -->
      <folder-menu
        v-if="folder.authorID===$myinfo.id||$myinfo.auth.role.isSystemAdministrator"
        flat
        class="card-header-right"
        :model="folder"
        :excludeButton="['move', 'copy', 'archive','secrecy','bookmark']"
        size="lg"
        style="margin-top:-5px"
      />

      <!-- 内容区 -->
      <div
        @click="showCardDetail"
        :style="$q.platform.is.desktop?'padding-top: 2px;':''"
      >
        <q-card-section
          class="q-pt-md q-pb-sm"
          :style="$q.platform.is.mobile?'margin: 0.6em 0em 0em;':'margin: 1em 0em 0em;'"
        >
          <q-img
            clickable
            :src="getUrl(folder.snapshotPath)"
            :ratio="4/3"
            class="rounded-borders"
          />
        </q-card-section>
        <q-separator inset />
        <!-- 标题区 -->
        <q-card-section
          :class="['q-pb-none ',$q.screen.lt.sm?'q-pt-xs':'q-pt-sm']"
          class="ellipsis-2-lines"
        >
          <div
            style="overflow: inherit;"
            class="text-subtitle2 ellipsis-3-lines"
            :title="folder.title"
          >
            {{folder.title}}
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
import { getUrl } from '@/boot/file'
export default {
  name: 'ProductCaseCard',
  props: {
    folder: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('file', ['imgExts']),
    ...mapState('document', ['sort']),
    children () {
      const data = _.filter(this.folder.children, item => { return item.isPublish })
      return _.orderBy(data, [_.camelCase(this.sort)], ['desc'])
    }
  },
  filters: {
    filterModifyTime (value) {
      return date.formatDate(value, 'MM/DD HH:mm')
    }
  },
  methods: {
    getUrl,
    showCardDetail () {
      // 是否是文档中心
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      const isProductCaseHome = this.$route.name === 'productCaseHome'
      // 是否是案例库详情页
      let params = { category: this.folder.objectType, objectID: this.folder.objectID, id: this.folder.id }
      let name = 'folder'
      if (inDocumentCenter) {
        params = { id: this.folder.id }
      } else if (isProductCaseHome) {
        name = 'productCaseDetail'
        params = { id: this.folder.id }
      }
      this.$router.push({ name, params })
    }
  },
  components: {
    FolderMenu: () => import('components/document/folder/FolderMenu')
  }
}
</script>

<style lang="scss" scoped>
.widget-card {
  background-size: cover;
  width: 100%;
}
.widget-card:before {
  content: "";
  display: block;
  padding-top: 128% !important;
}
@media (min-width: $breakpoint-xs-max) {
  .widget-card {
    width: 11rem !important;
    display: block;
  }
}
.card-header-right {
  // background-image: url(/icons/match-color.svg);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1rem;
  display: block;
  position: absolute;
  height: 1rem;
  width: 1rem;
  border: 0;
  padding: 0;
  // opacity: 0.33;
  opacity: 1;
  // top: 0.1rem;
  right: 1.8rem;
  transform: scale(0.7);
  z-index: 1;
}
.card-header-left {
  background-image: url(/icons/product-case/查看权限-隐藏.png);
  /* background-position: center center; */
  background-repeat: no-repeat;
  background-size: 1.7rem;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  left: 1rem;
  top: 2rem;
  z-index: 1;
}
@media (max-width: $breakpoint-xs-max) {
  .card-header-left {
    top: 1.5rem !important;
  }
}

/deep/.q-card > div {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: none;
}
/deep/.o-image-view .q-avatar {
  font-size: 30px !important;
}
/deep/.o-image-view .q-item__section--side {
  padding-right: 0px !important;
}
/deep/.o-image-view .q-item__section--avatar {
  min-width: 40px !important;
}
/deep/.o-image-view {
  white-space: initial !important;
}
</style>
