<template>
  <q-list>
    <div
      v-for="draft in draftList"
      :key="draft.id"
    >
      <draft-item
        :draft="draft"
        :category="category"
        :objectID="objectID"
      />
    </div>
  </q-list>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DrafuList',
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
  // data () {
  //   return {
  //     draftList: []
  //   }
  // },
  mounted () {
    this.loadDraftList(+this.id)
  },
  computed: {
    ...mapState('document', ['documentList']),
    draftList () {
      const list = _.filter(this.documentList, { 'parentId': +this.id, 'isPublish': 0 })
      return _.orderBy(list, ['modifyTime'], ['desc'])
    }
  },
  methods: {
    ...mapActions('document', ['loadDraftList'])
  },
  components: {
    'draft-item': () => import('components/document/draft/DraftItem')
  }
}
</script>

<style>
</style>
