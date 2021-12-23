<template>
  <q-banner class="bg-grey-3 column items-center q-pa-lg">
    <div class="q-pb-md">
      <span v-html="$t('document.editDraft.notes',{modifyTime:timeAgo({ dateTime:model.modifyTime?model.modifyTime.replace(/-/g, '/'):''})} )" />
      <a
        href="javascript:void(0);"
        @click="$emit('shareDraft')"
      > {{$t('document.editDraft.clickShare')}} </a>
      <span>{{$t('document.editDraft.or')}}</span>
    </div>
    <div class=" row justify-center q-gutter-x-md">
      <q-btn
        :label="$t('document.editDraft.continueEdit')"
        @click="edit"
        color="primary"
      />
      <q-btn
        outline
        :label="$t('document.editDraft.postSave')"
        @click="$emit('saveDraft')"
        color="primary"
      />
    </div>
    <div class="q-pt-lg text-center">
      <a
        href="javascript:void(0);"
        @click="backMyDrafts"
      > {{$t('document.editDraft.backDraftsList')}} </a>
    </div>
  </q-banner>
</template>
<script>
import timeAgo from '@/utils/time-ago'
export default {
  name: 'EditDraft',
  props: {
    model: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'notice' // document、notice
    }
  },
  computed: {
  },
  methods: {
    timeAgo,
    edit () {
      let name = this.type === 'document' ? `${this.model.classify}Edit` : `${this.type}Edit`
      if (this.model.extension === 'markmap') {
        name = 'markmapEdit'
      }
      const inDocumentCenter = this.$route.path.split('/')[1] === 'document'
      let params = inDocumentCenter
        ? { id: this.model.id }
        : { category: this.model.objectType, objectID: this.model.objectID, id: this.model.id }
      this.$router.push({
        name: name,
        params
      })
    },
    backMyDrafts () {
      this.$router.go(-1)
    }
  }
}
</script>
