<template>
  <widget-layout
    :isEmpty="!wikiShowPublic&&users.length===0"
    widget="user"
    :category="category"
    :id="objectID"
  >
  <template slot="content"> 
    <div v-if="wikiShowPublic" :class="$q.screen.gt.xs?'q-py-md':'q-py-xs'">
       <q-btn
        round
        :size="$q.screen.gt.xs?'32px':'20px'"
        color="primary"
        icon="local_library"
      />      
    <q-item> 
      <q-item-section>
        <q-item-label>当前知识空间全员公开可见</q-item-label>
      </q-item-section>
    </q-item>
    </div> 
    <q-item v-else
      v-for="user in users"
      :key="user.id"
      :class="{'q-px-none':$q.screen.lt.sm}"
    >
      <q-item-section avatar>
        <tw-avatar
          size="md"
          :id="user.id"
          :name="user.name"
          :img="user.img"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-left">{{ user.name }}        
        </q-item-label>
        <q-item-label
          lines="1"
          caption
        >
          <span v-if="user.dutyName&&user.orgShortName">
            {{ user.dutyName?user.dutyName:''}} • {{ user.orgShortName?user.orgShortName:''}}
          </span>
          <span v-else>
            {{ user.dutyName?user.dutyName:''}} {{ user.orgShortName?user.orgShortName:''}}
          </span>
        </q-item-label>
      </q-item-section>
    </q-item>
  </template>
  </widget-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'WidgetUser',
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout'),
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    category: { type: String, required: true },
    objectID: { type: [Number, String], required: false, default: 0 }
  },
  data () {
    return {
      users: [],
      wikiShowPublic: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('person', ['selectPersons'])   
  },
  methods: {    
    ...mapActions('productUser', ['loadProductUsersByResource']),
    ...mapActions('document', ['loadDocumentByQuery']),
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
          if (res.acl === 0) {
            // 当前知识空间的查看权限为【公开】
            this.wikiShowPublic = true
          } else {
            this.loadUsers()
          }
        })
      } else {
        this.loadUsers()
      }
    },
    loadUsers () {
      this.loadProductUsersByResource({ objectType: this.category, objectId: this.objectID
      }).then(users => {
        this.users = users.map(r => {
          return this.selectPersons[r.PsonId]
        })
      })
    }
  },
  watch: {
    objectID (newVal) {
      this.init()
    }
  }
}
</script>

<style scoped>
</style>
