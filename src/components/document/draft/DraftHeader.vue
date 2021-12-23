<template>
  <div class="row justify-center">
    <q-btn
      flat
      :label="label"
      color="primary"
      icon="insert_drive_file"
      @click="showDrafts"
    />
  </div>
</template>
<script>
export default {
  name: 'DraftHeader',
  props: {
    id: {
      type: Number,
      default: 0
    },
    draftTotals: {
      type: Number,
      default: 0
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
  computed: {
    label () {
      return '这儿有' + this.draftTotals + '个您的草稿需要完善... '
    }
  },
  methods: {
    showDrafts () {
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      let params = inDocumentCenter
        ? { id: this.id }
        : { category: this.category, objectID: this.objectID, id: +this.id }
      this.$router.push({
        name: 'draftDocuments',
        params
      })
    }
  }
}
</script>

<style>
</style>
