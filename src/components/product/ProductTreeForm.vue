<template>
  <div>
    <q-card
      flat
      bordered
      class="q-pa-md"
    >
      <q-form
        autofocus
        @submit.enter="onSubmit"
        class="q-gutter-md"
      >
        <q-input
          autofocus
          filled
          v-model="title"
          :label="$t('product.fields.title')"
          lazy-rules
          :rules="[val => val !== null && val !== '' || $t('product.noBlank')]"
        />
        <div>
          <q-btn
            rounded
            :label="$t('action.confirm')"
            type="submit"
            color="primary"
            class="q-px-sm"
          />
          <q-btn
            rounded
            outline
            :label="$t('action.cancel')"
            color="primary"
            class="q-ml-md q-px-sm"
            @click="onReset"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Product from '@/store/product/model'
export default {
  name: 'ProductTreeForm',
  props: {
    model: { type: Object, required: true },
    openType: { type: String, required: true }
  },
  data () {
    return {
      title: null
    }
  },
  methods: {
    ...mapActions('product', ['addProduct', 'updateProduct']),
    onSubmit () {
      this.save()
    },
    onReset () {
      this.title = null
      this.$emit('update:showForm', false)
    },
    save () {
      let fields = {}
      if (this.openType === 'add') {
        fields = Product.additional(this.model.classification, {
          title: this.title,
          level: this.model.level + 1,
          parentId: this.model.id,
          path: this.model.path ? `${this.model.path},` : ''
        })
        this.addProduct(fields)
      } else {
        Object.assign(this.model, { title: this.title })
        this.updateProduct(this.model)
      }
      this.$emit('update:showForm', false)
    }
  },
  created () {
    if (this.openType !== 'add') {
      this.title = this.model.title
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
