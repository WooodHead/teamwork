<template>
  <tw-form @primary="onSubmit">
    <form-fields
      :openType="openType"
      :model="model"
    >
    </form-fields>
  </tw-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Manufacturer from '@/store/manufacturer/model'
export default {
  name: 'ManufacturerEdit',
  components: {
    FormFields: () => import('components/manufacturer/FormFields'),
    TwForm: () => import('components/base/TwForm')
  },
  props: {
    id: { type: [String, Number], default: 0 },
    openType: { type: String, default: 'add' }
  },
  data () {
    return {
      model: new Manufacturer()
    }
  },
  computed: {
    ...mapGetters('person', ['selectPersonsSorted']),
    widgets () {
      return this.$store.getters['resource/initWidgets']('manufacturer')
    }
  },
  methods: {
    ...mapActions('manufacturer', ['loadManufacturer', 'addManufacturer', 'updateManufacturer']),
    ...mapActions('person', ['loadSelectPersons']),
    ...mapActions('resource', ['loadCategory']),
    onSubmit () {
      let actionName = {
        add: 'addManufacturer',
        edit: 'updateManufacturer'
      }
      this[actionName[this.openType]](this.model)
        .then(res => {
          if (res) {
            this.$router.push({
              name: 'manufacturerDetail',
              params: { id: res.id }
            })
          }
        })
    }
  },
  mounted () {
    if (this.openType !== 'add') {
      this.loadManufacturer(+this.id)
        .then(res => {
          this.model = res
        })
    } else {
      // 新建，添加工具包
      if (Object.keys(this.widgets).length) {
        this.model.widgets = this.widgets
      } else {
        this.loadCategory('manufacturer').then(category => {
          this.model.widgets = this.widgets
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
