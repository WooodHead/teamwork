<template>
  <q-banner class="bg-grey-3 column items-center q-pa-lg text-center">
    <div class="q-pb-md">
      <span v-html="$t('trash.trashAction.notes',{modifyTime:timeAgo({ dateTime:model.modifyTime?model.modifyTime.replace(/-/g, '/'):''})} )" />
    </div>
    <div>
      <span>{{$t('trash.trashAction.youCan')}} </span>
      <a
        href="javascript:void(0);"
        @click="$emit('showContent')"
      >{{$t('trash.trashAction.viewIt')}}</a>
      <span> {{$t('trash.trashAction.or')}} </span>
      <a
        href="javascript:void(0);"
        @click="$emit('shareDraft')"
      >{{$t('trash.trashAction.restoreIt')}}</a>
    </div>
  </q-banner>
</template>
<script>
import timeAgo from '@/utils/time-ago'
export default {
  name: 'TrashTip',
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
  methods: {
    timeAgo,
    edit () {
      let name = this.type === 'document' ? `${this.model.classify}Edit` : `${this.type}Edit`
      if (this.model.extension === 'markmap') {
        name = 'markmapEdit'
      }
      this.$router.push({
        name: name,
        params: {
          id: this.model.id,
          category: this.model.objectType,
          objectID: this.model.objectID
        }
      })
    },
    backMyDrafts () {
      this.$router.go(-1)
    }
  }
}
</script>
