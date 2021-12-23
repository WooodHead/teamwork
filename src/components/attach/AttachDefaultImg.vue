<!--
@Name：组件
@Author：陆欢
@date：2021/11/17
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div>
    <q-img
      :alt="title"
      :title="title"
      :src="imgSrc"
      :ratio="4/3"
      class="rounded-borders q-pt-xs q-mt-sm"
      :class="{'exceptImg':haveNoSelfImg}"
    >
      <template v-if="haveNoSelfImg">
        <div
          class="text-white text-center text-h6 absolute-center text-size"
          style="background:none !important;top: 63%;left: 47% !important;"
        >
          {{extension?extension.replaceAll('.','').toUpperCase():'DOC'}}
        </div>
      </template>
    </q-img>
    <!-- 视频封面图片 -->
    <q-icon
      v-if="snapshotPath&&videoExts.includes(extension.toLowerCase())"
      size="3vh"
      class="absolute-center text-blue-grey-1"
      name="play_circle_outline"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { defaultImg } from '@/components/attach/public-default-card-showImg.js'
export default {
  name: 'AttachDefaultImg',
  props: {
    path: {
      type: String,
      required: false,
      default: '',
      description: '文件路径'
    },
    snapshotPath: {
      type: String,
      default: '',
      description: '快照路径'
    },
    extension: {
      type: String,
      description: 'Use "searchField" design for the search field'
    },
    title: {
      type: String,
      default: '',
      description: '名称'
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    ...mapState('file', ['imgExts', 'videoExts']),
    imgSrc () {
      let path = ''
      if (this.snapshotPath || this.imgExts.includes(this.extension.toLowerCase())) {
        path = this.snapshotPath || this.path
      }
      return defaultImg(this.extension, path)
    },
    haveNoSelfImg () {
      return !(this.imgExts.includes(this.extension.toLowerCase()) || this.snapshotPath)
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  @media (max-width: $breakpoint-xs-max) {
    .text-size {
      font-size: 14px;
    }
  }
</style>
