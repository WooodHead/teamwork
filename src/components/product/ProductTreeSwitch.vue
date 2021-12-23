<template>
  <!-- 加上click.stop阻止向上冒泡，从而防止触发面包屑回退 -->
  <div @click.stop="()=>{}">
    <!-- 筛选 -->

    <q-input
      style="position:sticky;top:0;"
      ref="filter"
      outlined
      dense
      v-model="filter"
      :label="$t('product.search')"
      class="z-top q-pa-sm bg-white"
    >
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>

    <q-card-section class="q-pt-none">
      <div class="text-center">
        <q-spinner
          v-if="showSpinner"
          class="loading-spinner"
          color="primary"
          size="3em"
        />
      </div>

      <q-tree
        v-if="!showSpinner&&nodes&&nodes.length"
        :nodes="nodes"
        :filter="filter"
        :selected="selected"
        default-expand-all
        node-key="id"
        label-key="title"
        ref="qTree"
      >
        <template v-slot:default-header="prop">
          <div
            class="fit row items-center"
            @click.stop="selectedEvent(prop)"
          >
            <div>{{ prop.node.title }}</div>

            <div
              v-if="!withoutBtns&&$myinfo.auth.role.isProductManager&&!showForm&&prop.node.id===selected"
              class="q-ml-sm"
            >
              <div class="row justify-center q-gutter-sm">
                <q-icon
                  v-if="prop.node.tplCode!==''"
                  name="add"
                  color="positive"
                  :title="$t('action.add')"
                  @click.stop="onEvent('add', prop)"
                />
                <q-icon
                  name="edit"
                  color="primary"
                  :title="$t('action.edit')"
                  @click.stop="onEvent('edit', prop)"
                />
                <q-icon
                  name="delete"
                  color="negative"
                  :title="$t('action.delete')"
                  @click.stop="onEvent('delete', prop)"
                />
              </div>
            </div>
          </div>
        </template>

        <template v-slot:default-body="prop">
          <product-tree-form
            v-if="showForm&&prop.node.id===selected"
            :showForm.sync="showForm"
            :model="model"
            :openType="openType"
          />
        </template>
      </q-tree>
    </q-card-section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { listToTreeStable } from '@/utils/list-to-tree'
import { showConfirm } from '@/utils/show-confirm'
export default {
  name: 'ProductTreeSwitch',
  components: {
    ProductTreeForm: () => import('components/product/ProductTreeForm')
  },
  props: {
    levelHidden: { type: Number, default: 0, desc: '此层级及以下全部隐藏' },
    levelDisabled: { type: Array, default: () => [], desc: '禁用这些层级' },
    withoutBtns: { type: Boolean, default: false, desc: '是否不显示增删改操作按钮' }
  },
  data () {
    return {
      classification: '',
      filter: '',
      selected: this.$route.params.id,
      showForm: false,
      openType: 'add',
      model: {},
      showSpinner: true
    }
  },
  watch: {
    filter (newVal, oldVal) {
      newVal !== '' && this.$refs.qTree.expandAll()
    }
  },
  computed: {
    ...mapGetters('product', ['productTree']),
    nodes () {
      return listToTreeStable(this.productTree)
    }

  },
  methods: {
    ...mapActions('product', ['loadProductTree', 'deleteProduct']),
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    selectedEvent (prop) {
      this.selected = prop.node.id
      this.model = prop.node

      this.$emit('selected-event', prop.node)
    },
    onEvent (actionName, prop) {
      this.model = prop.node
      switch (actionName) {
        case 'add':
          if (this.model.tplCode === 'Default') {
            this.openType = 'add'
            this.showForm = true
          } else {
            this.$emit('close-product-tree')
            this.$nextTick().then(() => {
              this.$router.push({
                name: 'productAdd',
                params: { id: this.model.id }
              })
            })
          }
          break
        case 'edit':
          if (this.model.tplCode !== '') {
            this.openType = 'edit'
            this.showForm = true
          } else {
            this.$emit('close-product-tree')
            this.$nextTick().then(() => {
              this.$router.push({
                name: 'productEdit',
                params: { openType: 'edit', id: this.model.id }
              })
            })
          }
          break
        case 'delete':
          let message = this.$t('message.reallyDelete')
          if (this.model.children && this.model.children.length > 0) {
            message = '当前产品下有子产品，确定要删除吗？'
          }
          showConfirm(message,
            () => {
              this.deleteProduct(this.model.id)
                .then(() => {
                  this.$router.push({
                    name: 'productDetail',
                    params: { id: this.model.parentId || this.model.classification }
                  })
                })
            },
            () => { }
          )
          break
      }
    }
  },
  mounted () {
    this.loadProductTree()
      .then(res => {
        this.showSpinner = false
        this.expanded = res.map(p => p.id)
      })
  }
}
</script>

<style lang='scss' scoped>
</style>
