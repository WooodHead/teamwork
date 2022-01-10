<!--
@Name：文件夹列表
@Author：陆欢
@date：2021/05/24
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div class="full-width">
    <q-table
      :bordered="border"
      flat
      :data="list"
      :columns="columns"
      :row-key="rowKey"
      @row-click="rowClick"
      :pagination.sync="pagination"
      @request="onRequest"
      binary-state-sort
      no-data-label="I didn't find anything for you"
      hide-bottom
      text-grey-8
    >
      <template v-slot:top-left>
        <slot name="table-top-left"></slot>
      </template>
      <template v-slot:top-right>
        <slot name="table-top-right"></slot>
      </template>
      <template v-slot:bottom-row>
        <slot name="table-bottom-row"></slot>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold text-subtitle2 table-header"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          <img
            v-if="showImgDetail(props.row)"
            :src="getUrl(props.row.filePath)"
          />
          <q-icon
            v-else
            :style="
              props.row.classify === 'folder'
                ? 'color:#ffc107'
                : 'color:#bbc4ca'
            "
            :name="
              props.row.classify === 'folder'
                ? 'app:tw-icon-folder'
                : 'app:tw-icon-file'
            "
          />
          <span class="q-ml-md" :title="props.value">{{ props.value }}</span>
          <span v-if="['file', 'link'].includes(props.row.classify)">{{
            `${props.row.extension || props.row.classify}`
          }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-size="props">
        <q-td :props="props">
          <span v-if="props.row.classify === 'folder'"> - </span>
          <span v-else> {{ props.value }}</span>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { date } from 'quasar'
import { mapState, mapMutations } from 'vuex'
import showCardDetail from '@/components/document/folder/mixins-file-click.js'
import { getUrl } from '@/boot/file'
export default {
  name: 'FolderTable',
  mixins: [showCardDetail],
  props: {
    list: { type: Array, default: () => [] },
    border: {
      type: Boolean,
      default: false
    },
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
          classes: '',
          style: 'font-size: 14px',
          headerClasses: 'text-grey-8',
          label: '文件名',
          field: 'title',
          align: 'left',
          sortable: true,
          sort: (a, b) => a.localeCompare(b)
        },
        {
          name: 'authorName',
          classes: '',
          style: 'font-size: 14px',
          headerClasses: 'text-grey-8',
          label: '创建者',
          field: 'authorName',
          align: 'left',
          sortable: true,
          sort: (a, b) => a.localeCompare(b)
        },
        {
          name: 'modifyTime',
          classes: '',
          style: 'font-size: 14px',
          headerClasses: 'text-grey-8',
          label: '最近更新',
          field: 'modifyTime',
          align: 'left',
          sortable: true,
          format: (val, row) => date.formatDate(val, 'YYYY-MM-DD')
        },
        {
          name: 'size',
          classes: '',
          style: 'font-size: 14px',
          headerClasses: 'text-grey-8',
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
    ...mapState('document', ['emptyFolder']),
    ...mapState('file', ['imgExts', 'threeDExts', 'videoExts'])
  },
  methods: {
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
    rowClick (evt, row, index) {
      if (row.classify === 'folder') {
        this.showFolderDetail(row.objectType, row.objectID, row.id)
      } else {
        this.fileDetail(row.objectType, row.objectID, row.id, row.classify)
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
.q-table th {
  font-size: 14px !important;
}
 img {
   width: 48px !important;
    height: 30px;
    object-fit: cover;
    vertical-align: middle;
}
// /deep/ .attach-icon >div{
//       display: contents;
// }
</style>
