<!--
@Name：知识库首页
@Author：陆欢
@date：2021/12/07
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 头部区域 -->
    <tw-header-card
      :title="$t('wiki.title')"
      :actions="actions"
      :select="sort"
      :add="addAction"
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
    </tw-header-card>
    <!-- 列表和表格形式 -->
    <wiki-space-content
      :id="id"
      :class="{'q-px-xxl':$q.platform.is.desktop}"
    ></wiki-space-content>

  </q-card>
</template>
<script>
import { mapActions } from 'vuex'
import folderIndex from '@/components/wiki/mixins-folder-index'
export default {
  name: 'WikiIndex',
  mixins: [folderIndex],
  data () {
    return {
      id: 0,
      addAction: {
        label: this.$t('wiki.action.add'),
        click: () => { this.addWikiSpace() }
      }
    }
  },
  mounted () {
    // 获取知识库文件夹ID
    let query = [
      { Key: 'ObjectType', Value: 'wiki', Oper: 'eq' },
      'and',
      { Key: 'Level', Value: 1, Oper: 'eq' },
      'and',
      { Key: 'ParentID', Value: 0, Oper: 'eq' }]
    this.loadDocumentByQuery({
      frontQuery: (m) => { return m.objectType === 'wiki' && m.level === 1 && m.ParentID === 0 },
      endQuery: query,
      onlyGetData: true
    }).then(res => {
      this.id = res.id
    })
  },
  computed: {
    actions () {
      let a = ['select']
      // 仅系统管理员和知识库管理员有权限新建知识空间
      if (this.$myinfo.auth.role.isSystemAdministrator || this.$myinfo.auth.role.isWikiAdministrator) {
        a.push('add')
      }
      return a
    }
  },
  methods: {
    ...mapActions('document', ['loadDocumentByQuery']),
    addWikiSpace () {
      this.$router.push({ name: 'wikiAdd' })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    WikiSpaceContent: () => import('components/wiki/WikiSpaceContent')
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .q-btn-group .q-btn__wrapper {
    padding: 4px 4px;
  }
</style>
