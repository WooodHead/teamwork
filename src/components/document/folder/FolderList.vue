<!--
@Name：文件列表视图
@Author：陆欢
@date：2021/11/30
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-list class="full-width">
    <template v-for="(item, index) of list">
      <q-item dense :key="item.id" @click.native="itemClick(item)">
        <q-item-section top avatar>
          <img v-if="showImgDetail(item)" :src="getUrl(item.filePath)" />
          <q-avatar v-else>
            <q-icon
              :style="
                item.classify === 'folder' ? 'color:#ffc107' : 'color:#bbc4ca'
              "
              :name="
                item.classify === 'folder'
                  ? 'app:tw-icon-folder'
                  : 'app:tw-icon-file'
              "
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="ellipsis">
            <span :title="item.title">{{ item.title }}</span>
            <span v-if="['file', 'link'].includes(item.classify)">{{
              `${item.extension || item.classify}`
            }}</span>
            <span class="text-italic" v-if="item.classify !== 'folder'"> {{` (${item.size}KB)`}} </span>
          </q-item-label>
          <q-item-label caption lines="2">
            {{item.authorName}} 创建于
            {{
              timeAgo({
                dateTime: item.createTime
                  ? item.createTime.replace(/-/g, "/")
                  : ""
              })
            }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-separator :key="`${item.id}-${index}`" spaced inset="item" />
    </template>
    <slot name="list"></slot>
  </q-list>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapMutations } from 'vuex'
import showCardDetail from '@/components/document/folder/mixins-file-click.js'
import timeAgo from '@/utils/time-ago'
import { getUrl } from '@/boot/file'
export default {
  name: 'FolderList',
  mixins: [showCardDetail],
  props: {
    list: { type: Array, default: () => [] },
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    }
  },
  data () {
    return {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20
      },
      rowKey: 'id',
      columns: [
        {
          name: 'title',
          classes: 'text-grey-8',
          label: '文件名',
          field: 'title',
          align: 'left',
          sortable: true,
          sort: (a, b) => a.localeCompare(b)
        },
        {
          name: 'authorName',
          classes: 'text-grey-8',
          label: '创建者',
          field: 'authorName',
          align: 'left',
          sortable: true,
          sort: (a, b) => a.localeCompare(b)
        },
        {
          name: 'modifyTime',
          classes: 'text-grey-8',
          label: '最近更新',
          field: 'modifyTime',
          align: 'left',
          sortable: true,
          format: (val, row) => date.formatDate(val, 'YYYY-MM-DD')
        },
        {
          name: 'size',
          classes: 'text-grey-8',
          label: '大小(KB)',
          field: 'size',
          align: 'left',
          sortable: true,
          sort: (a, b) => a > b
        }
      ]
    }
  },
  computed: {
    ...mapState('file', ['imgExts', 'threeDExts', 'videoExts'])
  },
  methods: {
    timeAgo,
    getUrl,
    ...mapMutations('document', ['setSort', 'setOrder']),
    showImgDetail (attach) {
      return (
        (attach.extension &&
          this.imgExts.includes(attach.extension.toLowerCase())) ||
        (attach.extension &&
          this.threeDExts.includes(attach.extension.toLowerCase()))
      )
    },
    onRequest (props) {
      const obj = {
        title: 'Title',
        authorName: 'AuthorName',
        modifyTime: 'ModifyTime',
        size: 'Size'
      }
      let sortName = props.pagination && props.pagination.sortBy
      if (sortName) {
        this.pagination.descending = !this.pagination.descending
        let sortOrder = this.pagination.descending ? 'desc' : 'asc'
        this.pagination.sortBy = sortName
        this.setOrder(sortOrder)
        this.setSort(obj[sortName])
      }
      this.$emit('restart')
    },
    itemClick (item) {
      if (item.classify === 'folder') {
        this.showFolderDetail(item.objectType, item.objectID, item.id)
      } else {
        this.fileDetail(item.objectType, item.objectID, item.id, item.classify)
      }
    }
  },
  components: {
    // 'attach-icon': () => import('components/attach/AttachIcon')
    // FolderAdd: () => import('components/document/folder/FolderAdd')
  }
}
</script>

<style scoped lang="scss">
img {
  width: 40px !important;
  height: 30px;
  object-fit: cover;
  vertical-align: middle;
}
</style>
