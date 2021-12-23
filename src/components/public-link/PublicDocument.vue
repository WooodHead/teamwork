<template>
  <q-card-section class="q-pt-xl q-gutter-y-sm">
    <template v-if="model.classify==='doc'">
      <mark-map-public-detail
        v-if="model.extension==='markmap'"
        :model="model"
      />
      <document-public-detail
        v-else
        isPublicLink
        :id="model.id"
      ></document-public-detail>
    </template>
    <template v-if="model.classify==='file'">
      <file-detail
        isPublicLink
        :id="model.id"
      ></file-detail>
    </template>
    <template v-if="model.classify==='link'">
      <link-detail
        isPublicLink
        :id="model.id"
      ></link-detail>
    </template>
  </q-card-section>
</template>

<script>
import { mapMutations } from 'vuex'
import Document from '@/store/document/model'
export default {
  name: 'PublicDocument',
  props: {
    publicContent: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      model: {}
    }
  },
  created () {
    if (this.publicContent) {
      this.model = Document.from(this.publicContent)
      this.setDocumentList([this.model])
      this.addDocument(this.model)
    }
  },
  methods: {
    ...mapMutations('document', ['addDocument', 'setDocumentList'])
  },
  components: {
    DocumentPublicDetail: () => import('components/document/DocumentPublicDetail'),
    FileDetail: () => import('components/document/file/FileDetail'),
    LinkDetail: () => import('components/document/link/LinkDetail'),
    MarkMapPublicDetail: () => import('components/document/markmap/MarkMapPublicDetail')
  }
}
</script>

<style scoped>
</style>
