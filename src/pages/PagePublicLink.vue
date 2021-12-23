<template>
  <q-page
    id="container"
    :class="{'q-pt-xl column items-center':!isCanPreviewOffice&&isloaded}"
  >
    <q-card
      v-if="!isCanPreviewOffice&&isloaded"
      class="card-grow-in-page q-px-xxl"
    >
      <!-- 链接有效 -->
      <component
        v-if="publicLink&&publicLink.isPublic===1"
        :is="`Public${capitalize(publicLink.category)}`"
        :publicContent="publicLink.publicContent"
      ></component>
      <!-- 链接失效 -->
      <q-card-section
        v-else
        class="text-center"
      >
        <div class="text-h5 text-primary q-py-md">{{$t('publicLink.closedInfo1')}}</div>
        <q-separator />
        <div class="text-subtitle1 q-pa-md">{{$t('publicLink.closedInfo2')}}</div>
      </q-card-section>
      <!-- 底部logo -->
      <q-card-section class="text-center">
        <q-icon
          :name="`img:${$logo['favicon-96x96.png']}`"
          size="80px"
          class="cursor-pointer"
          @click="$router.push('/')"
        />
        <div class="text-bold q-pt-sm">{{$t('publicLink.shareFrom')}}<span
            class="text-primary cursor-pointer"
            @click="$router.push('/')"
          >TeamWork</span></div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
const config = require('app/app.config.js')
const fileState = require('@/store/file/state.js')
import imm from '@/boot/imm'
export default {
  name: 'PagePublicLink',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  components: {
    PublicNotice: () => import('components/public-link/PublicNotice'),
    PublicQuestion: () => import('components/public-link/PublicQuestion'),
    PublicAnswer: () => import('components/public-link/PublicAnswer'),
    PublicDocument: () => import('components/public-link/PublicDocument'),
    PublicSchedule: () => import('components/public-link/PublicSchedule'),
    PublicEvent: () => import('components/public-link/PublicEvent'),
    PublicTask: () => import('components/public-link/PublicTask'),
    PublicProduct: () => import('components/public-link/PublicProduct')
  },
  data () {
    return {
      publicLink: {
        category: '',
        param: {},
        code: '',
        isPublic: 0,
        token: ''
      },
      isCanPreview: false,
      isloaded: false
    }
  },
  computed: {
    isCanPreviewOffice () {
      return config.extranet && this.isCanPreview
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('publicLink', ['loadPublicLinkByCode']),
    ...mapActions('document', ['loadDocument']),
    capitalize,
    init () {
      if (this.code) {
        this.loadPublicLinkByCode(this.code).then(async link => {
          if (link && config.extranet && link.isPublic && link.publicContent) {
            if (link.publicContent.Extension && (fileState.default.officePreviewExts.includes(link.publicContent.Extension.toLowerCase()) || ['pdf', '.pdf'].includes(link.publicContent.Extension.toLowerCase()))) {
              var previewInfo = await imm.getOfficePrviewURL(link.publicContent.FilePath)
              if (previewInfo && aliyun) {
                let object = aliyun.config({
                  mount: document.querySelector('#container'),
                  url: previewInfo.PreviewURL
                })
                object.setToken({ token: previewInfo.AccessToken })
                this.isCanPreview = true
              }
            }
          }
          this.isloaded = true
          this.publicLink = link
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
