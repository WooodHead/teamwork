
<template>
  <div>
    <a
      class="text-primary text-weight-bold "
      href="javascript:void(0);"
      @click="toDetail(product)"
      v-html="product.title"
    ></a>
    <div
      v-html="product.notes"
      class="q-mt-sm bg-grey-1 tiptap-content editor__content"
    >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  computed: {

  },
  components: {
  },
  methods: {
    toDetail (model) {
      this.$router.push({
        name: 'productDetail',
        params: {
          category: model.objectType,
          objectID: +model.objectId
        }
      })
    }
  },
  mounted () {
  }
}

</script>

<style lang='stylus' scoped></style>
