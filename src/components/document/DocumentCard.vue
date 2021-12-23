<template>
  <q-card
    class="cursor-pointer text-center widget-card"
    :class="[file.color ,{'secrecy-content':file.acl===2}]"
    style="overflow:hidden"
    @click="fileDetail(file.objectType,file.objectID,file.id,file.classify)"
  >
    <div
      class="widget-card-section"
      :class="{'archived':file.archived}"
    >
      <file-menu
        v-if="file.objectType==='productCase'"
        size="lg"
        flat
        class="card-header-right"
        :detailModel="file"
        :category="file.objectType"
        :objectID="file.objectID"
        style="margin-top: -10px;"
      ></file-menu>
      <a
        v-if="!showSetColor&&file.objectType!=='productCase'"
        class="card-colorpicker"
        :title="$t('document.pickColor')"
        @click.stop="showSetColor=true"
      >
      </a>
      <!-- 线上自己创建文档 Object.keys(file).includes('noticeType')为公告model -->
      <!-- <div> -->
      <template v-if="file.classify==='doc'||Object.keys(file).includes('noticeType')">
        <q-card-section class="q-pb-none toolsCardStyle adjustment">
          <div
            style="overflow: inherit;"
            class="text-subtitle2 text-weight-bold"
          >
            {{file.title}}
          </div>
        </q-card-section>
        <q-card-section
          v-if="file.extension==='markmap'"
          class="q-pt-none q-px-none markmap-section"
        >
          <mind-map
            :code="file.content"
            :controls='false'
            :title="file.title"
          />
        </q-card-section>
        <q-card-section
          v-else
          class="editor__content"
          v-html="file.content"
        >
        </q-card-section>
      </template>

      <!-- 创建文档链接 -->
      <template v-if="file.classify==='link'">
        <q-card-section class="adjustment">
          <attach-icon
            :path="file.filePath"
            :extension="file.classify"
          />
          <div
            style="overflow: inherit;"
            class="text-subtitle2 text-weight-bold q-pb-none toolsCardStyle q-mt-sm"
          >
            {{file.title}}
          </div>
          <!-- 说明 -->
          <template v-if="file.content">
            <q-separator
              class="q-mt-sm"
              inset
            />
            <p
              v-html="file.content"
              class="q-mt-sm"
            ></p>
          </template>
        </q-card-section>
      </template>
      <template v-if="file.classify==='file'">

        <q-card-section class="q-pb-sm q-mt-xs">
          <attach-default-img
            :path="file.filePath"
            :snapshotPath="file.snapshotPath"
            :extension="file.extension"
            :title="file.title"
          ></attach-default-img>
        </q-card-section>

        <q-separator inset />

        <q-card-section class="q-pt-xs ellipsis-3-lines">
          <div
            style="overflow: inherit;word-wrap: break-word;"
            class="text-subtitle3 q-pb-none toolsCardStyle ellipsis-3-lines"
          >
            <template v-if="imgExts.includes(file.extension.toLowerCase())">
              {{file.title}}
            </template>
            <template v-else>
              {{file.title}}
            </template>
          </div>
        </q-card-section>
      </template>
      <!-- </div> -->
    </div>
    <set-document-color
      v-if="showSetColor"
      :id="file.id"
      :color.sync="file.color"
      @setColor="showSetColor = false"
    />
    <!-- 仅创建者可编辑标志 -->
    <!-- <div
      v-if="file.onlyICanEdit === 1 && file.objectType!=='productCase'"
      class="text-caption text-grey-9"
      style="font-size: 0.65rem; position:absolute; top: 2px; left:5px;"
    >{{$t('document.meEdit')}}</div> -->
  </q-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { date } from 'quasar'
import { getUrl } from '@/boot/file'
import showCardDetail from '@/components/document/folder/mixins-file-click.js'
export default {
  name: 'DocumentCard',
  mixins: [showCardDetail],
  props: {
    file: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  filters: {
    filterModifyTime (value) {
      return date.formatDate(value, 'MM/DD HH:mm')
    }
  },
  data () {
    return {
      showCardFileDetail: false,
      maximizedToggle: true,
      cardItem: {},
      alert: true,
      showSetColor: false
    }
  },
  computed: {
    ...mapState('file', ['imgExts', 'videoExts']),
    ...mapGetters('document', ['cardFile'])
  },
  methods: {
    getUrl
  },
  components: {
    AttachIcon: () => import('components/attach/AttachIcon'),
    AttachDefaultImg: () => import('components/attach/AttachDefaultImg'),
    MindMap: () => import('components/document/markmap/MindMap'),
    SetDocumentColor: () => import('components/document/SetDocumentColor'),
    FileMenu: () => import('components/document/file/FileMenu')
  }
}
</script>

<style lang="scss" scoped>
  .archived {
    height: 100%;
  }
  .bg-yellow-2 {
    background-color: #fdfcce !important;
  }
  .bg-white {
    background-color: #fff !important;
  }
  .bg-green-2 {
    background-color: #e4f8e2 !important;
  }
  .bg-grey-4 {
    background-color: #f2f2f2 !important;
  }
  .bg-brown-2 {
    background-color: #f2f2f2 !important;
  }
  .bg-pink-2 {
    background-color: #ffe4f7 !important;
  }
  .bg-blue-2 {
    background-color: #e1effc !important;
  }
  .bg-orange-1 {
    background-color: #fff0db !important;
  }
  .bg-red-1 {
    background-color: #ffe5e5 !important;
  }
  .bg-indigo-1 {
    background-color: #f2edff !important;
  }
  .widget-card:before {
    content: "";
    display: block;
    padding-top: 128% !important;
  }
  .widget-card {
    width: 100%;
  }
  @media (min-width: $breakpoint-xs-max) {
    .widget-card {
      width: 11rem !important;
      display: block;
    }
  }
  .toolsCard {
    width: 43% !important;
    display: block;
  }
  .toolsCard .widget-card {
    width: 100% !important;
  }
  /deep/.diagram {
    margin-top: -120px !important;
  }
  @media (max-width: $breakpoint-xs-max) {
    .toolsCard .toolsCardStyle {
      margin: auto !important;
    }
    .toolsCard .toolsCardStyle.q-card__section--vert {
      padding: 10px;
    }
    .markmap-section /deep/.q-carousel__slide {
      padding: 0;
    }
    /deep/.diagram {
      margin-top: -140px !important;
    }
  }
  .link-style {
    word-wrap: break-word;
    word-break: break-all;
    color: blue;
  }
  // .q-img {
  //   width: 4.2em;
  //   height: 5.45em;
  // }
  img {
    width: 100%;
  }
  .tiptap-content {
    word-break: break-all;
  }
  .document-file-card img {
    width: 100%;
  }
  .secrecy-content {
    background-size: 80%;
  }
  .secrecy-content /deep/.q-carousel {
    background-color: unset !important;
  }
  .secrecy-content /deep/.mind-map {
    background-color: unset !important;
  }
  .card-colorpicker {
    background-image: url(/icons/match-color.svg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 1rem;
    display: block;
    position: absolute;
    height: 1rem;
    width: 1rem;
    border: 0;
    padding: 0;
    opacity: 0.33;
    top: 0.2rem;
    right: 0.3rem;
    transform: scale(0.7);
    z-index: 1;
  }
  .card-header-right {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 1rem;
    display: block;
    position: absolute;
    /* height: 1rem; */
    /* width: 1rem; */
    border: 0;
    padding: 0;
    opacity: 1;
    right: 0rem;
    transform: scale(0.7);
    z-index: 1;
  }
  .card-colorpicker:hover {
    opacity: 1;
  }
  .adjustment {
    padding-top: 22px;
  }
  /deep/.o-image-view .q-avatar {
    font-size: 30px !important;
  }
  /deep/.o-image-view .q-item__section--side {
    padding-right: 0px !important;
  }
  /deep/.o-image-view .q-item__section--avatar {
    min-width: 40px !important;
  }
  /deep/.o-image-view {
    white-space: initial !important;
  }
</style>
  <style lang="scss">
  .tiptap-content h1 {
    font-size: 20px !important;
    font-weight: 700 !important;
  }
  .todo-content {
    text-align: left;
  }
  .file-style {
    height: 120px;
  }
  .file-style img {
    height: 100% !important;
    width: auto !important;
  }
  .exceptImg .q-img__image {
    max-width: 5.5rem;
    // max-height: 7rem;
    margin-left: auto;
    margin-right: auto;
  }
</style>
