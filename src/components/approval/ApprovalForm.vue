<template>
  <tw-form
    v-if="template&&template.formFields"
    :primaryLabel="$t('approval.module')"
    @primary="onSubmit"
  >
    <tw-approval-form
      filled
      :property.sync="template"
    />
    <approver-userlist-panel
      class="q-px-lg"
      :approver.sync="approver"
      :notifyer.sync="notifyer"
    />
  </tw-form>
  <div v-else>
    <q-spinner-dots
      color="primary"
      size="40px"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ApprovalForm',
  props: {
    templateId: {
      type: String,
      require: true,
      default: '1970325122023546_1688850915300868_999587701_1499158576'
    }
  },
  data () {
    return {
      template: null,
      approver: [],
      notifyer: []
    }
  },
  computed: {
    appro: {
      get () {
        return {
          creator_userid: this.$myinfo.weChat,
          template_id: this.templateId,
          use_template_approver: 0,
          approver: _.map(_.cloneDeep(this.approver), a => { return { attr: 1, userid: [a.userid] } }),
          notifyer: _.map(_.cloneDeep(this.notifyer), a => a.userid),
          notify_type: 1,
          apply_data: { contents: _.map(this.template.formFields.template_content.controls, 'property') },
          summary_list: []
        }
      }
    }
  },
  created () {
    this.loadTemplateForm({ templateId: this.templateId }).then(() => {
      this.template = this.$store.getters['approval/template'](this.templateId)
    })
  },
  methods: {
    ...mapActions('approval', ['loadTemplateForm', 'sendApplyEvent']),
    onSubmit () {
      if (this.$myinfo.weChat) {
        this.sendApplyEvent(this.appro)
      } else {
        console.log(this.$myinfo.weChat + '未加入企业微信')
      }
    }
  },
  components: {
    TwApprovalForm: () => import('components/approval/temp/TwApprovalForm'),
    ApproverUserlistPanel: () => import('components/contacts/wechat/ApproverUserlistPanel'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped lang="scss">
</style>
