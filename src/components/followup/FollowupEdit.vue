<template>
  <tw-form @primary="onSubmit">
    <div class="row q-col-gutter-sm">

      <!-- 跟进方式 -->
      <div class="col-12 q-gutter-md q-pa-sm">
        <q-radio
          v-model="model.contactForm"
          v-for="(cy, index) in classifys"
          :key="index + cy"
          dense
          :val="cy.val"
          :label="cy.label"
        />
      </div>

      <!-- 标题 -->
      <q-input
        filled
        class="col-12"
        v-model="model.title"
        label="标题"
        :rules="[(val) => val && val.length > 0 || '请输入标题']"
        hide-bottom-space
      />

      <!-- 跟进日期 -->
      <q-input
        filled
        class="col-12"
        v-model="model.followupDate"
        :label="$t('followup.followupDate')"
        mask="date"
      >
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                :value="model.followupDate"
                @input="
                (val) => {
                  model.followupDate = val
                  $refs.qDateProxy.hide()
                }
              "
                minimal
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- 客户联系人 -->
      <q-select
        filled
        class="col-12"
        v-model="model.customerContacter"
        :options="clients"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        stack-label
        :label="$t('followup.customerContacter')"
      />

      <!-- 参与人 -->
      <q-select
        filled
        multiple
        class="col-12"
        v-model="model.members"
        :options="members"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        use-chips
        stack-label
        label="参与人"
      />

      <!-- 跟进内容 -->
      <quasar-editor
        :focus="false"
        :folder="category"
        class="col-12"
        :value="oldContent"
        :placeholder="$t('followup.addContent')"
        :applied="goIntoAction"
        @input="val => {model.content = val}"
      ></quasar-editor>

    </div>
  </tw-form>
</template>

<script>
import { showWarningMessage } from '@/utils/show-message'
import { mapActions } from 'vuex'
import Followup from '@/store/followup/model'
export default {
  name: 'FollowupEdit',
  props: {
    // 新建编辑跟进人ID
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    openType: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      goIntoAction: false,
      classifys: this.$store.state.followup.contactForm,
      oldContent: '',
      clientIds: [],
      memberIds: [],
      model: new Followup()
    }
  },
  computed: {
    clients () {
      let clients = []
      if (_.isArray(this.clientIds) && this.clientIds.length) {
        clients = _.map(this.clientIds, (p) => this.$store.state.person.selectPersons[p])
      }
      return clients
    },
    members () {
      let members = []
      if (_.isArray(this.memberIds) && this.memberIds.length) {
        members = _.map(this.memberIds, (p) => this.$store.state.person.selectPersons[p])
      }
      return members
    }
  },
  created () {
    // 给客户联系人下拉框绑定数据源
    let cateType = this.category.charAt(0).toUpperCase() + this.category.substring(1, this.category.length)
    if (this.category === 'customer') {
      this.loadCustomer(+this.objectID).then((res) => {
        this.clientIds = res.membersObject.client
      })
    } else {
      this.category &&
        this.objectID &&
          this.$store
            .dispatch(`${this.category}/load${cateType}`, +this.objectID)
            .then((res) => {
              this.loadCustomer(+res.customerID).then((res) => {
                this.clientIds = res.membersObject.client
              })
            })
    }

    // 给参与人下拉框绑定数据源
    this.category &&
      this.objectID &&
        this.$store
          .dispatch('member/loadMembers', {
            category: this.category,
            objectID: +this.objectID,
            types: 'leader,member,visitor'
          })
          .then((ids) => {
            this.memberIds = ids
          })

    if (this.openType === 'edit') {
      this.loadFollowup(this.id).then((res) => {
        if (res) {
          this.model = _.clone(res)
          this.oldContent = this.model.content
        }
      })
    }
  },
  methods: {
    ...mapActions('followup', [
      'loadFollowup',
      'addFollowup',
      'updateFollowup'
    ]),
    ...mapActions('customer', ['loadCustomer']),
    ...mapActions('member', ['loadMembers']),
    /** 保存 */
    onSubmit () {
      this.goIntoAction = true
      if (!this.model.content && this.model.content.length === 0) {
        showWarningMessage(this.$t('followup.addContent'))
        return
      }
      this.model.objectType = this.category
      this.model.objectID = this.objectID
      if (this.openType === 'add') {
        this.addFollowup(this.model).then(res => { if (res) this.routerJump(res) })
      } else {
        this.updateFollowup(this.model).then(res => { if (res) this.routerJump(res) })
      }
    },
    routerJump (followup) {
      this.$router.push({
        name: 'followupDetail',
        params: { category: this.category, objectID: this.objectID, id: followup.id }
      })
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped></style>
