<template>
  <q-chip
    class="boost-chip"
    :class="{ 'emoji-font':$q.platform.is.win}"
    color="white"
    :removable="removable"
    clickable
    @click="onClicked"
    @remove="onRemove"
  >
    <tw-avatar
      size="sm"
      :id="boost.senderID"
    />
    {{ boost.title }}
  </q-chip>
</template>

<script>
/**
 * TwBoost
 * @desc 鼓励小组件
 * @example
 * ```vue
 * <tw-boost
    title="👍加油，干得不错！"
    :person="{
        id: 4,
        name: '陆焉识',
        img: 'https://cdn.quasar.dev/img/avatar4.jpg'}"
   />
 * ```
 */
import { LocalStorage } from 'quasar'
import { mapActions } from 'vuex'
export default {
  name: 'TwBoost',
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    model: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      removable: false
    }
  },
  computed: {
    boost () {
      return this.model || this.$store.getters['boost/boost'](this.id)
    }
  },
  methods: {
    ...mapActions('boost', ['deleteBoost']),
    onClicked () {
      if (LocalStorage.getItem('myself').id === this.boost.senderID) {
        this.removable = !this.removable
      } else {
        this.removable = false
      }
    },
    onRemove () {
      this.deleteBoost(this.boost.id)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
