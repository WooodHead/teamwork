<template>

  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card :title="$t('document.version')" />
    <div class="q-px-xxl">
      <q-card-section v-if="noVersion">
        <q-banner
          rounded
          dense
          class="bg-grey-3 text-body1 text-left full-width q-mb-sm"
        >
          <template v-slot:avatar>
            <q-icon
              name="info"
              color="info"
            />
          </template>
          {{$t('document.noVersion')}}
        </q-banner>
      </q-card-section>
      <div v-else>
        <q-card-section
          v-for="(version,index) in versions"
          :key="index"
          class="file-detail"
        >
          <attach-card
            :attach="{createBy:version.Actor, modifyBy:version.Actor,filePath:version.Extra.NewFilePath,extension:version.Extra.NewExtension,title:version.Extra.NewContent,size:version.Extra.NewSize,modifyTime:version.ActTime}"
            :showDownload="currentModel.onlyICanDownload === 0||currentModel.authorID === $myinfo.id||!!$myinfo.auth.role.isSystemAdministrator||!!$myinfo.auth.role.isSeniorManager"
            :showVersion="false"
            :showEdit="false"
          >
            <template
              v-if="index===0"
              #postedByBefore
            >
              <q-chip
                square
                outline
                color="primary"
                text-color="white"
              >{{$t('document.currentVersion')}}</q-chip>
            </template>
          </attach-card>
        </q-card-section>
      </div>
    </div>
  </q-card>

</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'FileVersion',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    category: {
      type: String,
      default: ''
    },
    objectID: {
      type: [Number, String],
      default: 0
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    AttachCard: () => import('components/attach/AttachCard')
  },
  data () {
    return {
      versions: []
    }
  },
  computed: {
    currentModel () {
      return this.$store.getters[`document/currentModel`](+this.id)
    },
    noVersion () {
      return !this.versions.length || !this.versions.filter(r => !!r.Extra.NewFilePath).length
    }
  },
  mounted () {
    this.loadDocument(+this.id)
    this.loadDocumentHistory(+this.id).then(res => {
      this.versions = res.filter(r => ['add', 'reupload'].includes(r.Action))
      _.reverse(this.versions)
    })
  },
  methods: {
    ...mapActions('document', ['loadDocumentHistory', 'loadDocument'])
  }
}
</script>

<style lang="scss" scoped>
  .q-zoom__no-scroll {
    overflow: auto;
  }
  /deep/ .file-detail video,
  /deep/.file-detail img {
    width: auto !important;
    max-height: 300px !important;
  }
</style>
