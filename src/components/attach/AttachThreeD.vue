<template>
  <div
    v-if="directShow"
    :class="['relative-position',{'q-mx-md':!$q.screen.lt.sm}]"
    ref="container"
  >
    <div
      v-if="controls"
      class="absolute-right column q-pa-sm q-gutter-y-sm ctrlBtns"
    >
      <template v-if="!limit3DHeight||$q.fullscreen.isActive">
        <q-btn
          v-if="!rotateStatus"
          dense
          round
          color="secondary"
          icon="3d_rotation"
          :title="$t('file.rotate')"
          :disable="!extension"
          class="col-auto"
          @click="rotateInit()"
        />
        <q-btn
          v-else
          dense
          round
          color="negative"
          icon="stop"
          :title="$t('file.stopRotate')"
          :disable="!extension"
          class="col-auto"
          @click="rotateStop()"
        />
        <q-btn
          dense
          round
          color="primary"
          :disable="!extension"
          icon="colorize"
          :title="$t('file.background')"
          class="col-auto"
        >
          <q-popup-proxy
            transition-show="scale"
            transition-hide="scale"
          >
            <q-color v-model="hex" />
          </q-popup-proxy>
        </q-btn>
      </template>

      <q-btn
        dense
        round
        color="white"
        text-color="primary"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        :title="$q.fullscreen.isActive ? $t('file.exitFullScreen') : $t('file.fullScreen')"
        @click="toggle"
      />
    </div>

    <model-stl
      v-if="extension && /^\.?stl$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <model-obj
      v-if="extension && /^\.?obj$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <model-collada
      v-if="extension && /^\.?dae$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <model-three
      v-if="extension && /^\.?json$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <model-ply
      v-if="extension && /^\.?ply$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <model-gltf
      v-if="extension && /^\.?gltf$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <model-fbx
      v-if="extension && /^\.?fbx$/.test(extension.toLowerCase()) && url!==''"
      :src="url"
      :backgroundColor="hex"
      :rotation="rotation"
      @on-progress="onProgress"
      @on-load="finishLoadModel()"
      @on-error="errorModel()"
      :class="classObject"
      ref="threeDContainer"
    />

    <q-inner-loading :showing="visible&&url!==''">
      <q-circular-progress
        v-if="fileItem===void 0"
        indeterminate
        size="75px"
        color="teal"
        class="q-ma-md"
      />
      <q-circular-progress
        v-else
        show-value
        font-size="14px"
        :value="+progress"
        size="75px"
        :thickness="0.22"
        color="teal"
        track-color="grey-3"
        class="q-ma-md"
      >
        {{ progress }}%
      </q-circular-progress>
    </q-inner-loading>
  </div>
</template>

<script>
import { dom } from 'quasar'
import { getUrl } from '@/boot/file'
import { ModelStl, ModelObj, ModelCollada, ModelThree, ModelPly, ModelGltf, ModelFbx } from 'vue-3d-model'
import { showWarningMessage } from '@/utils/show-message'
const { height, width, css } = dom
export default {
  name: 'AttachThreeD',
  components: {
    ModelStl,
    ModelObj,
    ModelCollada,
    ModelThree,
    ModelPly,
    ModelGltf,
    ModelFbx
  },
  props: {
    id: { type: Number, desc: '文件id' },
    path: { type: String, default: '', desc: '地址' },
    extension: {
      type: String,
      required: false,
      default: ''
    },
    directShow: {
      type: Boolean,
      default: false,
      description: '是否直接展示3d文件'
    },
    show3DControls: {
      type: Boolean,
      default: true,
      description: '是否直接展示3d文件控制按钮'
    },
    show3DRotateStatus: {
      type: Boolean,
      default: false,
      description: '是否直接展示3d文件并且旋转'
    },
    limit3DHeight: {
      type: Boolean,
      default: false,
      description: '限制3d文件高度'
    }
  },
  data () {
    return {
      url: '',
      hex: 'gray',
      rotation: {
        x: -Math.PI / 2,
        y: 0,
        z: 0
      },
      rotateStatus: false,
      controls: false,
      visible: true,
      viewWidth: 60,
      viewHeight: 60,
      progress: 0
    }
  },
  created () {
    this.init()
  },
  watch: {
    path () {
      this.init()
    }
  },
  computed: {
    fileItem () {
      return this.$store.state.file.files.find(f => f.id === this.id)
    },
    classObject () {
      return {
        'threed-container': !this.$q.fullscreen.isActive && !this.limit3DHeight
      }
    }
  },
  methods: {
    init () {
      this.url = getUrl(this.path)
    },
    onProgress (xhr) {
      // xhr中未计算文件大小，所以从file模块的state中获取
      if (this.fileItem) {
        this.progress = (100 * xhr.loaded / 1024 / this.fileItem.size).toFixed(2)
      }
    },
    finishLoadModel () {
      this.visible = false
      this.controls = this.show3DControls
      this.rotateStatus = this.show3DRotateStatus
      this.rotateStatus && this.rotate()
      this.viewWidth = width(this.$refs.threeDContainer.$el)
      this.viewHeight = height(this.$refs.threeDContainer.$el)
    },
    errorModel () {
      showWarningMessage(this.$t('file.errorModel'))
    },
    rotateInit () {
      this.rotateStatus = true
      this.rotate()
    },
    rotateStop () {
      this.rotateStatus = false
    },
    rotate () {
      this.rotation.z += 0.01
      if (!this.rotateStatus) {
        cancelAnimationFrame(this.rotate)
        return
      }
      requestAnimationFrame(this.rotate)
    },
    toggle () {
      let target = this.$refs.container
      this.$q.fullscreen.toggle(target)

      // 3d模型退出全屏时恢复原尺寸
      if (this.$q.fullscreen.isActive) {
        css(this.$refs.threeDContainer.$el, {
          width: `${this.viewWidth}px`,
          height: `${this.viewHeight}px`
        })
      } else {
        css(this.$refs.threeDContainer.$el, {
          width: '100%',
          height: '100%'
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.ctrlBtns {
  height: 150px;
}

/deep/.threed-container canvas {
  height: calc(100vh - 40px) !important;
}
</style>
