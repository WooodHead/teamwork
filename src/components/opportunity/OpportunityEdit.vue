<template>
  <tw-form @primary="onSubmit">
    <form-fields
      :openType="openType"
      :model="model"
      ref="formFields"
    ></form-fields>
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
import Opportunity from '@/store/opportunity/model'
export default {
  name: 'OpportunityEdit',
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
      model: new Opportunity()
    }
  },
  computed: {
    widgets () {
      return this.$store.getters['resource/initWidgets']('opportunity')
    }
  },
  created () {
    // 编辑商机
    if (this.openType === 'edit') {
      this.loadOpportunity(this.id).then(res => {
        if (res) {
          this.model = _.clone(res)
        }
      })
    } else {
      // 新建商机，添加工具包
      if (Object.keys(this.widgets).length) {
        this.model.widgets = this.widgets
      } else {
        this.loadCategory('opportunity').then(category => {
          this.model.widgets = this.widgets
        })
      }
    }
  },
  methods: {
    ...mapActions('opportunity', ['loadOpportunity', 'addOpportunity', 'updateOpportunity']),
    ...mapActions('resource', ['loadCategory']),
    onSubmit () {
      window.RichTextEditting = false
      let value = this.$refs.formFields.$refs.selectCustomer.value
      if (value && value > 0) {
        if (this.openType === 'add') {
          this.addOpportunity(this.model).then(res => {
            this.routerArrive(res.id)
          })
        } else {
          this.updateOpportunity(this.model).then(res => {
            this.routerArrive(res.id)
          })
        }
      } else {
        this.$q.notify({ message: '请选择客户', icon: 'warning', color: 'warning' })
      }
    },
    routerArrive (id) {
      this.$router.push({
        name: 'opportunityDetail',
        params: { id: Number(id) }
      })
    }
  },
  components: {
    FormFields: () => import('components/opportunity/FormFields'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style lang="scss" scoped>
</style>
