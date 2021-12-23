<template>
  <q-card
    flat
    bordered
  >
    <q-form
      autofocus
      @submit.prevent="onSubmit"
    >
      <q-card-section>
        <q-input
          filled
          v-model="fields.name"
          label="群组名称"
          lazy-rules
          :rules="[ val => val && val.length > 0 || $t('rule.fieldIsRequired')]"
        />
        <tw-select-person
          filled
          v-model="fields.members"
          :label="$t('base.selectPerson')"
          multiple
          emit-value
        />
      </q-card-section>

      <q-card-actions align="left">
        <q-btn
          :label="$q.lang.label.ok"
          type="submit"
          color="primary"
        />
        <q-btn
          outline
          :label="$q.lang.label.cancel"
          color="primary"
          @click="$emit('cancel')"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'TwGroupAdd',
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson')
  },
  props: {
    id: { type: [Number, String], required: true }
  },
  data () {
    return {
      fields: {
        id: 0,
        name: '',
        members: [],
        notes: ''
      }
    }
  },
  watch: {
    id: function (newId, oldId) {
      this.init()
    }
  },
  mounted () {
    // 初始化页面
    this.init()
  },
  methods: {
    ...mapActions('group', ['loadGroup']),
    init () {
      // 通过id获取单个model
      if (this.id > 0) {
        this.loadGroup(this.id).then(res => {
          res.members = _.map(res.members, m => Number(m))
          this.fields = _.cloneDeep(res)
        })
      }
    },
    onSubmit () {
      this.$emit('ok', this.fields)
    }
  }
}
</script>

<style>
</style>
