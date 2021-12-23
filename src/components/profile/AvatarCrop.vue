<template>
  <div class="relative-position">
    <input
      type="file"
      ref="pickImg"
      @change="changeImg"
      hidden
    />

    <q-avatar
      :size="size"
      color="grey-4"
    >
      <img :src="oriImgSrc" />
    </q-avatar>

    <div
      class="absolute q-mb-sm full-width text-center"
      style="bottom:0;"
    >
      <q-btn
        color="primary"
        icon="create"
        round
        size="sm"
        @click="triggerPick"
        class="q-mr-md"
      />
      <q-btn
        color="primary"
        icon="content_cut"
        round
        size="sm"
        @click="triggerCrop"
      />
    </div>

    <div
      v-if="!oriImgSrc"
      class="absolute-center full-width text-center"
    >
      {{$t('file.noAvatarNotes')}}
    </div>

    <q-dialog
      v-model="showCropper"
      persistent
      :position="$q.screen.lt.sm?'bottom':'standard'"
    >
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div :style="$q.screen.lt.sm?'width:100vw;height:70vh;':'width:700px;max-width:80vw;height:500px;max-height:80vh;'">
            <vue-cropper
              autoCrop
              centerBox
              fixed
              fixedBox
              autoCropWidth="250"
              autoCropHeight="250"
              ref="cropper"
              :img="option.img"
              :outputType="option.outputType"
            />
          </div>
        </q-card-section>

        <q-card-actions class="q-py-sm q-px-md">
          <q-btn
            flat
            stack
            icon="undo"
            color="primary"
            :label="$q.screen.lt.sm?$t('file.turnLeft'):''"
            @click="turnLeft"
          >
            <q-tooltip
              transition-show="scale"
              transition-hide="scale"
            >
              {{$t('file.turnLeft')}}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            stack
            icon="redo"
            color="primary"
            :label="$q.screen.lt.sm?$t('file.turnRight'):''"
            @click="turnRight"
          >
            <q-tooltip
              transition-show="scale"
              transition-hide="scale"
            >
              {{$t('file.turnRight')}}
            </q-tooltip>
          </q-btn>
          <q-space />
          <q-btn
            :label="$t('action.confirm')"
            :loading="loading"
            color="primary"
            class="q-px-sm"
            v-close-popup
            @click="confirmCrop"
          />
          <q-btn
            outline
            :label="$t('action.cancel')"
            color="primary"
            class="q-px-sm"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { upload, getUrl } from '@/boot/file'
import { uid } from 'quasar'
export default {
  components: { VueCropper },
  props: {
    imgSrc: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '170px'
    }
  },
  data () {
    return {
      oriImgSrc: this.imgSrc,
      option: {
        img: '',
        outputType: 'png'
      },
      showCropper: false,
      loading: false
    }
  },
  mounted () {
    this.oriImgSrc = getUrl(this.oriImgSrc)
  },
  watch: {
    imgSrc (val) {
      this.oriImgSrc = getUrl(val)
    }
  },
  methods: {
    changeImg () {
      let that = this
      // 得到一个blob对象
      let blob = this.$refs.pickImg.files[0]
      // 至关重要
      let oFileReader = new FileReader()
      oFileReader.onload = function (e) {
        // 显示base64编码
        that.showCropper = true
        that.option.img = e.target.result
      }
      oFileReader.readAsDataURL(blob)
    },
    triggerPick () {
      this.$refs.pickImg.click()
    },
    triggerCrop () {
      this.showCropper = true
      this.option.img = this.oriImgSrc
    },
    turnLeft () {
      this.$refs.cropper.rotateLeft()
    },
    turnRight () {
      this.$refs.cropper.rotateRight()
    },
    confirmCrop () {
      var _this = this
      _this.$refs.cropper.getCropBlob((data) => {
        var fileName = uid() + '.' + _this.option.outputType
        _this.loading = true
        let file = new window.File([data], fileName, { type: `image/${_this.option.outputType}` })
        // 上传人员图片
        upload('person', [file], process => { }, result => {
          this.$emit('update:imgSrc', result[0].PathName)
          this.$emit('updateAvatar', result[0].PathName)
          _this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
img[src=""],
img:not([src]) {
  opacity: 0;
  border: none;
  visibility: hidden;
  max-width: none;
}

/deep/.cropper-face {
  border-radius: 100%;
}

/deep/.cropper-view-box {
  border: 1px solid #39f;
  border-radius: 100%;
  outline: none !important;
  outline-color: none !important;
}
</style>
