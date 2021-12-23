<template>
  <q-card-section v-if="!isDone">
    <q-input
      outlined
      dense
      v-model="approvalReason"
      autofocus
      max-height="1rem"
      class="width-full"
      :placeholder="$t('approval.approvalReason')"
    />
    <div class="row q-pt-md q-gutter-x-md">

      <q-btn
        rounded
        color="green"
        :label="$t('approval.pass')"
        @click.stop="debounceSubmit('PASS')"
      />
      <q-btn
        rounded
        :label="$t('approval.reject')"
        color="amber-14"
        @click.stop="debounceSubmit('REJECT')"
      />
      <q-btn
        outline
        rounded
        color="primary"
        :label="$t('approval.showWorkFlow')"
        @click.stop="workFlow"
      />
    </div>
  </q-card-section>
  <q-card-section v-else>
    <q-btn
      unelevated
      rounded
      @click="workFlow"
      :label="$t('approval.showWorkFlow')"
      :icon="[WFResult,result].includes('reject')?'close':'done'"
      :color="[WFResult,result].includes('reject')?'amber-14':'green'"
    />
  </q-card-section>

</template>

<script>
import { mapActions } from 'vuex'
import { showWarningMessage, showSuccessMessage } from '@/utils/show-message'
import { debounce } from 'quasar'
export default {
  name: 'ApprovalHeader',
  props: {
    category: {
      type: String,
      required: true,
      description: '资源类型：如project'
    },
    objectID: {
      type: [Number, String],
      required: true,
      description: '资源Id'
    },
    type: {
      type: String,
      required: false,
      default: '',
      description: '立项/结项类型:start、finish'
    },
    EventGuid: {
      type: String,
      required: true,
      description: 'EventGuid'
    },
    WFGuid: {
      type: String,
      required: true,
      description: 'WF_Guid'
    },
    done: {
      type: Boolean,
      required: true,
      description: 'done'
    },
    WFResult: {
      type: String,
      required: false,
      description: 'WF_Result'
    }
  },
  data () {
    return {
      approvalReason: '',
      isDone: this.done,
      result: '' // 审批驳回或通过
    }
  },
  methods: {
    ...mapActions('workflow', ['approval']),
    debounceSubmit: debounce(function (val) {
      this.onSubmit(val)
    }, 3000, true),
    onSubmit (result) {
      let data = {
        objectType: this.category,
        objectID: +this.objectID,
        event_guid: this.EventGuid,
        wf_guid: this.WFGuid,
        approverID: +this.$myinfo.id,
        comment: this.approvalReason,
        result: result,
        type: this.type
      }
      this.approval(data).then(res => {
        if (res) {
          // 审批通过后，通知调用者
          this.$emit('approvalPassed', this.approvalReason)
          // 审批操作成功：判断审批通过或者驳回
          showSuccessMessage(this.$t('approval.approvalSuccess'))
        } else {
          // 审批操作失败
          showWarningMessage(this.$t('approval.approvalFail'))
        }
      })
      this.isDone = true
      this.result = _.lowerCase(result)
    },
    workFlow () {
      this.$workflow.open(this.WFGuid)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
