<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card :title="$t('consult.addSelect.transactor')">
      <template
        #menu
        v-if="$q.platform.is.mobile&&consultRolePsonIds.length"
      >
        <q-btn
          dense
          rounded
          unelevated
          flat
          :label="$t('consult.transactor.canNotFind')"
          :title="$t('consult.item.canNotFindTitle')"
          color="primary"
          @click="chat"
        />
      </template>
    </tw-header-card>
    <contacts-child
      type="consult"
      title="咨询台"
      :class="['q-px-xxl',$q.screen.lt.sm?'q-pt-md':'q-pt-sm' ]"
    />
    <div
      v-if="!$q.platform.is.mobile&&consultRolePsonIds.length"
      class="q-px-xxl"
    >
      <q-btn
        outline
        rounded
        :label="$t('consult.transactor.canNotFind')"
        :title="$t('consult.item.canNotFindTitle')"
        color="primary"
        @click="chat"
      />
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'TransactorList',
  computed: {
    consultRolePson () {
      return this.$store.getters['person/selectPersonsOfRoleCode']('ConsultAdministrator')
    },
    consultRolePsonIds () {
      return _.filter(this.consultRolePson, f => f.isInService).map(n => n.id)
    }
  },
  methods: {
    chat () {
      // 打开与咨询管理员的聊天窗口。如果有多个则随机显示
      let psonId = 0
      if (this.consultRolePsonIds.length > 1) {
        let random = _.random(0, this.consultRolePsonIds.length - 1)
        psonId = this.consultRolePsonIds[random]
      } else {
        psonId = this.consultRolePsonIds[0]
      }
      psonId && this.$router.push({
        name: 'chat',
        params: { category: 'person', objectID: psonId }
      })
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    ContactsChild: () => import('components/contacts/ContactsChild')
  }
}
</script>

<style lang="scss" scoped>
</style>
