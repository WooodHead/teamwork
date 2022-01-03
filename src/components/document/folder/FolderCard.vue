<template>
  <q-card
    class="cursor-pointer text-center widget-card folder-card"
    @click="showFolderDetail(folder.objectType,folder.objectID,folder.id)"
    style="overflow:hidden"
    :class="folder.color"
  >
    <q-icon
      v-if="folder.acl===2"
      size="20vh"
      class="absolute-center text-blue-grey-1"
      name="img:icons/secrecy/secrecy.svg"
    />
    <div
      class="widget-card-section"
      :class="{'archived':folder.archived}"
    >
      <a
        v-if="!showSetColor"
        class="card-colorpicker"
        :title="$t('document.pickColor')"
        @click.stop="showSetColor=true"
      ></a>
      <q-card-section
        :class="['q-pb-none toolsCardStyle',{'q-pt-sm':$q.screen.lt.sm}]"
        style="margin: 1em 0em 0em;"
      >
        <div
          style="overflow: inherit;"
          class="text-subtitle2 text-weight-bold"
        >
          {{folder.title}}
        </div>
      </q-card-section>

      <!-- 内容区 -->
      <q-card-section class="q-pt-xs">
        <div class="q-gutter-sm text-left">
          <div
            v-for="(element,index) in children"
            :key="index"
          >
            <q-icon
              name="app:tw-icon-folder"
              color="amber"
              v-if="element.classify=='folder'"
              style="font-size: 14px;"
            />
            <q-icon
              name="app:tw-icon-file"
              v-else
              style="font-size: 14px;color:#bbc4ca"
            />
            {{element.title}}
            <q-img
              v-if="imgExts.includes(element.extension.toLowerCase())&&element.classify==='file'"
              clickable
              :src="getUrl(element.filePath)"
              :ratio="9/12"
              class="rounded-borders"
            />
            <span v-else-if="['file','link'].includes(element.classify)">{{`${element.extension||element.classify}`}}</span>
            <q-separator dark />
          </div>
        </div>
      </q-card-section>
    </div>
    <set-document-color
      v-if="showSetColor"
      :id="folder.id"
      :color.sync="folder.color"
      @setColor="showSetColor = false"
    />
  </q-card>
</template>

<script>
import { date } from 'quasar'
import { mapState } from 'vuex'
import { getUrl } from '@/boot/file'
import showCardDetail from '@/components/document/folder/mixins-file-click.js'
export default {
  name: 'FolderCard',
  mixins: [showCardDetail],
  props: {
    folder: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      showSetColor: false
    }
  },
  computed: {
    ...mapState('file', ['imgExts']),
    children () {
      const data = _.filter(this.folder.children, item => { return !item.archived && item.isPublish })
      return _.orderBy(data, [_.camelCase(this.sort)], ['desc'])
    }
  },
  filters: {
    filterModifyTime (value) {
      return date.formatDate(value, 'MM/DD HH:mm')
    }
  },
  methods: {
    getUrl
  },
  components: {
    SetDocumentColor: () => import('components/document/SetDocumentColor')
  }
}
</script>

<style lang="scss" scoped>
  .archived {
    height: 100%;
  }
  .bg-yellow-2 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(253%2C252%2C206)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #f9f568 !important;
    background-repeat: no-repeat;
    background-size: cover !important;
  }
  .bg-white {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C255%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-size: cover !important;
    background-color: #e6e6e6 !important;
  }
  .bg-green-2 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(228%2C248%2C226)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #cdf2c9 !important;
    background-repeat: no-repeat;
    background-size: cover !important;
  }
  .bg-grey-4 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(242%2C242%2C242)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #e3e3e3 !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .bg-brown-2 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(238%2C226%2C215)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #e5d2c2 !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .bg-pink-2 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C228%2C247)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #ffc5ee !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .bg-blue-2 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(225%2C239%2C252)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #c5e0f9 !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .bg-orange-1 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C240%2C219)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #ffe3bc !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .bg-red-1 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C229%2C229)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #ffc6c6 !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .bg-indigo-1 {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(242%2C237%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E") !important;
    background-color: #dcceff !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  .widget-card {
    background: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22239%22%20viewBox%3D%220%200%20180%20239%22%3E%0A%20%20%3Cpath%20fill%3D%22rgb(255%2C255%2C255)%22%20fill-rule%3D%22evenodd%22%20d%3D%22M4%2C-1.54980961e-16%20L76.3353265%2C5.45031826e-15%20L76.3353265%2C7.10542736e-15%20C78.7053659%2C-3.85503091e-15%2080.853319%2C1.39512964%2081.816971%2C3.56041516%20L88.4388884%2C18.4395848%20L88.4388884%2C18.4395848%20C89.4025404%2C20.6048704%2091.5504935%2C22%2093.9205328%2C22%20L175%2C22%20L175%2C22%20C177.761424%2C22%20180%2C24.2385763%20180%2C27%20L180%2C235%20L180%2C235%20C180%2C237.209139%20178.209139%2C239%20176%2C239%20L4%2C239%20L4%2C239%20C1.790861%2C239%202.705415e-16%2C237.209139%200%2C235%20L8.8817842e-16%2C4%20L8.8817842e-16%2C4%20C6.17636919e-16%2C1.790861%201.790861%2C4.05812251e-16%204%2C0%20Z%22%2F%3E%0A%3C%2Fsvg%3E");
    background-size: cover;
    background-color: #e6e6e6;
    width: 100%;
  }
  .widget-card:before {
    content: "";
    display: block;
    padding-top: 128% !important;
  }
  /deep/.diagram {
    margin-top: -120px !important;
  }
  @media (min-width: $breakpoint-xs-max) {
    .widget-card {
      width: 11rem !important;
      display: block;
    }
    /deep/.diagram {
      margin-top: -140px !important;
    }
  }
  .toolsCard {
    width: 43% !important;
    display: block;
  }
  .toolsCard .widget-card {
    width: 100% !important;
  }
  @media (max-width: $breakpoint-xs-max) {
    .toolsCard .toolsCardStyle.q-card__section--vert {
      padding: 10px;
    }
  }
  .toolsCard .toolsCardStyle {
    margin: auto !important;
  }
  .tiptap-content,
  .editor__content {
    word-break: break-all;
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
  .card-colorpicker:hover {
    opacity: 1;
  }
  /deep/.q-card > div {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: none;
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
