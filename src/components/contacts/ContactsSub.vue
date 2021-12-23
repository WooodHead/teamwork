<template>
  <q-card
    :flat="$q.platform.is.mobile"
    class="card-grow-in-page"
  >
    <q-toolbar class="fixed-top q-pa-xs" style="z-index: 1;border-bottom: 1px solid rgba(0, 0, 0, 0.12);background-color: rgba(250, 250, 250, 1);">
      <q-btn
        v-if="$q.platform.is.mobile"
        dense
        flat
        round
        color="primary"
        icon="navigate_before"
        @click="goBack()"
      />
      <q-toolbar-title
        v-if="$q.platform.is.mobile"
        class="row no-wrap items-center justify-center q-px-sm text-subtitle1"
        :class="layoutTextColor"
      >
        <span class="ellipsis">{{title}}</span>
        <slot name="titleAppend"> </slot>
      </q-toolbar-title>
      <q-space v-if="!$q.platform.is.mobile" />
    </q-toolbar>
    <q-card-section
      v-if="isForbidden"
      class="text-grey-5"
    >你没有权限查看通讯录</q-card-section>
    <contacts-child
      v-else
      :type="type"
      :id="id"
    />
  </q-card>
</template>

<script>
export default {
  name: 'ContactsSub',
  inject: ['layoutTextColor'],
  props: {
    type: {
      type: String,
      required: true,
      default: 'organize',
      description: '类型'
    },
    id: {
      type: [String, Number],
      required: false,
      default: 0,
      description: '通过id进行人员匹配的，如：机构'
    }
  },
  data () {
    return {
      title: ''
    }
  },
  computed: {
    isForbidden () {
      let isForbidden = false
      let contactsSettingsItems = this.$store.getters['settings/contactsItems']
      if (contactsSettingsItems.forbidden.orgIds.includes(this.$myinfo.organizeId)) {
        isForbidden = true
      }
      if (contactsSettingsItems.forbidden.psonIds.includes(this.$myinfo.id)) {
        isForbidden = true
      }
      return isForbidden
    }
  },
  async created () {
    if (!this.isForbidden) {
      if (['organize', 'team', 'group'].includes(this.type)) {
        await this.$store.dispatch('resource/loadResourceItem', { objectID: this.id, objectType: this.type })
          .then(res => {
            if (res) {
              this.title = res.title || res.name || res.label
            }
          })
      } else if (this.type === 'consult') {
        this.title = this.$t('consult.module')
      } else if (this.type === 'service') {
        this.title = '工程服务'
      }
    }
  },
  methods: {
    goBack () {
      this.$route.meta.goBack
        ? this.$router.push({ name: this.$route.meta.goBack })
        : window.history.back()
    }
  },
  components: {
    // TwHeader: () => import('components/base/TwHeader'),
    ContactsChild: () => import('components/contacts/ContactsChild')
  }
}
</script>

<style scoped lang="scss">
</style>
