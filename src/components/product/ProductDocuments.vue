<template>
  <div>
    <div class="relative-position row items-center text-subtitle1 q-pt-md">
      <q-separator class="col gradient-right-to-left" />
      <span class="q-px-md">产品文档</span>
      <q-separator class="col gradient-left-to-right" />
      <span class="absolute-right q-pt-md">
        <folder-add-menu
          v-if="$myinfo.auth.role.isProductManager"
          category="product"
          :objectID="productId"
          :excludeMenus="['folder']"
          :unelevated="false"
          :rounded="false"
          :round="true"
          :flat="true"
          :dense="true"
          label=""
          title="新建"
          textColor="secondary"
          class="q-mr-md"
        />
      </span>
    </div>

    <folder-content
      category="product"
      :objectID="productId"
      class="q-mt-md"
      @hook:mounted="initMounted"
      ref="folderContent"
    />
  </div>
</template>

<script>
export default {
  name: 'ProductDocuments',
  props: {
    productId: { type: Number, required: true }
  },
  components: {
    FolderAddMenu: () => import('components/document/folder/FolderAddMenu'),
    FolderContent: () => import('components/document/folder/FolderContent')
  },
  data () {
    return {
      triggered: false
    }    
  },
  watch: {
    productId: {
      handler () {
        if (this.$refs.folderContent) {
          this.triggered = true
          this.$refs.folderContent.restart()
        }
      },
      immediate: true
    }
  },
  methods: {
    initMounted () {
      !this.triggered && this.$refs.folderContent.restart()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
