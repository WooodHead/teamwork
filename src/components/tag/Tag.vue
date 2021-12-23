<!--  -->
<template>
  <q-chip
    v-if="editable"
    class="cursor-pointer"
    removable
    :text-color="color.textcolor"
    @remove="onDelete"
  >
    {{tag.title}}
    <q-popup-edit
      ref="popupedit"
      v-model="tag.title"
    >
      <q-input
        v-model="tag.title"
        dense
        autofocus
        counter
      >
        <template v-slot:after>
          <q-btn
            flat
            dense
            color="negative"
            icon="cancel"
            @click.stop="cancel"
          />
          <q-btn
            flat
            dense
            color="positive"
            icon="check_circle"
            @click.stop="update(tag)"
          />
        </template>
      </q-input>
    </q-popup-edit>
  </q-chip>
  <q-chip
    v-else
    @click="$emit('select', tag.title )"
    clickable
    :color="color.bgcolor"
    :text-color="color.textcolor"
  >
    {{tag.title}}
  </q-chip>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Tag',
  props: {
    tag: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    editable: {
      type: Boolean,
      default: false,
      required: false
    },
    selected: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    ...mapActions('tag', ['updateTag', 'deleteTag']),
    update (tag) {
      this.$refs.popupedit.set()
      this.updateTag(tag)
    },
    cancel () {
      this.$refs.popupedit.cancel()
    },
    onDelete () {
      this.deleteTag(this.tag.id)
    }
  },
  computed: {
    color () {
      return this.selected
        ? { bgcolor: 'primary', textcolor: 'white' }
        : { bgcolor: 'grey-4', textcolor: 'dark' }
    }
  }
}

</script>

<style lang='scss' scoped>
// /deep/ .q-chip__icon--remove {
//   visibility: hidden;
// }
// /deep/.q-chip:hover .q-chip__icon--remove {
//   visibility: visible;
// }
</style>
