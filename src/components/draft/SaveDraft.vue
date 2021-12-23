<template>
  <q-banner class="bg-grey-3 q-pb-lg">
    <tw-choose-notify
      :module="{ category:model.objectType,id:+model.objectID}"
      :widget="{category:type,id: +model.id}"
      :category="model.objectType"
      :objectID="+model.objectID"
      :always="type==='notice'"
      :subscribers.sync="subscribers"
    />
    <div class="row  q-gutter-x-md">
      <q-btn
        :label="$t('document.editDraft.postSave')"
        @click="save"
        color="primary"
      />
      <q-btn
        outline
        :label="$q.lang.label.cancel"
        @click="$emit('close')"
        color="primary"
      />
    </div>
  </q-banner>
</template>
<script>
import { format, debounce } from 'quasar'
const { capitalize } = format
export default {
  name: 'SaveDraft',
  props: {
    model: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true,
      default: 'notice' // document、notice
    }
  },
  data () {
    return {
      subscribers: []
    }
  },
  methods: {
    save: debounce(function () {
      this.submitData()
    }, 3000, true),
    submitData () {
      if (Object.keys(this.model).length) {
        this.model.isPublish = 1
        // 订阅人员处理
        this.model.subscribers = this.subscribers
        this.$store.dispatch(`${this.type}/update${capitalize(this.type)}`, this.model)
      }
    }
  },
  components: {
    TwChooseNotify: () => import('components/base/TwChooseNotify')
  }
}
</script>
