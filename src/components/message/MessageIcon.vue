
<template>
  <q-btn
    v-if="!$q.screen.gt.xs"
    title="消息中心"
    size="md"
    round
    icon="notifications"
    flat
    dense
    @click="$router.push({name:'message'})"
  >
    <q-avatar
      v-if="unRead"
      class="absolute-top-right"
      size="0.5rem"
      color="red"
    />
  </q-btn>
  <q-btn
    v-else
    title="消息中心"
    size="md"
    round
    icon="notifications"
    flat
    dense
    @click="click"
  >
    <q-avatar
      v-if="unRead"
      class="absolute-top-right"
      size="0.5rem"
      color="red"
    />
    <q-popup-proxy
      v-if="messagePanelFloat"
      ref="messagePanel"
    >
      <q-card class="my-card">
        <q-card-section>
          <message-panel />
        </q-card-section>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  components: {
    'message-panel': () => import('components/message/MessagePanel.vue')
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapGetters('message', ['unRead']),
    ...mapState('layout', ['layout']),
    ...mapState('message', ['messagePanelFloat']),
    rightDrawerOpen: {
      get () {
        return this.layout.rightDrawerOpen
      },
      set (value) {
        this.setRightDrawerOpen(value)
      }
    }
  },
  mounted () {
    this.$root.$on('popupMessagePanel', this.popupMessagePanel)
    this.loadMyOneUnread()
  },
  methods: {
    ...mapActions('message', ['loadMyOneUnread']),
    ...mapActions('layout', ['setRightDrawerOpen']),
    popupMessagePanel () {
      this.$nextTick(() =>
        this.$refs.messagePanel.show()
      )
    },
    click () {
      if (!this.messagePanelFloat) {
        this.rightDrawerOpen = !this.rightDrawerOpen
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .my-card {
    max-width: 860px;
    min-width: 50vw;
  }
</style>
