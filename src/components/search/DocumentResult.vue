<!--
 * @Author: your name
 * @Date: 2020-09-21 16:43:16
 * @LastEditTime: 2020-10-13 09:22:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\components\search\DocumentResult.vue
-->

<template>
  <div>
    <a
      class="text-primary text-weight-bold "
      href="javascript:void(0);"
      @click="toDetail(document)"
    >{{title}}</a>
    <div
      v-html="document.content"
      class="q-mt-sm bg-grey-1 tiptap-content editor__content"
    >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    document: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      Object: ''
    }
  },
  computed: {
    title () {
      if (this.document.classify === 'folder') {
        return '文件夹: "' + this.document.title + '"'
      } else {
        return '文档: "' + this.document.title + '"'
      }
    }
  },
  components: {
  },
  methods: {
    toDetail (model) {
      let name = ''
      if (model.classify === 'doc') {
        name = 'docDetail'
      } else if (model.classify === 'file') {
        name = 'fileDetail'
      } else if (model.classify === 'folder') {
        name = 'folder'
      }
      this.$router.push({
        name: name,
        params: {
          category: model.objectType,
          objectID: +model.objectID,
          id: +model.id
        }
      })
    }
  },
  mounted () {
  }
}

</script>

<style lang='stylus' scoped></style>
