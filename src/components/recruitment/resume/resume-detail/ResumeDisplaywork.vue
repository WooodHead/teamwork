<!-- 简历作品展示 -->
<template>
  <q-list>
    <q-expansion-item
      v-model="expanded"
      :label="$t('resume.basic.displaywork')"
      header-class="text-primary text-subtitle1 text-bold"
      expand-icon-class="text-primary text-bold"
    >
      <q-list>
        <template v-for="personalWork in personalWorks">
          <file-item
            :class="`${$q.platform.is.mobile?'q-pa-xs':'q-px-md'}`"
            v-if="personalWork.type==='file'"
            loaded
            :key="personalWork.name"
            :file="personalWork"
          >{{personalWork.desc}}</file-item>
          <q-item
            v-else
            :key="personalWork.name"
            :class="`${$q.platform.is.mobile?'q-pa-xs':'q-px-md'}`"
          >
            <q-item-section>
              <q-item-label
                lines="1"
                style="font-size:1rem;"
              >
                {{personalWork.title}}
              </q-item-label>
              <q-item-label caption>
                {{personalWork.desc}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                stack
                size="sm"
                color="primary"
                icon="subject"
                :label="$t('action.preview')"
                @click="openURL(personalWork.url)"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { download } from '@/boot/file'
import { openURL } from 'quasar'
export default {
  name: 'ResumeDisplaywork',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      // 是否默认展开
      expanded: true
    }
  },
  computed: {
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    },
    resume () {
      return this.$store.getters['resume/resume'](+this.resumeView.resumeID)
    },
    personalWorks () {
      return _.map(this.resume.personalWorks, function (personalWork) {
        return {
          url: personalWork.Path,
          title: personalWork.Type === 'file' ? personalWork.Name.slice(0, personalWork.Name.lastIndexOf('.')) : personalWork.Name,
          ext: personalWork.Name.slice(personalWork.Name.lastIndexOf('.')),
          size: '',
          type: personalWork.Type,
          desc: personalWork.Description
        }
      })
    }
  },
  methods: {
    download,
    openURL
  },
  components: {
    FileItem: () => import('components/base/file-uploader/FileItem')
  }
}
</script>

<style lang="scss" scoped>
</style>
