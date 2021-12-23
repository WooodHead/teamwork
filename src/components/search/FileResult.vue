
<template>
  <div>
    <a
      href="javascript:void(0);"
      class="cursor-pointer"
      title="下载文件时您的ip会被记录，请安全阅读~"
      @click="download(file.url)"
    >{{title}}</a>
  </div>
</template>
<script>
import { download } from '@/boot/file'
export default {
  props: {
    file: {
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
      return '附件: "' + this.file.title + '"'
    }
  },
  components: {
  },
  methods: {
    download,
    toDetail (model) {
      this.$router.push({
        name: 'fileDetail',
        params: {
          category: model.objectType,
          objectID: +model.objectId,
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
