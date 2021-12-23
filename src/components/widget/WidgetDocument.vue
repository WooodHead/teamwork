<template>
  <widget-layout
    :isEmpty="isEmpty"
    widget="document"
    :category="category"
    :id="objectID"
  >
    <template slot="content">
      <q-card-section :class="['row justify-center no-pointer-events',$q.screen.lt.sm?'q-pa-xs q-gutter-sm':'q-pa-sm q-gutter-md']">
        <span
          v-for="item in resourceDocument.children"
          :key="item.id"
          class="toolsCard"
          style="width:38%"
        >
          <folder-card
            v-if="item.classify==='folder'"
            :folder="item"
          ></folder-card>
          <file-card
            v-if="['doc', 'file', 'link'].includes(item.classify)"
            :file="item"
          >
          </file-card>
        </span>
      </q-card-section>
    </template>
  </widget-layout>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'WidgetDocument',
  props: {
    category: {
      type: String,
      required: true
    },
    objectID: {
      type: Number,
      required: true
    }
  },
  mounted () {
    this.loadResourceDocument({ objectType: this.category, objectID: +this.objectID })
      .then(res => {
        this.loadDocument(res.id)
      })
  },
  computed: {
    resourceDocument () {
      return this.$store.getters['document/resourceDocument'](this.category, +this.objectID)
    },
    isEmpty () {
      if (this.resourceDocument.children) {
        let data = _.filter(this.resourceDocument.children, item => {
          return !item.archived && item.isPublish
        })
        return data.length === 0
      } else {
        return true
      }
    }
  },
  methods: {
    ...mapActions('document', ['loadResourceDocument', 'loadDocument'])
  },
  components: {
    FileCard: () => import('components/document/DocumentCard'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    WidgetLayout: () => import('layouts/WidgetLayout')
  }
}
</script>

<style lang="scss" scoped>
</style>
