<template>
  <q-card
    :flat="$q.screen.lt.sm"
    :class="['card-grow-in-page', {'q-pa-xl':!$q.screen.lt.sm}]"
  >
    <!-- 审批头部操作区 -->
    <approval-header
      v-if="message&&Object.keys(message.extra).length"
      :category="category"
      :objectID="objectID"
      :type="type"
      :EventGuid="message.extra.EventGuid"
      :WFGuid="message.extra.WF_Guid"
      :done="!!message.done"
      :WFResult="message.extra.WF_Result"
    />

    <!-- 审批的内容区 -->
    <q-card-section>
      <content-deadline
        :type="type"
        :documents="documents"
        :notes="model.approvalNotes&&model.approvalNotes[`${type}Notes`]"
        :date="type === 'start' ? model.beginDate : model.endDate"
      >
        <template #content>
          <project-content
            v-if="$custom.isJDXAStyleOfProjectManage &&
            category==='project' && type==='start'"
            :classify="model.classify ||''"
            :saled="model.saled"
            :id="+objectID"
          />
        </template>
      </content-deadline>
    </q-card-section>
    <!-- 审批的详情页区 -->
    <q-card-section>
      <project-detail
        v-if="category==='project'"
        :id="+objectID"
      />
      <product-dev-detail
        v-if="category==='productDev'"
        :id="+objectID"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'DeadlineApproval',
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
      required: true,
      default: 'start',
      description: '立项/结项类型:start、finish'
    }
  },
  data () {
    return {
      documents: [],
      message: { extra: {} },
      tag: {
        'project-start': 'PROJECT_APPROVAL',
        'project-finish': 'PROJECT_DONE',
        'productDev-start': 'PRODUCT_DEV_APPROVAL',
        'productDev-finish': 'PRODUCT_DEV_DONE'
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    model () {
      return this.$store.getters[`${this.category}/${this.category}`](+this.objectID) || { approvalNotes: {} }
    },
    rdModule () {
      const { objectID, category } = this
      return { objectID, category }
    }
  },
  watch: {
    rdModule () {
      this.init()
    }
  },
  methods: {
    ...mapActions('message', ['loadMessageBy']),
    ...mapActions('document', ['loadTagDocument']),
    init () {
      this.$store.dispatch(`${this.category}/load${capitalize(this.category)}`, +this.objectID)

      let query = [{ 'Key': 'Route.Path', 'Value': this.$route.path, 'Oper': 'eq' },
        'and', { 'Key': 'ReceiveBy', 'Value': _.toString(this.$myinfo.id), 'Oper': 'search' },
        'and', { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }]
      this.loadMessageBy({ query }).then(res => {
        if (res) {
          this.message = res
        }
      })

      this.loadTagDocument({
        category: this.category,
        objectID: +this.objectID,
        tag: this.tag[`${this.category}-${this.type}`],
        treeLevel: -1
      }).then(res => {
        this.documents = res
      })
    }
  },
  components: {
    ApprovalHeader: () => import('components/approval/ApprovalHeader'),
    ContentDeadline: () => import('components/approval/ContentDeadline'),
    ProjectDetail: () => import('components/project/ProjectDetail'),
    ProductDevDetail: () => import('components/product-dev/ProductDevDetail'),
    ProjectContent: () => import('components/approval/ProjectContent')
  }
}
</script>

<style lang="scss" scoped>
</style>
