<template>
  <div>
    <!-- 背景图显示，无背景图显示空位置 -->
    <div class="text-caption text-grey-7">{{$t('file.switchLabel')}}</div>
    <div v-if="carouselBgFiles.length>0">
      <media-item-loaded
        readOnly
        :file="carouselBgFiles[0]"
        :bgFiles="carouselBgFiles"
        :noticeId="noticeId"
        class="col-12"
        @setShowSwitch="setShowSwitch"
      />
    </div>
    <div v-else>
      <div
        class="cursor-pointer rounded-borders text-center upload-header"
        @click="showSwitch=true"
      >
        <q-icon
          name="add_to_photos"
          color="grey-5"
          size="xl"
        />
        <div class="q-px-sm text-caption text-grey-5">{{$t('file.switchNotes')}}</div>
      </div>
    </div>

    <!-- 上传及显示区 -->
    <q-dialog
      v-model="showSwitch"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="column">
        <q-card-section class="row items-center q-gutter-sm q-pb-none">
          <div class="text-h6">{{$t('file.switchNotes')}}</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-card-section>
          <tw-file-uploader
            showUploadArea
            :objectType="objectType"
            :objectId="objectId"
            class="q-mt-md"
            :class="`${$q.platform.is.mobile?'q-mx-sm':'q-mx-md'}`"
            @uploaded="uploaded"
          >
            <template v-slot="scope">
              <div class="row items-center q-gutter-y-sm">
                <media-item-loaded
                  v-for="file in scope.loadedFiles"
                  :key="file.name"
                  :file="file"
                  :bgFiles="carouselBgFiles"
                  :noticeId="noticeId"
                  class="col-12 q-px-sm"
                  @setShowSwitch="setShowSwitch"
                />
              </div>
            </template>
          </tw-file-uploader>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TwCarouselSwitch',
  components: {
    TwFileUploader: () => import('components/base/file-uploader/TwFileUploader'),
    MediaItemLoaded: () => import('components/base/file-uploader/MediaItemLoaded')
  },
  props: {
    objectType: { type: String, default: '' },
    objectId: { type: Number, default: 0 },
    noticeId: { type: Number, default: 0 }
  },
  data () {
    return {
      showSwitch: false
    }
  },
  computed: {
    ...mapGetters('file', ['files']),
    carouselBgFiles () {
      return _.filter(this.files, f =>
        f.objectType === 'notice' &&
        f.objectId === this.noticeId)
    }
  },
  methods: {
    ...mapActions('file', ['loadFiles', 'addFile', 'deleteFile']),
    setShowSwitch (value) {
      this.showSwitch = value
    },
    uploaded (files) {
      // 组装数据 写入后台
      let that = this
      _.forEach(files, file => {
        that.addFile({
          url: file.PathName,
          title: file.Title,
          ext: file.Extension,
          size: file.Size,
          objectType: that.objectType,
          objectId: that.objectId,
          orderNumber: file.lastModified
        }).then(resAdd => {
          // 图片上传完毕后，默认选中该图片，并关闭弹窗
          that.setShowSwitch(false)

          // 删除其它选中
          if (that.carouselBgFiles.length > 0) {
            that.deleteFile(that.carouselBgFiles[0].id)
          }

          // 更新当前为选中
          let curFile = _.find(that.files, { id: resAdd.id })
          let cloneFile = _.cloneDeep(curFile)
          cloneFile.objectType = 'notice'
          cloneFile.objectId = that.noticeId
          that.addFile(cloneFile)
        })
      })
    }
  },
  created () {
    // 公告选中的轮播图背景
    if (this.noticeId > 0) {
      let queryNoticeFiles = [
        { Key: 'ObjectType', Value: 'notice', Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.noticeId, Oper: 'eq' }
      ]
      this.loadFiles({ query: queryNoticeFiles })
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.scroll {
  overflow: hidden;
}

.upload-header {
  height: 80px;
  border: 0.15rem dashed $grey-5;
}
</style>
