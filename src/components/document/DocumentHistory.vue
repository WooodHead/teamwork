<template>
  <tw-history
    type="document"
    :id="Number(id)"
  >
    <template slot="content">
      <q-card-section>
        <div class="row justify-center">
          <folder-card
            v-if="currentModel.classify==='folder'"
            :folder="currentModel"
          />
          <file-card
            v-else
            :file="currentModel"
          />
        </div>
      </q-card-section>
    </template>
    <template slot="subSelectPosition1">
      <folder-tree
        :objectCondition="categoryPayload"
        :subId.sync="subId"
      />
    </template>
  </tw-history>
</template>

<script>
export default {
  name: 'DocumentHistory',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
      categoryPayload: {},
      subId: 0
    }
  },
  computed: {
    currentModel () {
      return this.$store.getters['document/currentModel'](+this.id || 0)
    }
  },
  components: {
    TwHistory: () => import('components/base/TwHistory'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    FileCard: () => import('components/document/DocumentCard')
  }
}
</script>

<style scoped>
</style>
