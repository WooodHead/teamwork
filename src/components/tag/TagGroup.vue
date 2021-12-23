
<template>
  <q-card-section>
    <tag-group-header
      :tag-group="tagGroup"
      :editable="editable"
    />
    <div class="q-gutter-xs">
      <tag
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        :editable="editable"
        :selected="selected(tag.title)"
        @select="select"
      />
      <tag-add
        v-if="editable"
        :type="tagGroup.dictKey"
      />
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: 'TagGroup',
  props: {
    tagGroup: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    editable: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedTags: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    selected () {
      return (title) => this.selectedTags.includes(title)
    },
    tags () {
      const tags = this.$store.state.tag.tags.filter(a => a.type === this.tagGroup.dictKey)
      return tags
    }
  },
  components: {
    Tag: () => import('components/tag/Tag'),
    TagAdd: () => import('components/tag/TagAdd'),
    TagGroupHeader: () => import('components/tag/TagGroupHeader')
  },
  methods: {
    select (tag) {
      const index = this.selectedTags.findIndex(t => t === tag)
      index > -1 ? this.selectedTags.splice(index, 1) : this.selectedTags.push(tag)
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
