// user guide
// 单选 <manufacturer-select :value.sync="selectId" />
// 多选 <manufacturer-select :value.sync="selectIds" multiple />
<template>
  <q-select
    v-model="newModel"
    dropdown-icon="arrow_drop_down"
    :label="label"
    :multiple="multiple"
    :use-chips="multiple"
    :outlined="outlined"
    :filled="filled"
    :standout="standout"
    :dense="dense"
    :stack-label="stackLabel"
    :readonly="readonly"
    :disable="disable"
    :lazy-rules="lazyRules"
    :rules="rules"
    hide-bottom-space
    v-add-click
    use-input
  >
    <template v-slot:selected-item="scope">
      <div
        v-if="!multiple"
        class="ellipsis"
      >{{ scope.opt.title}}</div>
      <q-chip
        v-else
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="grey-3"
        text-color="grey-9"
      >
        {{ scope.opt.title }}
      </q-chip>
    </template>

    <template v-slot:default>
      <q-dialog
        v-model="showDialog"
        :position="position"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <manufacturer-select-panel
          :multiple="multiple"
          :value.sync="value"
          :style="dialogStyle"
          @selected-event="selectedEvent"
        />
      </q-dialog>
    </template>
  </q-select>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ManufacturerSelect',
  components: {
    ManufacturerSelectPanel: () => import('components/manufacturer/ManufacturerSelectPanel')
  },
  directives: {
    addClick: {
      inserted (el, binding, vnode) {
        el.querySelector('.q-field__control').addEventListener('click', () => {
          vnode.context.showDialog = true
        })
      }
    }
  },
  props: {
    value: { type: [Number, Array], desc: '选中的生产单位，单选传number，多选传number数组' },
    label: { type: String, default: '选择生产单位', desc: 'select标签' },
    position: { type: String, default: 'standard', desc: '弹出窗口位置' },
    multiple: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    stackLabel: { type: Boolean, default: false },
    filled: { type: Boolean, default: false },
    standout: { type: Boolean, default: false },
    disable: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    lazyRules: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] }
  },
  data () {
    return {
      showDialog: false,
      newModel: null,
      dialogStyle: {
        height: '80vh',
        maxHeight: '80vh',
        width: '850px',
        maxWidth: '850px'
      }
    }
  },
  methods: {
    ...mapActions('manufacturer', ['loadManufacturer', 'loadManufacturers']),
    selectedEvent (payload) {
      this.newModel = payload
      if (this.multiple) {
        this.$emit('update:value', payload.map(p => p.id))
      } else {
        this.$emit('update:value', payload.id)
      }
      this.$emit('selected-event', payload)
      this.showDialog = false
    },
    init () {
      // 如果有初始选中项，获取相应数据
      if (this.multiple) {
        let query = [
          { Key: 'Id', Value: this.value.join(','), Oper: 'in' }
        ]
        this.loadManufacturers({ query, byPage: false })
          .then(res => {
            this.newModel = res
          })
      } else {
        !isNaN(this.value) && this.loadManufacturer(this.value)
          .then(res => {
            this.newModel = res
          })
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    value (val) {
      this.init()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
