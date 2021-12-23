<template>
  <div class="relative-position">
    <q-img
      :src="getUrl(file.url)"
      class="cursor-pointer"
      @click="clickEvent"
      style="max-height:150px;"
    />
    <div
      v-if="!readOnly"
      class="absolute-top-right q-mr-sm"
    >
      <q-btn
        flat
        round
        text-color="grey-10"
        icon="close"
        size="md"
        class="q-ma-xs"
        @click="removeFile"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getUrl } from '@/boot/file'
export default {
  name: 'MediaItemLoaded',
  props: {
    // 仅显示图片，不关联操作
    readOnly: { type: Boolean, default: false },
    // 当前背景图
    file: { type: Object, default: () => { } },
    // 公告对应的背景图
    bgFiles: { type: Array, default: () => [] },
    // 公告id
    noticeId: { type: Number, default: 0 }
  },
  methods: {
    ...mapActions('file', ['addFile', 'updateFile', 'deleteFile']),
    getUrl,
    clickEvent () {
      if (this.readOnly) {
        this.$emit('setShowSwitch', true)
      } else {
        this.$emit('setShowSwitch', false)
        // 删除其它选中
        if (this.bgFiles.length > 0) {
          this.deleteFile(this.bgFiles[0].id)
        }

        // 更新当前为选中
        let cloneFile = _.cloneDeep(this.file)
        cloneFile.objectType = 'notice'
        cloneFile.objectId = this.noticeId
        this.addFile(cloneFile)
      }
    },
    removeFile () {
      this.deleteFile(this.file.id)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
