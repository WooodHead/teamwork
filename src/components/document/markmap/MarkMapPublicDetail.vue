<!-- 思维导图分享页面 -->
<template>
  <div>
    <div class="text-h6 text-center text-weight-bold">{{model.title}}</div>
    <mind-map
      :code="model.content"
      :controls="false"
      :title="model.title"
    />
  </div>
</template>

<script>
export default {
  name: 'MarkMapPublicDetail',
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  components: {
    MindMap: () => import('components/document/markmap/MindMap')
  },
  data () {
    return {
    }
  }
}

</script>

<style lang='scss' scoped>
/deep/[id^="markmap"] {
  min-height: 400px;
}
</style>
