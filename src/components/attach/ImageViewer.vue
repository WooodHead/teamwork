<!--
@Name：图片在界面上面不显示，点击按钮时才放大显示图片
@Author：陆欢
@date：2021/03/25
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <viewer
    v-show="false"
    ref="viewer"
  >
    <img :src="getUrl(url)">
  </viewer>
</template>

<script>
import { getUrl } from '@/boot/file'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'ImageViewer',
  components: {
    Viewer: () => import('v-viewer/src/component.vue')
  },
  props: {
    viewImage: { type: Boolean, default: false, desc: '是否显示文件' },
    url: { type: String, required: true, desc: '文件路径' }
  },
  data () {
    return {}
  },
  watch: {
    viewImage (newVal, oldVal) {
      if (newVal) {
        this.$refs.viewer.$viewer.show()
        this.$emit('close-dialog')
      }
    }
  },
  methods: {
    getUrl
  }
}
</script>

<style lang='scss' scoped>
</style>
