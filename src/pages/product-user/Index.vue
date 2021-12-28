<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <q-card
      v-if="inHome"
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <tw-header-card
        title="关联用户"
        :actions="actions"
        :add="{
          label: '关联用户',
          click: addEvent,
          disable:disableShowPublic
        }"
      >
      <template #right>
        <q-checkbox
          color="positive"
          label="全员公开" 
          v-model="isShowPublic"
          @input="showPublicEvent()"
        />
      </template>
      </tw-header-card>
      <q-card-section v-if="isShowPublic" class="q-pt-xl text-h5 text-center">
        <q-btn
          round
          :size="$q.screen.gt.xs?'64px':'32px'"
          color="primary"
          icon="local_library"
        /> 
        <q-item>
          <q-item-section class="q-pt-xl">
            <q-item-label>当前知识空间全员公开可见</q-item-label>
          </q-item-section> 
        </q-item>               
      </q-card-section>
      <q-card-section v-else class="q-pl-xl q-pt-md">       
        <q-list>
          <q-item v-for="person in allRelatedPersons"
          :key="person.id">
          <q-item-section avatar>
             <tw-avatar
                size="lg"
                :id="person.id"
                :img="person.img"
              />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{person.name}}</q-item-label>
            <q-item-label
              lines="1"
              caption
            >
              <span v-if="person.dutyName&&person.orgShortName">
                {{ person.dutyName?person.dutyName:''}} • {{ person.orgShortName?person.orgShortName:''}}
              </span>
              <span v-else>
                {{ person.dutyName?person.dutyName:''}} {{ person.orgShortName?person.orgShortName:''}}
              </span>
            </q-item-label>
          </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

    </q-card>
    <router-view></router-view>
    <tw-page-scroller />
    <q-dialog
      v-model="showSelectPerson"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        :isSelectByGroup="false"
        :isVirtualScroll="true"
        :multiple="true"
        :initSelectedPersonIDs="initSelectedPersonIDs"
        @multiSelect="selectPerson"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'Index',
  props: {
    category: {
      type: String,
      required: true,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  data () {
    return {
      showAddButton: true,
      showSelectPerson: false,
      selectedPersons: [],
      initSelectedPersonIDs: [],
      initSelectPersons: [],
      allRelatedPersons: [],
      showActionBtn: false,
      isShowPublic: false, // 是否全员公开
      wikiFolderId: 0,
      disableShowPublic: false // 是否显示【全员公开】
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    ...mapState('productUser', ['page']),
    inHome () {
      return this.$route.name === 'user'
    },
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID)
    },
    actions () {
      if (this.showAddButton) {
        return ['add']
      } else {
        return []
      }
    }
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapActions('document', ['updateDocumentField', 'loadDocumentByQuery']),
    ...mapActions('productUser', ['loadProductUsersByResource', 'addBatchProductUser', 'deleteBatchProductUser']),
    ...mapMutations('breadcrumbs', ['clearWidgetBreadcrumbs', 'clearModuleBreadcrumbs']),
    addEvent () {
      this.showSelectPerson = true
    },
    init () {
      if (this.category === 'wiki') {   
        // 获取知识空间文件夹ID
        let query = [
          { Key: 'ObjectType', Value: 'wiki', Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: +this.objectID, Oper: 'eq' },
          'and',
          { Key: 'Level', Value: 2, Oper: 'eq' },
          'and',
          { Key: 'Classify', Value: 'folder', Oper: 'eq' }]
        this.loadDocumentByQuery({
          frontQuery: (m) => { return m.objectType === 'wiki' && m.objectId === +this.objectID && m.level === 2 && m.Classify === 'folder' },
          endQuery: query,
          onlyGetData: true
        }).then(res => {
          this.wikiFolderId = res.id
          if (res.acl === 0) {
            // 当前知识空间的查看权限为【公开】
            this.isShowPublic = true 
          } else {
            this.loadUsers()
          }
        })
      } else {
        this.loadUsers()
      }
    },
    loadUsers () {
      this.loadProductUsersByResource({
        objectType: this.category, objectId: this.objectID
      }).then(users => {
        this.initSelectedPersonIDs = users.map(r => {
          return r.PsonId
        })
        let aa = this.initSelectedPersonIDs.map(r => {
          return this.selectPersons[+r]
        })
        this.initSelectPersons = _.cloneDeep(aa)
        this.allRelatedPersons.push(...aa)
      })
    },
    selectPerson (selectedPersons) {
      const newselects = _.differenceBy(selectedPersons, this.allRelatedPersons, 'id')
      this.allRelatedPersons.push(...newselects)
      // 将新增的关联用户保存至数据库
      const lstProductUsers = newselects.map(r => {
        return {
          objectType: this.category,
          objectID: this.objectID,
          psonId: r.id,
          psonName: r.name,
          notes: '',
          extra: ''
        }
      })
      if (lstProductUsers && lstProductUsers.length) {
        this.addBatchProductUser(lstProductUsers) 
      }
      // 判断是否需要删除用户记录
      const deleteSelects = _.filter(this.initSelectPersons, r => 
        !selectedPersons.find(p => p.id === r.id) || selectedPersons.find(p => p.id === r.id).length === 0)
      const deleteUsers = deleteSelects.map(r => {
        return r.id
      })      
      if (deleteUsers && deleteUsers.length) {
        const deleteIds = deleteUsers.join(',')
        this.deleteBatchProductUser({ objectType: this.category, objectId: this.objectID, psonIds: deleteIds }).then(res => {
          // 从界面上移除需要被删除的人员
          this.allRelatedPersons = _.filter(this.allRelatedPersons, r =>
            !deleteUsers.find(p => p === r.id) || deleteUsers.find(p => p === r.id).length === 0)
          this.initSelectPersons = _.filter(this.initSelectPersons, r =>
            !deleteUsers.find(p => p === r.id) || deleteUsers.find(p => p === r.id).length === 0)
          this.initSelectedPersonIDs = _.filter(this.initSelectedPersonIDs, r =>
            !deleteUsers.find(p => p === r) || deleteUsers.find(p => p === r).length === 0)
        }) 
      }     
      this.showSelectPerson = false
    },
    showPublicEvent () {
      if (this.isShowPublic) { // 选中【全员公开】
        if (window.confirm('设置全员公开后，就不用选择关联用户了。')) {
          // 更新当前文件的权限
          let fields = {
            Acl: 0, // 设置为公开权限
            DocID: this.wikiFolderId
          }
          this.updateDocumentField(fields)
        } else {
          this.isShowPublic = false
        }
      } else {
        if (window.confirm('取消全员公开后，需要选择关联用户。')) {
          // 更新当前文件的权限
          let fields = {
            Acl: 2, // 设置为保密权限
            DocID: this.wikiFolderId
          }
          this.updateDocumentField(fields).then(() => {
            this.init()
          })
        } else {
          this.isShowPublic = true
        }
      }
    }
  },
  mounted () {
    this.init()
    // 设置面包屑
    this.clearWidgetBreadcrumbs()
    this.clearModuleBreadcrumbs()
    this.setModuleBreadcrumbs()
  }
}
</script>

<style lang="scss" scoped>
</style>
