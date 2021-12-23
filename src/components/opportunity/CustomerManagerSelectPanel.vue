<template>
  <q-card>
    <div class="q-pa-sm row justify-center">
      <q-form
        autofocus
        @submit.prevent="onSubmit"
      >
        <q-card-section class="q-pa-none">
          <tw-select-person
            v-model="leaderID"
            emit-value
            lazy-rules
            style="min-width:250px;"
            :label="$t('base.selectPerson')"
            :rules="[val => val>0 || $t('organize.editCerify.leader')]"
          />
        </q-card-section>
        <q-card-actions align="left">
          <q-btn
            :label="$q.lang.label.ok"
            type="submit"
            color="primary"
          />
        </q-card-actions>
      </q-form>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'CustomerManagerSelectPanel',
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson')
  },
  props: {
    customerManagerID: { type: [String, Number], required: true }
  },
  data () {
    return {
      leaderID: 0
    }
  },
  mounted () {
    this.leaderID = this.customerManagerID
  },
  methods: {
    onSubmit () {
      if (+this.leaderID) {
        this.$emit('onAssignCallback', this.leaderID)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.person-panel {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
