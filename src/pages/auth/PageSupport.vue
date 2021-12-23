<template>
  <div>
      <!-- 头部logo -->
      <q-card-section class="text-center">
        <div class="text-h5 q-pt-sm">{{$t('auth.support')}}</div>
      </q-card-section>
      <q-card-section>
        <div
          v-if="error"
          class="text-body1 text-negative"
        >
          {{error}}
        </div>
        <q-form
          autofocus
          @submit.enter="submit"
        >
          <div class="question-item q-mb-md">
            <div class="text-subtitle1 q-pb-xs">{{$t('auth.email')}}</div>
            <q-input
              v-model="email"
              type="email"
              outlined
              dense
              :rules="[$rules.email($t('rule.validEmailAddress')),
              $rules.required($t('rule.validEmailAddress'))]"
            />
          </div>
          <div class="question-item q-mb-md">
            <div class="text-subtitle1 q-pb-xs">{{$t('auth.type')}}</div>
            <q-select
              class="mess-search-btn"
              v-model="type"
              :options="options"
              outlined
              options-dense
              dense
              :rules="[val => !!val || $t('rule.fieldIsRequired')]"
            >
            </q-select>
          </div>
          <div class="question-item q-mb-md">
            <div class="text-subtitle1 q-pb-xs">{{$t('auth.content')}}</div>
            <q-input
              v-model="content"
              square
              outlined
              :rules="[val => !!val || $t('rule.fieldIsRequired')]"
              type="textarea"
            />
          </div>
          <div class="question-item q-mb-md">
            <div class="text-subtitle1 q-pb-xs">{{$t('auth.file')}}</div>
            <upload-file
              ref="uploadFile"
              folder="document"
              @initCallBack="initCallBack"
              :files="initFile"
              :multiple="true"
              :canEdit="false"
            />
          </div>
          <div class="q-mb-md">
            <q-btn
              class="full-width"
              :label="$t('action.submit')"
              type="submit"
              color="primary"
              size="lg"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Support',
  components: {
    UploadFile: () => import('components/file/UploadFile')
  },
  data () {
    return {
      error: undefined,
      loading: false,
      type: '',
      options: [
        this.$t('auth.questionRegister'), this.$t('auth.questionLogin'), this.$t('auth.questionEmail'), this.$t('auth.questionRequire'), this.$t('auth.quetionOther')
      ],
      content: '',
      initFile: [],
      email: ''
    }
  },
  inject: ['reload'],
  methods: {
    ...mapActions('auth', ['sendSupportEmail']),
    // 上传文件打开选择文件窗口
    initCallBack () {
      this.$refs.uploadFile.$refs.qUploader.reset()
      // this.$refs.uploadFile.$refs.qUploader.pickFiles()
    },
    submit () {
      this.loading = true
      const filesModel = []
      const files = this.$refs.uploadFile.$refs.qUploader.files
      // 将files写入submitModel中
      _(files).forEach(file => {
        const fileModel = {
          title: (file.newName || file.name).slice(0, (file.newName || file.name).lastIndexOf('.')),
          filePath: file.pathName || '',
          extension: file.extension,
          size: file.__sizeLabel,
          content: file.content || ''
        }
        filesModel.push(fileModel)
      })
      const submitModel = {
        type: this.type,
        content: this.content,
        email: this.email,
        file: filesModel
      }
      const that = this
      this.sendSupportEmail(submitModel).then(error => {
        this.loading = false
        if (error.code) {
          that.error = that.$t(`auth.error.${error.userMessage}`)
        } else {
          this.reload()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
