<template>
  <component
    :id="id"
    :is="isPublicLink?'document-public-detail':'document-detail'"
    :isPublicLink="isPublicLink"
    :category="category"
    :objectID="objectID"
  >
    <template slot="content">
      <q-card-section
        class="text-center"
        :class="{'q-pt-none':$q.platform.is.desktop}"
      >
        <attach-icon
          v-if="!isPublicLink"
          :path="currentModel.filePath"
          :extension="currentModel.classify"
        />
        <div
          style="overflow: inherit;"
          class="text-h4"
          :class="$q.platform.is.mobile?'q-mt-none':' q-mt-sm'"
        >
          {{currentModel.title}}
        </div>
        <div class="q-py-xs" v-if="currentModel.tags && currentModel.tags.length">
            <tw-chip
              v-for="tag in currentModel.tags"
              :key="tag"
              size="xs"
              :label="tag"
            />
        </div>
        <q-btn
          outline
          rounded
          color="primary"
          :label="$t('document.action.openLink')"
          class="q-mt-sm"
          @click="openLink"
        />
        <div class="q-mt-sm text-grey-7">
          {{$t('document.modify.postedBy',{modifyBy:currentModel.modifyBy})}}
          •
          {{timeAgo({ dateTime :currentModel.modifyTime})}}
        </div>
        <template v-if="currentModel.content">
          <q-separator class="q-mt-md" />
          <p
            v-html="currentModel.content"
            class="q-mt-lg"
            style="text-align: initial;"
          ></p>
        </template>
      </q-card-section>
    </template>
  </component>
</template>

<script>
import { mapActions } from 'vuex'
import timeAgo from '@/utils/time-ago'
export default {
  name: 'LinkDetail',
  props: {
    category: {
      type: String,
      default: ''
    },
    objectID: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    isPublicLink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentModel () {
      return this.$store.getters['document/currentModel'](+this.id)
    }
  },
  created () {
    if (!this.$route.name === 'publicLink') {
      this.loadDocument(this.id)
    }
  },
  methods: {
    timeAgo,
    ...mapActions('document', ['loadDocument']),
    openLink () {
      window.open(this.currentModel.filePath, 'newwindow', '')
    }
  },
  components: {
    DocumentDetail: () => import('components/document/DocumentDetail'),
    DocumentPublicDetail: () => import('components/document/DocumentPublicDetail'),
    AttachIcon: () => import('components/attach/AttachIcon'),
    TwChip: () => import('components/base/TwChip')
  }
}
</script>

<style scoped>
</style>
