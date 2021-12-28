<template>
  <tw-form @primary="onSubmit">
    <div>
      <q-input filled v-model="model.title" label="标题"> </q-input>
    </div>
    <div class="q-gutter-sm">
      <q-radio
        v-model="model.contactForm"
        v-for="(cy, index) in classifys"
        :key="index + cy"
        dense
        :val="cy.val"
        :label="cy.label"
      />
    </div>
    <!-- 跟进日期 -->
    <q-input
      filled
      v-model="model.followupDate"
      :label="$t('followup.followupDate')"
      mask="date"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :value="model.followupDate"
              @input="
                val => {
                  model.followupDate = val;
                  $refs.qDateProxy.hide();
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
      :options="clientOptions"
      v-model="clientModel"
      option-value="id"
      option-label="name"
      use-input
      use-chips
      stack-label
      :label="$t('followup.customerContacter')"
    />
    <!-- 参与人 -->
    <q-select
      filled
      multiple
      :options="memberOptions"
      v-model="memModel"
      option-value="id"
      option-label="name"
      use-chips
      stack-label
      label="参与人"
    />
    <!-- 跟进内容 -->
    <quasar-editor
      :focus="false"
      :value="oldContent"
      :placeholder="$t('followup.addContent')"
      :folder="category"
      :applied="goIntoAction"
      @input="
        val => {
          model.content = val;
        }
      "
      class="col-12"
    ></quasar-editor>
  </tw-form>
</template>

<script>
import { showWarningMessage } from '@/utils/show-message'
import { mapActions } from 'vuex'
import Followup from '@/store/followup/model'
import Customer from 'src/store/customer/model'
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
      date: '',
      goIntoAction: false,
      oldContent: '',
      classify: '电话',
      classifys: this.$store.state.followup.contactForm,
      model: new Followup(),
      customer: new Customer(),
      clientModel: null, // 客户联系人下拉框v-model属性用
      clientOptions: [], // 客户联系人下拉框数据源
      memModel: null, // 参与人下拉框v-model属性用
      memberOptions: []// 参与人下拉框数据源
    }
  },
  created () {
    this.loadCustomer(+this.objectID).then(res => {
      this.customer = res
      // 给客户联系人下拉框绑定数据源
      let clientPson = res.membersObject.client
      let selectPersons = this.$store.state.person.selectPersons
      const persons = _.map(clientPson, p => selectPersons[p])
      persons.forEach(item => {
        this.clientOptions.push({
          id: item.id,
          name: item.name
        })
      })
      // 给参与人下拉框绑定数据源
      const psons = _.map(this.customer.membersObject.member, p => selectPersons[p])
      psons.forEach(item => {
        this.memberOptions.push({
          id: item.id,
          name: item.name
        })
      })
    })

    if (this.openType === 'edit') {
      this.loadFollowup(this.id).then(res => {
        if (res) {
          this.oldContent = res.content
          this.model = res

          let selectPersons = this.$store.state.person.selectPersons
          let arr = JSON.parse(this.model.members).member
          const persons = _.map(arr, p => selectPersons[p])
          persons.forEach(item => {
            this.memModel.push({
              id: item.id,
              name: item.name
            })
          })

          Object.keys(selectPersons).forEach(key => {
            if (this.model.customerContacter === +key) {
              this.clientModel = {
                'id': this.model.customerContacter, 'name': selectPersons[+key].name
              }
            }
          })
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
    /** 保存 */
    onSubmit () {
      if (!this.model.content && this.model.content.length === 0) {
        showWarningMessage(this.$t('followup.addContent'))
        return
      }
      this.model.objectType = this.$router.history.current.params.category
      this.model.objectID = this.$router.history.current.params.objectID
      let arrNew = []
      this.memModel.forEach(item => {
        arrNew.push(item.id)
      })
      this.model.members = arrNew
      if (this.openType === 'add') {
        this.addFollowup(this.model)
      } else {
        // 更新
        this.updateFollowup(this.model)
      }
      this.$emit('ok')
    },
    /** 取消 */
    onCancel () {
      this.$nextTick(() => {
        this.$emit('cancel')
      })
    },
    // 清除日期
    CleanDate () {
      this.date = ''
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped></style>
