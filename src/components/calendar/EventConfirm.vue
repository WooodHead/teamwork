<template>
  <q-dialog
    v-model="confirm"
    persistent
  >
    <q-card class="my-card text-center q-pa-lg">
      <q-card-section>
        <div class="text-h5">{{$t('schedule.thisEventRepeats')}}</div>
        <div class="text-h6">{{$t('schedule.doYouWantToChangeAllFutureOccurrencesOfThisEventToo',{action:$t(`action.${action}`)})}}</div>
      </q-card-section>
      <q-card-section class="column q-gutter-md">
        <q-btn
          color="primary"
          rounded
          :label="$t('schedule.changingJustThisEvent',{action:$t(`action.${action}`)})"
          @click="$emit('justThis',true)"
          :loading="loadingJustThis"
        />
        <q-btn
          color="primary"
          rounded
          outline
          :label="$t('schedule.changingAllFutureEvents',{action:$t(`action.${action}`)})"
          @click="$emit('justThis',false)"
          :loading="loadingChangeAll"
        />
      </q-card-section>
      <q-card-section class="q-pb-none">
        <router-link
          to=""
          @click.native="cancel"
        >{{$t('schedule.neverMindDontSaveYet',{action:$t(`action.${action}`)})}}</router-link>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EventConfirm',
  props: {
    action: {
      type: String,
      required: true,
      description: 'update,archive,delete'
    },
    confirm: {
      type: Boolean,
      default: false
    },
    loadingJustThis: {
      type: Boolean,
      default: false
    },
    loadingChangeAll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel () {
      this.$emit('update:confirm', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  max-width: 490px;
  width: 100%;
}
</style>
