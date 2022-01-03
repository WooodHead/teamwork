<template>
  <tw-form @primary="onSubmit">
    <form-fields
      :openType="openType"
      :model="model"
    ></form-fields>
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
import Customer from '@/store/customer/model'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'CustomerEdit',
  props: {
    id: {
      type: [String, Number],
      default: 0
    },
    openType: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      model: new Customer()
    }
  },
  mounted () {
    // 编辑页获取数据
    if (this.openType === 'edit') {
      this.loadCustomer(+this.id).then(res => {
        this.model = res
      })
    } else if (this.openType === 'add') {
      // 新建客户，添加工具包
      if (Object.keys(this.widgets).length) {
        this.model.widgets = this.widgets
      } else {
        this.loadCategory('customer').then(category => {
          this.model.widgets = this.widgets
        })
      }
    }
  },
  computed: {
    widgets () {
      return this.$store.getters['resource/initWidgets']('customer')
    }
  },
  methods: {
    ...mapActions('customer', ['loadCustomer', 'addCustomer', 'editCustomer']),
    ...mapActions('resource', ['loadCategory']),
    onSubmit () {
      if (!this.model.title && this.model.title.length === 0) {
        showWarningMessage(this.$t('customer.rules.title'))
        return
      }
      window.RichTextEditting = false
      if (!this.model.isOutCustomer && this.model.selfOrganizeID) {
        let currOrg = this.$store.state.organize.selectOrganizes[this.model.selfOrganizeID]
        this.model.title = currOrg.name
        this.model.customerType = currOrg.type
      }
      this[`${this.openType}Customer`](this.model).then(res => {
        this.$router.push({
          name: 'customerDetail',
          params: { id: res.id }
        })
      })
    }
  },
  components: {
    FormFields: () => import('components/customer/FormFields'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped>
</style>
