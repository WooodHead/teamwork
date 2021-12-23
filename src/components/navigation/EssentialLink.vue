<template>
  <q-item
    :to="external?undefined:{ name }"
    :key="name"
    clickable
    exact
    @click="onClick()"
  >
    <q-item-section
      v-if="meta.icon"
      avatar
    >
      <q-icon :name="meta.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ meta.label }}</q-item-label>
      <q-item-label
        v-if="meta.caption"
        caption
      >{{ meta.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { openURL } from 'quasar'
export default {
  name: 'EssentialLink',
  computed: {
    ...mapState('layout', ['layout']),
    leftDrawerOpen: {
      get () {
        return this.layout.leftDrawerOpen
      },
      set (value) {
        this.setLeftDrawerOpen(value)
      }
    }
  },
  methods: {
    ...mapActions('layout', ['setLeftDrawerOpen']),
    onClick () {
      this.external && openURL(this.path)
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  props: {
    path: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    meta: {
      type: Object
    },
    external: {
      type: Boolean,
      required: false,
      default: false,
      desc: '是否外部链接'
    }
  }
}
</script>
