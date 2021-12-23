<template>
  <div>
    <div class="text-h6">{{model.title}}</div>
    <div class="text-caption">{{model.notes}}</div>
    <div
      v-if="serviceFiles.length>0"
      :class="`row ${$q.screen.gt.xs?'q-col-gutter-md':'q-col-gutter-sm'}`"
    >
      <div
        v-for="serviceFile in serviceFiles"
        :key="serviceFile.id"
        :class="`text-center ${$q.screen.gt.xs?'col-4':'col-12'}`"
      >
        <q-card
          flat
          bordered
          class="q-pa-sm full-height"
        >
          <attach-icon
            :path="serviceFile.filePath"
            :extension="serviceFile.extension"
          />
          <div>
            <a
              target="_self"
              :href="`javascript:download('${serviceFile.filePath}')`"
              :title="$t('action.download')"
            >
              {{serviceFile.title}}{{serviceFile.extension}}
              &nbsp;&nbsp;<i>({{humanStorageSize(serviceFile.size * 1024)}})</i></a>
          </div>
        </q-card>

      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
const { humanStorageSize } = format
export default {
  name: 'ServiceCardDetail',
  components: {
    AttachIcon: () => import('components/attach/AttachIcon')
  },
  props: {
    id: { type: Number, required: true, default: () => { }, desc: '需求单据id' }
  },
  data () {
    return {
      serviceFiles: []
    }
  },
  computed: {
    ...mapGetters('service', ['service']),
    model () {
      return this.service(+this.id)
    }
  },
  methods: {
    ...mapActions('service', ['loadService']),
    ...mapActions('document', ['loadDocuments']),
    humanStorageSize
  },
  created () {
    let that = this
    this.loadService(+this.id)
      .then(resService => {
        // 仅加载由需求者上传的文件
        let fileQuery = [
          { Key: 'ObjectType', Value: 'service', Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
          'and',
          { Key: 'Classify', Value: 'file', Oper: 'eq' },
          'and',
          { Key: 'AuthorID', Value: resService.owner, Oper: 'eq' }
        ]
        this.loadDocuments({ query: fileQuery })
          .then(res => {
            that.serviceFiles = res
          })
      })
  }
}
</script>

<style lang='scss' scoped>
</style>
