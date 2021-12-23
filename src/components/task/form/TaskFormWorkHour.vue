<template>
  <q-dialog :value="prompt" @hide="onHide">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">任务工时</div>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section class="q-pt-none q-gutter-y-sm">
          <q-input
            filled
            step="0.1"
            type="number"
            v-model.number="predictHour"
            :label="$t('task.item.predictHour')"
            :autofocus="focus==='predictHour'"
            ref="predictHour"
            @focus="$refs.predictHour.select()"
          ></q-input>
          <q-input
            v-if="!model.finished"
            filled
            type="number"
            step="0.1"
            v-model.number="workHour"
            :label="$t('task.item.workHour')"
            :autofocus="focus==='workHour'"
            ref="workHour"
            @focus="$refs.workHour.select()"
          ></q-input>
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            flat
            label="确定"
            type="submit"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-form>

    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TaskFormWorkHour',
  props: {
    model: {
      type: Object,
      default: () => { return { id: 0, finished: false, predictHour: 0, workHour: 0 } }
    },
    prompt: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      predictHour: 0,
      workHour: 0
    }
  },
  computed: {
    focus () {
      return this.model.finished ? 'predictHour' : 'workHour'
    }
  },
  methods: {
    ...mapActions('task', ['finishTask', 'activateTask']),
    onHide () {
      this.$emit('close')
    },
    onSubmit () {
      this.$emit('close')
      if (this.model.finished) {
        this.activateTask({ id: this.model.id, predictHour: this.predictHour })
      } else {
        this.finishTask({ id: this.model.id, predictHour: this.predictHour, workHour: this.workHour })
      }
    }
  },
  mounted () {
    this.predictHour = _.cloneDeep(this.model.predictHour)
    this.workHour = _.cloneDeep(this.model.workHour)
  }
}
</script>

<style>
</style>
