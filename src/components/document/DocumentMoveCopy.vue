<template>
  <resource-move-copy
    :action="action"
    :type="type"
    :id="currentModel.id"
    :subId='subId'
    @selectItem='subSelect'
    :category="category"
    :objectID="objectID"
  >
    <template slot="content">
      <q-card-section>
        <div class="row justify-center">
          <folder-card
            v-if="type==='document'&&currentModel.classify==='folder'"
            :folder="currentModel"
          />
          <file-card
            v-else
            :file="currentModel"
          />
        </div>
      </q-card-section>
    </template>
    <template
      v-if="type==='document'"
      slot="subSelectPosition1"
    >
      <folder-tree
        :objectCondition="categoryPayload"
        :subId.sync="subId"
      />
    </template>
  </resource-move-copy>
</template>

<script>
export default {
  name: 'DocumentMoveCopy',
  props: {
    type: {
      type: String,
      default: 'document' // document.notice
    },
    action: {
      type: String,
      default: 'copy'
    },
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    }
  },
  data () {
    return {
      categoryPayload: {
        category: this.category,
        isNotSpecific: false,
        objectID: this.objectID
      },
      subId: 0
    }
  },
  computed: {
    currentModel () {
      return this.$store.getters[`${this.type}/currentModel`](+this.id || 0)
    }
  },
  methods: {
    subSelect (payload) {
      this.categoryPayload = Object.assign({}, payload)
    }
  },
  components: {
    ResourceMoveCopy: () => import('components/resource/ResourceMoveCopy'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    FileCard: () => import('components/document/DocumentCard'),
    FolderTree: () => import('components/document/folder/FolderTree')
  }
}
</script>

<style scoped>
</style>
