<template>
  <tw-form
    inset
    @primary="onSubmit"
    action-align="left"
  >
    <slot name="header"></slot>
    <q-btn
      v-if="+id === 0"
      rounded
      unelevated
      icon="add"
      :label="$t('file.btns.fileDropdown')"
      color="positive"
      text-color="white"
      class="q-mb-sm"
    >
      <q-menu auto-close>
        <q-list>
          <div
            v-for="item in uploaderSettings"
            :key="item.id"
          >
            <q-item
              clickable
              v-close-popup
              @click="itemClick(item.id)"
              color="primary"
            >
              <q-item-section avatar>
                <q-avatar :icon="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t(`file.btns.${item.id}`) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-menu>
    </q-btn>

    <upload-file
      multiple
      :showAddBtn="false"
      :accept="accept"
      :capture="capture"
      :files="serviceObj.files"
      ref="uploadFile"
    />
    <div class="q-col-gutter-md">
      <q-input
        autofocus
        v-model.trim="serviceObj.notes"
        :placeholder="$t('service.description')"
        type="textarea"
        filled
      />

      <tw-select-edit
        :value="serviceObj.type"
        @input="payload => {serviceObj.type = payload.dictValue;}"
        :editable="!!$myinfo.auth.role.isSystemAdministrator"
        module="service"
        field="serviceInfo"
        filled
        :label="$t('dictionary.serviceInfo')"
        style="width:210px;"
      />

      <div v-if="serviceObj.id > 0">
        <q-field
          filled
          :label="$t('auth.acl.acl')"
          stack-label
          color="grey-8"
        >
          <q-option-group
            :options="options"
            type="radio"
            v-model.trim="serviceObj.acl"
          />
        </q-field>
      </div>
    </div>
  </tw-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Service from '@/store/service/model.js'
import { showSuccessMessage } from '@/utils/show-message'
const config = require('app/app.config.js')
export default {
  name: 'ServiceForm',
  components: {
    TwSelectEdit: () => import('components/base/select-edit/TwSelectEdit'),
    UploadFile: () => import('components/service/UploadFile'),
    TwForm: () => import('components/base/TwForm')
  },
  props: {
    id: {
      type: [String, Number],
      required: false,
      default: 0
    },
    openType: {
      type: String,
      default: ''
    },
    fields: { type: Object, desc: '新建时，部分字段的初始值' }
  },
  data () {
    return {
      // 如果不深复制，会污染初始model
      serviceObj: _.cloneDeep(new Service()),
      options: [
        { label: this.$t('auth.acl.public'), value: 0 },
        { label: this.$t('auth.acl.restrict'), value: 1 },
        {
          label: this.$t('auth.acl.secret', {
            category: this.$t('service.title')
          }),
          value: 2
        }
      ],
      accept: '',
      capture: '',
      config: config
    }
  },
  computed: {
    ...mapState('file', ['uploaderSettings']),
    widgets () {
      return this.$store.getters['resource/initWidgets']('service')
    }
  },
  mounted () {
    if (+this.id > 0) {
      this.loadService(+this.id).then(res => {
        if (res) this.serviceObj = res
      })
    } else {
      Object.assign(this.serviceObj, this.fields)
      if (Object.keys(this.widgets).length) {
        this.serviceObj.widgets = this.widgets
      } else {
        this.loadCategory('service').then(category => {
          this.serviceObj.widgets = this.widgets
        })
      }
    }
  },
  methods: {
    ...mapActions('service', ['loadService', 'addService', 'updateService']),
    ...mapActions('resource', ['loadCategory']),
    ...mapActions('document', ['uploadTagDocument']),
    itemClick (type) {
      let uploaderSetting = _.find(this.uploaderSettings, { id: type })
      this.accept = uploaderSetting.accept
      this.capture = uploaderSetting.capture
      // 按照新的设置，触发上传
      let that = this
      this.$nextTick().then(() => {
        that.$refs.uploadFile.$refs.qUploader.pickFiles()
      })
    },
    // 编辑后保存
    onSubmit () {
      if (this.serviceObj.id > 0) {
        this.updateService(this.serviceObj).then(res => {
          showSuccessMessage('保存成功')
          // 保存成功后跳转至工程服务详情页
          this.$router.push({
            name: 'serviceDetail',
            params: { id: this.id }
          })
        })
      } else {
        // 添加需求
        this.addService(this.serviceObj).then(m => {
          this.$emit('cancel')
          this.serviceObj.status !== 'wait' &&
            this.$router.push({
              name: 'serviceDetail',
              params: { id: m.id }
            })
        })
      }
    },
    // 取消
    onReset () {
      this.$nextTick(() => {
        if (this.serviceObj.id > 0) {
          this.$router.push({
            params: { id: this.id },
            name: 'serviceDetail'
          })
        } else {
          this.serviceObj = {}
          this.$emit('cancel')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-uploader__list {
  min-height: 0;
}
.service-border {
  border: solid 1px lightgray;
  border-radius: 4px;
}
</style>
