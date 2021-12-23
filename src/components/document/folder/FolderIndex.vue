<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
    :style="haveLeftTree?'width: 100% !important;':''"
  >
    <!-- 头部区域 -->
    <tw-header-card
      :title="title"
      :actions="actions"
      :select="sort"
      :selectOptions="options"
      @update:select="sortUpdate"
    >
      <template v-slot:right>
        <q-select
          :value="sort"
          @input="sortUpdate"
          :options="options"
          dense
          emit-value
          map-options
          options-dense
          outlined
          rounded
        >
        </q-select>
        <q-btn-group
          rounded
          outline
          class="q-ml-sm"
        >
          <q-btn
            v-for="(view,index) in viewType"
            :key="view.value"
            outline
            :title="view.title"
            @click="setListType(view.value)"
            color="grey-5"
            :class="{'q-pl-sm':index===0,'q-pr-sm':index===viewType.length-1}"
          >
            <q-icon
              :name="view.icon"
              :color="listType===view.value?'primary':''"
            />
          </q-btn>
        </q-btn-group>
      </template>
      <template
        v-slot:add
        v-if="actions.includes('add')"
      >
        <folder-add-menu
          :category="category"
          :objectID="objectID"
          :id="id"
        />
      </template>
      <template v-slot:menu>
        <folder-menu
          :model="model"
          :category="category"
          :objectID="objectID"
        ></folder-menu>
      </template>
    </tw-header-card>
    <!-- 思维导图形式 -->
    <folder-mind-map
      v-if="listType==='mindMap'"
      :category="category"
      :objectID="objectID"
      :id="id"
    ></folder-mind-map>
    <!-- 列表和表格形式 -->
    <folder-content
      v-else
      :class="{'q-px-xxl':$q.platform.is.desktop}"
      :category="category"
      :objectID="objectID"
      :id="id"
      ref="folderContent"
    />

  </q-card>
</template>
<script>
import getCategory from '@/mixins/mixins-get-category'
import folderIndex from '@/components/wiki/mixins-folder-index'
export default {
  name: 'FolderIndex',
  mixins: [getCategory, folderIndex],
  props: {
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
    }
  },
  computed: {
    model () {
      if (this.category && this.objectID && this.id === 0) {
        return this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    },
    haveLeftTree () {
      // 1、PC端从文档中心、知识库中进入有左侧树结构
      // 2、从各个资源模块进入文档中心无左侧树结构
      return !this.$q.platform.is.mobile && (!(this.category && this.objectID && this.category !== 'wiki') || (this.$route.name === 'documentCenter'))
    },
    title () {
      if (this.$route.name.includes('Archive')) {
        return this.$t('archive.area')
      } else {
        return this.model.title || this.$t('document.title')
      }
    },
    actions () {
      if (!this.showEditMenu) {
        return ['search', 'select']
      }
      let actionList = ['search', 'select', 'add']
      if (this.$route.name !== 'document' &&
        !(this.model.parentId === 0 && this.model.objectType !== 'document') &&
        !(this.model.level === 1 && this.model.objectType !== 'document') &&
        !(this.model.level === 2 && this.model.objectType === 'wiki' && !(this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isWikiAdministrator)) && // 知识空间
        !(this.model.id === 0 && this.model.title === '文档中心')) {
        actionList.push('menu')
      }
      // 只有知识空间成员有编辑权限
      if ((this.category === 'wiki' && !this.$store.getters['wiki/editWikiAuth'](+this.objectID)) ||
        (this.model.objectType === 'wiki' && this.model.level === 1 && this.model.parentId === 0)) {
        _.pull(actionList, 'add', 'menu')
      }
      this.category === 'wiki' && this.$store.getters['wiki/editWikiAuth'](+this.objectID)
      if (this.model.onlyICanEdit && !(this.model.authorID === +this.$myinfo.id || this.$myinfo.auth.role.isSystemAdministrator)) {
        _.pull(actionList, 'add', 'menu')
      }

      this.model.objectType === 'productCase' && _.pull(actionList, 'add')
      if (this.$route.name !== 'document' && this.model.id < 0) {
        return ['search', 'select']
      } else {
        return actionList
      }
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    FolderMenu: () => import('components/document/folder/FolderMenu'),
    FolderContent: () => import('components/document/folder/FolderContent'),
    FolderAddMenu: () => import('components/document/folder/FolderAddMenu'),
    FolderMindMap: () => import('components/document/folder/FolderMindMap')
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .q-btn-group .q-btn__wrapper {
    padding: 4px 4px;
  }
</style>
