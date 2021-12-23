<template>
  <div
    v-if="editable"
    class="q-pb-md"
  >
    <div
      class="row items-center"
      v-if="!groupEditing"
    >
      <div
        class="group-title cursor-pointer"
        :class="tagGroup.icon"
        @click="groupEditing=true"
      >
        {{tagGroup.dictKey}}
      </div>
      <q-separator class="col" />
    </div>
    <tag-form-group
      v-else
      :id="tagGroup.id"
      @close="updateGroup"
    />
  </div>
  <div
    v-else
    class="q-pb-md row items-center"
  >
    <div
      class="group-title"
      :class="tagGroup.icon"
    >
      {{tagGroup.dictKey}}
    </div>
    <q-separator class="col" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TagGroupHeader',
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
    }
  },
  data () {
    return {
      groupEditing: false
    }
  },
  components: {
    'tag-form-group': () => import('components/tag/TagFormGroup')
  },
  methods: {
    ...mapActions('tag', ['updateTag']),
    update (model) {
      this.updateTag(model)
    },
    updateGroup (group) {
      this.groupEditing = false
      if (group) {
        Object.assign(this.tagGroup, group)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.group-title {
  padding: 0.01em 0.33em;
  border-radius: 0.25em;
  word-break: break-word;
  font-size: 16px;
  font-weight: bold;
}
</style>
