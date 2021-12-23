<template>
  <q-page padding>
    <q-item class="fixed-center">
      <q-item-section
        top
        avatar
      >
        <attach-icon
          :path="file"
          :extension="extension"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1">{{ title }} </q-item-label>
        <q-item-label
          lines="1"
          class="q-pt-sm"
        >{{size}} •
          <a
            href="javascript:void(0);"
            class="cursor-pointer"
            title="下载文件时您的ip会被记录，请安全阅读~"
            @click="downloadFile(file)"
          > {{download}} </a></q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script>
export default {
  name: 'PageDowload',
  props: {
    file: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      caption: '正在下载文件，请稍等...',
      download: '下载文件'
    }
  },
  computed: {
    title () {
      return this.file.split('/').pop()
    },
    extension () {
      return this.file.split('.').pop()
    }
  },
  components: {
    AttachIcon: () => import('components/attach/AttachIcon')
  },
  mounted () {
    this.downloadFile(this.file)
  },
  methods: {
    downloadFile (filePath) {
      this.download = '下载中......'
      window.download(filePath).then(res => {
        this.download = '下载文件'
      })
    }
  }
}
</script>
