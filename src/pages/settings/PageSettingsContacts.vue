<template>
  <q-card
    class="card-grow-in-page settings-contacts"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card :title="$t('settings.contacts')" />
    <q-card-section class="q-px-xxl">
      <q-list
        bordered
        class="rounded-borders q-mt-md"
        v-for="(setting, key) in settings"
        :key="key"
      >
        <q-item-label header>
          {{setting.title}}&ensp;
          <a
            class="q-pl-md"
            href="javascript:;"
            @click="showContactSelect(setting)"
          >{{$t('action.addition')}}</a>
          &nbsp;
          <span class="text-caption">{{setting.description}}</span>
        </q-item-label>
        <q-item v-if="setting.items.length">
          <q-item-section>
            <div>
              <q-chip
                outline
                square
                text-color="blue-grey"
                v-for="item in setting.items"
                :key="`${item.name}_${item.value}`"
                :icon="item.icon"
                :label="item.label"
              />
            </div>
          </q-item-section>
          <q-item-section side>
            <div><a
                class="q-pl-md"
                href="javascript:;"
                @click="showContactSelect(setting)"
              >{{$t('action.edit')}}</a>
              <a
                class="q-pl-md"
                href="javascript:;"
                @click="delContactItems(setting)"
              >{{$t('action.delete')}}</a></div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { showSuccessMessage } from '@/utils/show-message'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'pageSettingsContacts',
  props: {},
  data () {
    return {}
  },
  computed: {
    settings () {
      return this.$store.state.settings.settings['contacts'].settings
    }
  },
  created () {
    this.loadSettings({ query: [{ Key: 'Type', Value: 'contacts', Oper: 'eq' }] })
  },
  mounted () { },
  watch: {},
  methods: {
    ...mapActions('settings', ['loadSettings', 'updateSetting']),
    showContactSelect (setting) {
      this.$q.dialog({
        component: () => import('components/contacts/ContactSelect'),
        parent: this,
        persistent: true,
        model: setting
      }).onOk(items => {
        setting.items = items
        let contacts = {
          id: this.$store.state.settings.settings['contacts'].id,
          type: 'contacts',
          settings: this.settings
        }
        this.updateSetting(contacts).then(res => {
          showSuccessMessage('操作成功')
        })
      }).onCancel(() => { })
    },
    delContactItems (setting) {
      showConfirm(this.$t('message.reallyDelete'), () => {
        setting.items = []
        let contacts = {
          id: this.$store.state.settings.settings['contacts'].id,
          type: 'contacts',
          settings: this.settings
        }
        this.updateSetting(contacts).then(res => {
          showSuccessMessage('操作成功')
        })
      })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style scoped lang="scss">
  .settings-contacts a {
    color: #0c4c7f;
    text-decoration: none;
  }
  .settings-contacts a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
