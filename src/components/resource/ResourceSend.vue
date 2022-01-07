<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <tw-header-card
      :title="$t('message.send.sendTo')"
      :actions="[]"
    >
    </tw-header-card>
    <q-card-section class="q-px-xxl">
      <div class="row q-gutter-lg">
        <!-- 左侧卡片显示区域 -->
        <div v-if="['notice','document'].includes(type)">
          <document-card :file="file" />
        </div>
        <q-card
          v-else
          :class="cardStyle+'-card'"
        >
          <q-card-section>
            <component
              v-if="ids!==''"
              :is="`${capitalize(type)}IntroBatch`"
              :ids="ids"
              :category="category"
              :objectID="objectID"
            />
            <component
              v-else
              :is="`${capitalize(type)}Intro`"
              :param="{id: +id, category: category, objectID: objectID}"
              :id="+id"
            />
          </q-card-section>
        </q-card>
        <!-- 右侧操作区域 -->
        <div
          class="col-grow q-gutter-y-md"
          style="flex-basis:0"
        >
          <q-banner class="bg-grey-3">
            <template v-slot:avatar>
              <q-icon
                name="info"
                color="info"
              />
            </template>
            <span
              v-html="$t('message.send.sendMessage',{type:$t(`${type}.title`)})"
              class="text-body1"
            ></span>
          </q-banner>
          <person-select-panel
            flat
            multiple
            :isShowButton="false"
            class="person-select-panel"
            @multiSelect="personIds"
            @multiSelectAll="personIds"
            @selectGroup="personIds"
            :objectType="category || ducumentObjectTypeAndID.category"
            :objectID="objectID || ducumentObjectTypeAndID.objectID"
            :initSelectedPersonIDs="addSelectIds"
            :initPersonScope="membersByOrganize"
          >
            <div class="text-right">
              <q-btn
                flat
                dense
                class="text-body2"
                :label="$t('message.send.addMembers')"
                color="primary"
                @click="showSelect=true"
              />
            </div>
          </person-select-panel>
          <q-card-actions class="q-mb-md q-pl-none justify-end">
            <q-btn
              dense
              :label="$t('message.send.send')"
              color="primary"
              @click="send"
            />
          </q-card-actions>
        </div>
      </div>
    </q-card-section>
    <!-- 添加人员弹出框 -->
    <q-dialog
      v-model="showSelect"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <person-select-panel
        style="width: 600px; max-width: 90vw;"
        @multiSelect="multiSelect"
        :isVirtualScroll="true"
        :multiple="true"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage, format } from 'quasar'
import Activity from '@/store/activity/model'
import Message from '@/store/message/model'
const { capitalize } = format
export default {
  name: 'ResourceSend',
  props: {
    id: {
      type: [Number, String],
      required: true,
      description: '各模块Id：noticeId、documentId'
    },
    type: {
      type: String,
      required: true,
      description: '各模块类型：notice、document'
    },
    objectID: {
      type: [Number, String],
      required: false,
      description: '资源Id'
    },
    category: {
      type: String,
      required: false,
      description: '资源类型：如project'
    },
    cardStyle: {
      type: String,
      default: 'torn', // whole
      required: false,
      description: '撕边/完整卡片'
    },
    ids: {
      type: String,
      required: false,
      default: '',
      description: '批量移动和复制的ids'
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    PersonSelectPanel: () => import('components/person/PersonSelectPanel'),
    FolderCard: () => import('components/document/folder/FolderCard'),
    DocumentCard: () => import('components/document/DocumentCard'),
    TaskIntro: () => import('components/task/TaskIntro')
  },
  data () {
    return {
      showSelect: false,
      selectedPersonIds: [],
      addSelectIds: [],
      members: [],
      file: {},
      fileObjectTypeAndID: { category: '', objectID: 0 }
    }
  },
  computed: {
    membersByOrganize () {
      return this.members || []
    },
    ducumentObjectTypeAndID () {
      return this.fileObjectTypeAndID
    }
  },
  mounted () {
    // 获取文档或公告model
    if (['notice', 'document', 'task'].includes(this.type)) {
      this.$store.dispatch(`${this.type}/load${capitalize(this.type)}`, +this.id).then((model) => {
        if (model) {
          this.file = model
          // this.file.classify = 'task'
          // this.file.objectID = this.objectID
          // 从文档模块处进入项目、团队、产品文档夹时，category、objectID为空，但发送界面需要默认显示人员，所以需要给person-select-pane给值
          if (this.type === 'document' && !this.category && !this.objectID &&
            ['project', 'team', 'productDev'].includes(this.file.objectType)) {
            Object.assign(this.fileObjectTypeAndID, { category: this.file.objectType, objectID: +this.file.objectID })
          }
          // 机构公告/文档
          if (this.file.objectType === 'organize') {
            this.loadOrganize(this.file.objectID).then(res => {
              if (res) this.members = res.members
            })
          }
        }
      })
    }
  },
  methods: {
    ...mapActions('message', ['addMessage']),
    ...mapActions('organize', ['loadOrganize']),
    ...mapActions('activity', ['addActivity']),
    capitalize,
    multiSelect (addSelectIds) {
      this.showSelect = false
      this.addSelectIds = []
      addSelectIds.forEach(item => {
        this.addSelectIds.push(item.id)
      })
      this.addSelectIds = _.union(this.selectedPersonIds, this.addSelectIds)
      this.selectedPersonIds = _.cloneDeep(this.addSelectIds)
    },
    personIds (selectedPersons) {
      this.selectedPersonIds = []
      selectedPersons.forEach(item => {
        this.selectedPersonIds.push(item.id)
      })
    },
    sendResource () {
      const my = LocalStorage.getItem('myself') || {}
      let selectedPersonIdsExceptMy = _.filter(this.selectedPersonIds, function (o) { return o !== my.id })
      if (selectedPersonIdsExceptMy && selectedPersonIdsExceptMy.length) {
        let params = { id: +this.id }
        if (this.category) {
          Object.assign(params, { category: this.category, objectID: +this.objectID })
        }
        let path = this.$route.path.split('/'), path2 = path.slice(1, path.length - 1)
        // 发送消息
        let message = new Message({
          type: this.type === 'document' ? 'doc' : this.type,
          title: this.file && (this.file.title || this.file.name),
          module: {
            id: this.file && this.file.objectID,
            type: this.file && this.file.objectType,
            title: ''
          },
          route: {
            name: this.type === 'notice' ? 'noticeDetail' : (this.file && this.file.classify) + 'Detail',
            params: params,
            path: path2 && ('/').concat(path2.join('/'))
          },
          senderID: my.id,
          senderName: my.name,
          senderImg: my.img,
          sendTime: '',
          receiveBy: selectedPersonIdsExceptMy,
          extra: { Content: this.file && this.file.content }
        })
        this.addMessage(message).then((model) => {
          // 添加动态
          if (model && this.file) {
            let docObjectType = '', docObjectID = 0// 文档的objectType和objectId
            if (this.file.objectType !== 'document') {
              docObjectType = this.file.objectType
              docObjectID = this.file.objectID
            } else {
              docObjectType = 'document'
              docObjectID = this.file.id
            }
            let activity = new Activity({
              objectType: this.type === 'document' ? docObjectType : this.file.objectType,
              objectId: this.type === 'document' ? docObjectID : this.file.objectID,
              objectTitle: this.type === 'document' ? this.file.title : model.module.title,
              actor: my.name,
              actorId: my.id,
              action: 'send',
              actTime: '',
              widget: {
                id: this.file.id,
                type: this.type,
                title: this.file.title,
                detail: selectedPersonIdsExceptMy
              },
              description: `Send${capitalize(this.type)}`
            })
            if (this.type === 'document') {
              activity.widget.on = {
                id: this.file.id,
                type: this.file.classify,
                title: this.file.title
              }
            }
            this.addActivity(activity)
            // 发送消息
            let history = {
              ID: this.id,
              Title: this.file.title,
              history: { personIds: selectedPersonIdsExceptMy }
            }
            this.$store.dispatch(`${this.type}/addHistoryBySendMessage`, history)
          }
        })
        let strName = ''
        if (this.type === 'notice') {
          strName = 'noticeDetail'
        } else if (this.type === 'task') {
          strName = 'taskDetail'
        } else {
          strName = (this.file && this.file.classify) + 'Detail'
        }
        this.$router.push({
          name: strName,
          params: params
        })
      }
    },
    send () {
      if (this.file.acl) {
        this.$q.dialog({
          title: '温馨提示',
          message: '发送的是保密文档，将把接收人加入文档访问的白名单？',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.sendResource()
        }).onCancel(() => { })
      } else {
        this.sendResource()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.person-select-panel > .q-card__section--vert {
    padding-left: 0px;
    padding-right: 0px;
  }
</style>
