<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-pa-none"
  >
    <q-card-section class="q-pa-lg text-right guide-header">
      <guide-add-header :guideModule="guideModule"></guide-add-header>
    </q-card-section>
    <file-upload
      :category="$route.params.category"
      :objectID="$route.params.objectID"
      :id="model.id"
      @showDocForm="showLinkForm = false; showDocForm = !showDocForm; showMarkMapForm = false"
      @showLinkForm="showLinkForm = !showLinkForm; showDocForm = false; showMarkMapForm = false"
      @showMarkMapForm="showLinkForm = false; showDocForm = false; showMarkMapForm = !showMarkMapForm"
      @hiddenAllForm="showLinkForm = false; showDocForm = false; showMarkMapForm = false"
      :class="{'hidden-file-form': showLinkForm || showDocForm || showMarkMapForm}"
    ></file-upload>
    <q-card-section :class="[{'q-pa-none': !showDocForm && !showLinkForm && !showMarkMapForm}]">
      <doc-form
        :guide="true"
        :category="$route.params.category"
        :objectID="$route.params.objectID"
        :id="model.id"
        v-if="showDocForm"
        @hiddenDocForm="showDocForm = false"
      ></doc-form>
      <link-form
        :guide="true"
        :category="$route.params.category"
        :objectID="$route.params.objectID"
        :id="model.id"
        v-if="showLinkForm"
        @hiddenLinkForm="showLinkForm = false"
      ></link-form>
      <mark-map-form
        :guide="true"
        :category="$route.params.category"
        :objectID="$route.params.objectID"
        :id="model.id"
        v-if="showMarkMapForm"
        @hiddenMarkMapForm="showMarkMapForm = false"
      ></mark-map-form>
    </q-card-section>
    <q-card-section class="q-px-xxl">
      <span
        v-if="documents.length"
        class="q-my-md text-grey-8 LandR-separator"
      >
        {{$t('guide.document.existFile')}}</span>
      <div
        class="row q-gutter-md justify-center"
        style="margin-left: 0"
      >
        <div
          v-for="item in documents"
          :key="item.id"
          class="span-stype"
        >
          <folder-card
            v-if="item.classify==='folder'"
            :folder="item"
          ></folder-card>

          <file-card
            v-else
            :file="item"
          >
          </file-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
// import { i18n } from '@/boot/i18n'
import { mapState } from 'vuex'
// import { upload } from '@/boot/file'
import mixinxquasarupload from '@/mixins/mixins-quasar-upload.js'
export default {
  name: 'DocumentGuide',
  mixins: [mixinxquasarupload],
  data () {
    return {
      showDocForm: false,
      showLinkForm: false,
      showMarkMapForm: false
    }
  },
  components: {
    DocForm: () => import('components/document/doc/DocForm'),
    LinkForm: () => import('components/document/link/LinkForm'),
    MarkMapForm: () => import('components/document/markmap/MarkMapForm'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    FileCard: () => import('components/document/DocumentCard'),
    GuideAddHeader: () => import('components/guide/GuideAddHeader'),
    FileUpload: () => import('components/guide/FileUpload')
  },
  computed: {
    ...mapState('guide', ['guideCategoryStep', 'guideModule']),
    model () {
      if (this.$route.params.category && this.$route.params.objectID && !this.id) {
        return this.$store.getters['document/resourceDocument'](this.$route.params.category, +this.$route.params.objectID)
      } else {
        return this.$store.getters['document/currentModel'](+this.id)
      }
    },
    documents () {
      return this.$store.getters['document/documents'](+this.model.id || +this.id)
    }
  }
}
</script>

<style scoped lang="scss">
.guide-header {
  background-color: $friend;
}
.LandR-separator {
  display: flex;
  align-items: center;
}
.LandR-separator::before,
.LandR-separator::after {
  content: "";
  flex: 1;
  height: 1px;
  background: $green;
}
.LandR-separator::before {
  margin-right: 1rem;
}
.LandR-separator::after {
  margin-left: 1rem;
}
/deep/ .q-form > .q-mt-lg {
  margin-top: 0;
  .row {
    margin-top: 0;
  }
}
/deep/ .q-uploader__list {
  min-height: auto;
  .q-list {
    margin-top: 0;
  }
}
@media (min-width: $breakpoint-xs-max) {
  /deep/ .span-stype {
    &:first-child {
      margin-left: 0;
    }
    .widget-card {
      width: 10rem !important;
    }
  }
}
@media (max-width: $breakpoint-xs-max) {
  /deep/ .span-stype {
    &:first-child {
      margin-left: 0;
    }
    .widget-card {
      width: 8rem !important;
    }
  }
}
/deep/ .save-draft {
  display: none;
}
/deep/ .save-draft + .q-btn {
  margin-left: 0;
}
.borderLine {
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 0.6rem;
  margin-top: 30px !important;
}
.hidden-file-form /deep/ .q-uploader__list {
  display: none;
}
</style>
