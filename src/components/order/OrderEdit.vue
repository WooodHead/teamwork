<template>
  <tw-form @primary="onSubmit">
    <form-fields
      :openType="openType"
      :model.sync="model"
      ref="formFields"
    ></form-fields>
  </tw-form>
</template>

<script>
import { mapActions } from 'vuex'
import Order from '@/store/order/model'
export default {
  name: 'OrderEdit',
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
      model: new Order()
    }
  },
  computed: {
    widgets () {
      return this.$store.getters['resource/initWidgets']('order')
    }
  },
  created () {
    if (this.openType === 'edit') {
      this.loadOrder(this.id).then(res => {
        if (res) {
          this.model = _.clone(res)
        }
      })
    } else {
      let query = this.getQuery()
      if (query) {
        if (query.opportunityID) {
          this.model.opportunityID = +query.opportunityID
        }
        if (query.customerID) {
          this.model.customerID = +query.customerID
        }
      }
      if (Object.keys(this.widgets).length) {
        this.model.widgets = this.widgets
      } else {
        this.loadCategory('order').then(category => {
          this.model.widgets = this.widgets
        })
      }
    }
  },
  methods: {
    ...mapActions('opportunity', ['refreshOpportunity']),
    ...mapActions('order', ['loadOrder', 'addOrder', 'updateOrder']),
    ...mapActions('resource', ['loadCategory']),
    onSubmit () {
      if (this.openType === 'add') {
        this.addOrder(this.model).then(res => {
          if (res) {
            this.refreshOpportunity(res.opportunityID)
            this.routerJump(res.id)
          }
        })
      } else {
        this.updateOrder(this.model)
        this.routerJump(this.id)
      }
    },
    routerJump (id) {
      this.$router.push({
        name: 'orderDetail',
        params: { id: Number(id) }
      })
    },
    getQuery () {
      var url = decodeURI(window.location.href)
      var res = {}
      var urlData = _.split(url, '?').length > 1 ? _.split(url, '?')[1] : null
      if (!urlData) return null
      var paramsArr = _.split(urlData, '&')
      _.forEach(paramsArr, function (item) {
        var key = _.split(item, '=')[0]
        var value = _.split(item, '=')[1]
        res[key] = value
      })
      return res
    }
  },
  components: {
    FormFields: () => import('components/order/FormFields'),
    TwForm: () => import('components/base/TwForm')
  }
}
</script>

<style scoped>
</style>
