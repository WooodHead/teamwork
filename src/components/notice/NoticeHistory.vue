<template>
  <tw-history
    :category="category"
    :objectID="+objectID"
    type="notice"
    :id="id"
  >
    <template #content>
      <file-card :file="notice" />
    </template>
  </tw-history>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
import { mapActions } from 'vuex'
export default {
  name: 'NoticeHistory',
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    id: {
      type: [Number, String],
      required: true
    },
    dense: {
      type: Boolean,
      default: false,
      required: false
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    cardStyle: {
      type: String,
      default: 'torn', // whole
      required: false,
      description: '撕边/完整卡片'
    }
  },
  data () {
    return {
      notice: ''
    }
  },
  components: {
    TwHistory: () => import('components/base/TwHistory'),
    FileCard: () => import('components/document/DocumentCard')
  },
  methods: {
    formatDate,
    ...mapActions('notice', ['loadNotice'])
  },
  mounted () {
    this.loadNotice(this.id).then(res => {
      this.notice = res
    })
  }
}
</script>
