<template>
  <div class="q-pb-sm q-gutter-x-sm">
    <q-btn
      dense
      rounded
      outline
      color="primary"
      label="转需求"
      @click="toServiceForm"
    >
      <q-dialog
        :maximized="$q.screen.lt.sm"
        v-model="showServiceForm"
        transition-show="slide-up"
        transition-hide="slide-down"
        class="full-width"
      >
        <service-form
          class="fit"
          :fields="fields"
          @cancel="()=>{showServiceForm=false;$store.state.service.services=[]}"
        >
          <template v-slot:header>
            <q-bar class="bg-white">
              <q-space />
              <q-btn
                dense
                flat
                icon="close"
                @click="()=>{showServiceForm=false;$store.state.service.services=[]}"
              />
            </q-bar>
          </template>
        </service-form>
      </q-dialog>
    </q-btn>
    <q-btn
      v-if="!$q.screen.gt.xs"
      dense
      rounded
      outline
      color="primary"
      label="打电话"
      type="a"
      :href="person&&person.phone!=''?'tel:'+person.phone:'javascript:void(0);'"
    />
  </div>
</template>

<script>
export default {
  props: {
    objectID: {
      type: [String, Number],
      required: true,
      default: 0
    },
    category: {
      type: String,
      required: true,
      default: 'person'
    },
    person: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      showServiceForm: false,
      fields: {}
    }
  },
  computed: {
    messages () {
      return this.$store.getters[`chat/messagesResource`](this.objectID, this.category)
    }
  },
  methods: {
    // 转需求
    toServiceForm () {
      let files = []
      let notes = ''
      // 转换消息格式
      let messages = _.flatten(_.slice(_.values(this.messages), -1))
      // 获取自己发送的聊天内容
      messages = _.filter(messages, m => m.sent)
      // 定义需求描述
      _.forEach(messages, (message, index) => {
        _.forEach(message.text, text => {
          if (typeof text !== 'object') {
            if (index === 0) notes = `${text}`
            else notes += `\n${text}`
          } else {
            if (_.isArray(text)) files = [...files, ...text]
            else files.push(text)
          }
        })
      })
      const cloneFiles = _.cloneDeep(files)
      // 修正filePath
      _.forEach(cloneFiles, f => { f.filePath = f.path })

      // 初始化服务数据对象
      this.fields = {
        organizeId: this.$myinfo.organizeId,
        owner: this.$myinfo.id,
        connectorId: this.person.id,
        members: [this.$myinfo.id, this.person.id],
        status: 'start',
        notes,
        files: cloneFiles
      }

      // 显示表单弹框
      this.showServiceForm = !this.showServiceForm
    }
  },
  components: {
    ServiceForm: () => import('components/service/ServiceForm')
  }
}
</script>

<style scoped lang="scss">
</style>
