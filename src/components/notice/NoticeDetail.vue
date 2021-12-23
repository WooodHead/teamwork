<template>
  <component
    :id="id"
    :is="currentModel&&currentModel.filePath?'file-detail':'document-detail'"
    :category="category"
    :objectID="objectID"
    type="notice"
    @submitFinished="onSubmitDiscuss"
  >
  </component>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'NoticeDetail',
  props: {
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
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  computed: {
    currentModel () {
      return this.$store.getters['notice/currentModel'](+this.id)
    }
  },
  created () {
    this.loadNotice(+this.id)
  },
  methods: {
    ...mapActions('notice', ['loadNotice', 'updateNoticeCommentCount']),
    onSubmitDiscuss () {
      this.updateNoticeCommentCount({
        id: +this.id,
        isAdd: true
      })
    }
  },
  components: {
    DocumentDetail: () => import('components/document/DocumentDetail'),
    FileDetail: () => import('components/document/file/FileDetail')
  }
}
</script>

<style lang="scss" scoped>
</style>
