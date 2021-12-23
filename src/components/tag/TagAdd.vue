<template>
  <q-chip
    outline
    clickable
    color="primary"
    text-color="white"
    icon="add"
  >
    添加
    <q-popup-edit
      ref="popup"
      v-model="title"
    >
      <template v-slot="{cancel }">
        <q-input
          autofocus
          dense
          counter
          hint="标签描述"
          v-model="title"
          @keydown.enter.prevent="add"
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
              @click.stop="add"
            />
          </template>
        </q-input>
      </template>
    </q-popup-edit>
  </q-chip>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TagName',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      title: ''
    }
  },
  methods: {
    ...mapActions('tag', ['addTag']),
    cancel () {
      this.$refs.popup.cancel()
    },
    add () {
      this.$refs.popup.set()
      this.addTag({ title: this.title, type: this.type })
      this.title = ''
    }
  }
}
</script>

<style>
</style>
