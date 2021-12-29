<template>
  <q-card class="card-grow-in-page" :flat="$q.screen.lt.sm">
    <tw-header-card :title="$t('action.viewDocumentCount')" />
    <q-tabs
      v-model="type"
      class="text-primary"
      dense
      align="justify"
      narrow-indicator
    >
      <q-tab name="visitor" icon="person" label="访问者">
        <q-badge color="red" floating>{{recordCount.visitor}}</q-badge>
      </q-tab>
      <q-tab name="visit" icon="remove_red_eye" label="访问记录">
        <q-badge color="red" floating>{{recordCount.visit}}</q-badge>
      </q-tab>
      <q-tab v-if="isFileType" icon="get_app" name="download" label="下载记录">
        <q-badge color="red" floating>{{recordCount.download}}</q-badge>
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="type" animated>
      <q-tab-panel name="visitor">
        <document-or-notice-record :category="modelType" :objectID="objectID" :id="id" :type="'visitor'"/>
      </q-tab-panel>
      <q-tab-panel name="visit">
        <document-or-notice-record :category="modelType" :objectID="objectID" :id="id" :type="'visit'"/>
      </q-tab-panel>
      <q-tab-panel name="download" v-if="isFileType">
        <document-or-notice-record :category="modelType" :objectID="objectID" :id="id" :type="'download'"/>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
export default {
  name: 'DocumentOrNoticeCount',
  props: {
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
    },
    id: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      type: 'visitor',
      recordCount: {
        visitor: 0,
        visit: 0,
        download: 0
      }
    }
  },
  computed: {
    modelType () {
      return this.$route.path.includes('notice') ? 'notice' : 'document'
    },
    isFileType () {
      return this.$route.path.includes('file')
    }
  },
  mounted () {
    this.loadRecordCount()
  },
  methods: {
    loadRecordCount () {
      let query = [
        { Key: 'ObjectType', Value: this.modelType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' }
      ]
      this.$store.dispatch('file/loadRecordCount', { query })
        .then(res => {
          this.recordCount = res
        })
    }
  },
  components: {
    DocumentOrNoticeRecord: () => import('components/document/DocumentOrNoticeRecord'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style>

</style>
