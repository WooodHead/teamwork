<template>
  <q-card :class="{ 'q-px-md min-width': $q.screen.gt.sm }">
    <!-- 头部信息 -->
    <modal-header>{{headerTitle}}</modal-header>
    <q-card-section>
      <q-list class="items-center">
        <!-- 初始化已有项 -->
        <q-draggable-tree
          v-model="treeData"
          :data="treeData"
          group="selectEdit"
          rowKey="id"
          class="padding-none"
        >
          <template v-slot:body="{ item }">
            <option-item
              :data="item"
              :withIcon="withIcon"
              :withDictKey="withDictKey"
            />
          </template>
        </q-draggable-tree>
        <!-- 新建输入区域 -->
        <option-item
          @cancelEdit="isAdd=false"
          @editEdit="isAdd=false"
          :data="newData"
          :withIcon="withIcon"
          :withDictKey="withDictKey"
          v-if="isAdd"
        />
      </q-list>
      <q-btn
        class="q-mt-md"
        rounded
        outline
        color="primary"
        :label="btnLabel"
        v-show="!isAdd"
        @click="isAdd=true"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import Dictionary from '@/store/dictionary/model'
import { mapActions } from 'vuex'
export default {
  name: 'OptionsEdit',
  props: {
    selectOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    module: {
      type: String,
      required: true,
      description: '类型：项目类型、公告类型，例如：project、notice'
    },
    field: {
      type: String,
      required: true,
      description: '加载具体模块下面的具体类型，例如：level、type'
    },
    withIcon: {
      type: Boolean,
      default: false
    },
    withDictKey: {
      type: Boolean,
      default: false
    },
    keys: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isAdd: false,
      // keys从父组件传入，避免两处都赋相同值
      // keys: ['type', 'level', 'delivery', 'trade', 'energyConsume'],
      newData: new Dictionary({ module: this.module, field: this.field }),
      fromOption: {},
      options: this.selectOptions
    }
  },
  mounted () {
    if (this.selectOptions.length === 0) {
      this.isAdd = true
    }
  },
  methods: {
    ...mapActions('dictionary', ['dragDictionaryOrder'])
  },
  computed: {
    headerTitle () {
      let findKey = _.find(this.keys, item => { return this.field.toLowerCase().includes(item.toLowerCase()) })
      return this.$t('dictionary.' + findKey + '')
    },
    btnLabel () {
      let findKey = _.find(this.keys, item => { return this.field.toLowerCase().includes(item.toLowerCase()) })
      if (!findKey) {
        return this.$t('dictionary.defaultAddTitle')
      } else {
        return this.$t('dictionary.add') + this.$t('dictionary.' + findKey + '')
      }
    },
    treeData: {
      get () {
        return _.map(this.options, item => {
          item.label = item.dictValue
          return item
        })
      },
      set (newOptions) {
        this.options = newOptions
        let orderData = []
        _.forEach(newOptions, function (option, index) {
          if (+index !== +option.orderNumber) {
            orderData.push({
              ID: option.id,
              OrderNumber: index
            })
          }
        })
        this.dragDictionaryOrder({
          module: this.module,
          field: this.field,
          orderData: JSON.stringify(orderData)
        })
      }
    }
  },
  watch: {
    selectOptions (newVal, oldVal) {
      this.options = newVal
    }
  },
  components: {
    ModalHeader: () => import('components/base/TwDialogHeader'),
    OptionItem: () => import('components/base/select-edit/OptionItem'),
    QDraggableTree: () => import('components/base/q-draggable-tree/QDraggableTree')
  }
}
</script>

<style lang="scss" scoped>
.min-width {
  min-width: 500px;
}
/deep/.q-tree__node,
.padding-none {
  padding: 0 !important;
}
/deep/.row.q-treeview-node__root > div {
  width: 100%;
}
</style>
