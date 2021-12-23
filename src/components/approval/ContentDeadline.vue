<template>
  <q-card class="borderLine q-pa-lg">
    <slot name="content"></slot>
    <div>
      <span class="text-grey-7">{{type==='start'?$t('approval.approvalDate'):$t('approval.finishDate')}}</span>
      <div class="text-subtitle1 q-py-md q-px-lg">{{date}}</div>
    </div>
    <div>
      <span class="text-grey-7">{{type==='start'?$t('approval.startDocument'):$t('approval.finishDocument')}}</span>
      <div class="q-px-lg q-py-md">
        <attach-card
          v-for="doc in documents"
          :key="doc.id"
          :attach="doc"
          simple
        />
      </div>
    </div>
    <div>
      <span class="text-grey-7">{{type==='start'?$t('approval.approvalNotes'):$t('approval.finishNotes')}}</span>
      <div
        class="text-subtitle1 q-py-md q-px-lg"
        style="word-wrap: break-word;white-space:pre-wrap;"
        v-html="notes"
      ></div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'ApprovalDocAndDate',
  props: {
    type: {
      type: String,
      required: true,
      default: 'start',
      description: '立项/结项类型:start、finish'
    },
    documents: {
      type: Array,
      required: false,
      default: () => [],
      description: '文档数组'
    },
    notes: {
      type: String,
      required: false,
      default: '',
      description: '说明'
    },
    date: {
      type: String,
      required: false,
      default: '',
      description: '日期'
    }
  },
  components: {
    AttachCard: () => import('components/attach/AttachCard.vue')
  }
}
</script>

<style lang="scss" scoped>
.borderLine {
  border: 2px dashed rgba(0, 0, 0, 0.15);
}
/deep/.q-item__label {
  line-height: 1.4em !important;
}
</style>
