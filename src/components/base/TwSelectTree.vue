<template>
  <q-select
    v-model="newModel"
    :label="label || $t('base.selectOrganize')"
    :outlined="outlined"
    :borderless="borderless"
    :hide-dropdown-icon="hideDropdownIcon"
    :rounded="rounded"
    :filled="filled"
    :standout="standout"
    :dense="dense"
    :multiple="multiple"
    :stack-label="stackLabel"
    :use-chips="multiple"
    :readonly="readonly"
    :disable="disable"
    :emit-value="emitValue"
    :map-options="emitValue"
    :lazy-rules="lazyRules"
    :rules="rules"
    :hide-bottom-space="hideBottomSpace"
    class="tw-select-tree"
    v-add-click
    behavior="menu"
  >
    <template
      v-if="!multiple"
      v-slot:selected-item="scope"
    >
      <div class="ellipsis col">{{ scope.opt.length > 0? (scope.opt[0].name || scope.opt[0].title) : ''}}</div>
    </template>
    <template
      v-else
      v-slot:selected-item="scope"
    >
      <q-chip
        removable
        dense
        @remove="onMultipleRemove(scope)"
        :tabindex="scope.tabindex"
        color="grey-3"
        text-color="grey-9"
      >
        {{ scope.opt[labelKey]||scope.opt.name }}
      </q-chip>
    </template>
    <template v-slot:default>
      <q-dialog
        v-model="isShowDialog"
        :position="position"
      >
        <tw-tree
          :nodes="newNodes"
          :node-key="nodeKey"
          :tickStrategy="tickStrategy"
          :label-key="labelKey"
          :multiple="multiple"
          :ticked="newModel.map(m=> m[nodeKey])"
          :selected="newModel.length==0?null:newModel[0][nodeKey]+''"
          @selected-event="getSelected"
        />
      </q-dialog>
    </template>
    <template
      v-if="newModel&&newModel.length&&clear"
      v-slot:append
    >
      <q-icon
        size="xs"
        name="close"
        @click.stop="$emit('reset')"
        class="cursor-pointer"
      />
    </template>
  </q-select>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TwSelectTree',
  props: {
    hideDropdownIcon: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false
    },
    value: {
      required: false
    },
    nodes: {
      type: Array,
      required: false,
      default: () => []
    },
    nodeKey: {
      type: String,
      required: false,
      default: 'value'
    },
    labelKey: {
      type: String,
      required: false,
      default: 'label'
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    tickStrategy: {
      type: String,
      required: false,
      default: 'leaf'
    },
    position: {
      type: String,
      required: false,
      default: 'top'
    },
    emitValue: {
      type: Boolean,
      required: false,
      default: false
    },
    dense: {
      type: Boolean,
      required: false,
      default: false
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false
    },
    borderless: {
      type: Boolean,
      required: false,
      default: false
    },
    rounded: {
      type: Boolean,
      required: false,
      default: false,
      description: 'rounded'
    },
    stackLabel: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      required: false,
      default: false
    },
    standout: {
      type: Boolean,
      required: false,
      default: false
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    clear: {
      type: Boolean,
      required: false,
      default: false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    lazyRules: {
      type: Boolean,
      required: false,
      default: false
    },
    rules: {
      type: Array,
      required: false,
      default: () => []
    },
    hideBottomSpace: {
      type: Boolean,
      required: false,
      default: false
    },
    isOrganize: {
      type: Boolean,
      required: false,
      default: false
    },
    model: { required: false }
  },
  components: {
    'TwTree': () => import('components/base/TwTree')
  },
  computed: {
    ...mapGetters('organize', ['selectOrganizes'])
  },
  directives: {
    addClick: {
      inserted (el, binding, vnode) {
        let that = vnode
        let select = el.querySelector('.tw-select-tree .q-field__control')
        select.addEventListener('click', () => {
          that.context.isShowDialog = true
        })
      }
    }
  },
  data () {
    return {
      isShowDialog: false, // 弹出框是否显示。默认隐藏
      newModel: [],
      newNodes: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 获取选择的项目
    getSelected (selectedOrganizes) {
      var model = !this.isOrganize ? _.map(selectedOrganizes, 'selfOrganizeID') : _.map(selectedOrganizes, 'id')
      this.$emit('update:model', this.multiple ? model : model[0])
      this.isShowDialog = false
    },
    // 初始化数据
    init () {
      var _this = this
      _this.newNodes = _this.nodes
      _this.newModel = !_this.isOrganize ? _.filter(_this.nodes, n => _.isArray(_this.model) ? _this.model.includes(n.selfOrganizeID) : _this.model === n.selfOrganizeID)
        : _.filter(_this.selectOrganizes, n => _.isArray(_this.model) ? _this.model.includes(n.id) : _this.model === n.id)
    },
    onMultipleRemove (scope) {
      let that = this
      _.remove(this.newModel, item => item[that.nodeKey] === scope.opt[that.nodeKey])
      const model = _.map(this.newModel, this.nodeKey)
      this.$emit('update:model', model)
    }
  },
  watch: {
    // 监听传入的model
    model (val) {
      this.init()
    },
    nodes (val) {
      this.init()
    }
  }
}
</script>

<style></style>
