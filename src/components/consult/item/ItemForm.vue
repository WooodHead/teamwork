<template>
  <q-card
    flat
    bordered
  >
    <q-form
      autofocus
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <q-card-section class="q-pb-none">
        <q-input
          filled
          autofocus
          v-model="model.title"
          :placeholder="$t('consult.item.title')"
          lazy-rules
          :rules="[ val => val && val.trim().length > 0 || $t('rule.fieldIsRequired')]"
        />
        <tw-select-person
          filled
          v-model="model.psonIDs"
          multiple
          emit-value
          :label="$t('base.selectPerson')"
          lazy-rules
          :rules="[val => val.length>0 || $t('consult.item.editCerify.pson')]"
        />
      </q-card-section>

      <q-card-actions class="q-px-md">
        <q-btn
          class="q-px-sm"
          rounded
          :label="$q.lang.label.ok"
          type="submit"
          color="primary"
        />
        <q-btn
          class="q-px-sm"
          rounded
          outline
          :label="$q.lang.label.cancel"
          type="reset"
          color="primary"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Model from '@/store/consult/model'
const ConsultItem = Model.ConsultItem
export default {
  name: 'ItemForm',
  props: {
    type: {
      type: String,
      required: true
    },
    openType: {
      type: String,
      required: true,
      default: 'add'
    },
    id: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      model: new ConsultItem()
    }
  },
  mounted () {
    if (this.openType !== 'add') {
      this.loadConsultItem(Number(this.id)).then(res => {
        if (res) {
          this.model = res
        }
      })
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson')
  },
  methods: {
    ...mapActions('consult', ['addConsultItem', 'updateConsultItem', 'loadConsultItem']),
    ...mapMutations('consult', ['setEmptyTransators']),
    onSubmit () {
      this.setEmptyTransators()
      Object.assign(this.model, { type: this.type })
      if (this.openType === 'add') {
        this.addConsultItem(this.model)
      } else {
        this.updateConsultItem(this.model)
      }
      this.$emit('close')
    },
    onReset () {
      this.$emit('close')
    }
  }
}
</script>
