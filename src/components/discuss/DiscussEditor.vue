<template>
  <q-form
    autofocus
    @submit.prevent="onSubmit"
  >
    <quasar-editor
      :value="content"
      @input="(val)=>{discussData.content=val}"
      :folder="objectType"
      :applied="goIntoAction"
      :placeholder="`${$t(`discuss.notes.${type}`)}...`"
    ></quasar-editor>
    <div class="q-gutter-x-sm q-pt-sm q-pl-sm">
      <q-btn
        type="submit"
        color="primary"
        label="添加"
        class="q-px-sm"
        rounded
        unelevated
      />
      <q-btn-dropdown
        v-if="objectType==='assess' && isManufacturerLeader"
        color="primary"
        split
        rounded
        unelevated
        no-caps
        @click="onItemClick(assessReplyList[0])"
      >
        <template v-slot:label>
          <div class="row items-center no-wrap q-gutter-x-sm">
            <q-avatar
              icon="done"
              color="positive"
              size="sm"
            />
            <div class="text-center">
              {{assessReplyList[0].description}}
            </div>
          </div>
        </template>
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="onItemClick(assessReplyList[1])"
          >
            <q-item-section avatar>
              <q-avatar
                icon="mood_bad"
                color="warning"
                text-color="white"
                size="sm"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{assessReplyList[1].description}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown
        v-if="objectType==='allocation' && isManufacturerLeader"
        color="primary"
        split
        no-caps
        unelevated
        rounded
        disable-main-btn
      >
        <template v-slot:label>
          <div class="row items-center no-wrap q-gutter-x-sm">
            <div class="text-center">
              {{model.status}}
            </div>
          </div>
        </template>
        <q-list>
          <q-item
            clickable
            v-close-popup
            v-for="allocationReply in allocationReplyList"
            :key="allocationReply.value"
            @click="onItemClick(allocationReply)"
          >
            <q-item-section>
              <q-item-label>{{allocationReply.description}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </q-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Discuss from '@/store/discuss/model'
import htmlToText from '@/utils/html-to-text'
import { showWarningMessage } from '@/utils/show-message'
export default {
  name: 'DiscussEditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false,
      description: '默认是添加功能。true为编辑功能'
    },
    objectID: {
      type: Number,
      required: true
    },
    objectType: {
      type: String,
      required: true
    },
    objectTitle: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'discuss',
      description: '标题显示。比如：discuss、communication'
    }
  },
  data () {
    return {
      discussData: new Discuss(),
      goIntoAction: false,
      model: {},
      assessReplyList: [
        {
          value: '1',
          text: 'pass',
          description: '评估通过'
        },
        {
          value: '-1',
          text: 'not pass',
          description: '很遗憾，我方不能做'
        }
      ],
      allocationReplyList: [
        {
          value: 1,
          description: '待生产'
        },
        {
          value: 2,
          description: '生产中'
        },
        {
          value: 3,
          description: '待检验'
        },
        {
          value: 4,
          description: '检验中'
        },
        {
          value: 5,
          description: '已检验'
        },
        {
          value: 6,
          description: '已发货'
        },
        {
          value: 7,
          description: '已完成'
        }
      ]
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  },
  computed: {
    ...mapGetters('subscribe', ['subscribe']),
    isManufacturerLeader () {
      return this.model && (+this.$myinfo.id === this.model.manufacturerLeaderID || +this.$myinfo.id === this.model.leaderID)
    }
  },
  methods: {
    ...mapActions('discuss', ['addComment', 'updateComment']),
    ...mapActions('assess', ['loadAssess']),
    ...mapActions('allocation', ['loadAllocation']),
    initAssess () {
      this.loadAssess(+this.objectID).then(res => {
        this.model = res
      })
    },
    initAllocation () {
      this.loadAllocation(+this.objectID).then(res => {
        this.model = res
      })
    },
    onItemClick (val) {
      let content = this.discussData.content
      this.discussData.content = val.description
      Object.assign(this.discussData,
        {
          module: {
            id: this.$route.params.objectID,
            type: this.$route.params.category,
            title: ''
          },
          objectType: this.objectType,
          objectID: +this.objectID,
          objectTitle: this.objectTitle
        })
      let subscribeModel = this.subscribe({ objectType: this.objectType, objectID: this.objectID })

      this.addComment({
        comment: this.discussData,
        msgProps: subscribeModel && subscribeModel.subscribers.length > 0 ? {
          subscribers: subscribeModel.subscribers.map(String),
          route: this.$route,
          title: this.discussData.content,
          content: this.discussData.content
        } : null
      })
      this.discussData.content = content
      this.$emit('submitFinished', val)
    },
    onSubmit () {
      this.goIntoAction = true
      if (htmlToText(this.discussData.content).trim()) {
        // 首先判断是否有订阅人，若有订阅人，则拼接消息model,给订阅人发消息
        let msgProps = null
        let subscribeModel = this.subscribe({ objectType: this.objectType, objectID: this.objectID })
        if (subscribeModel && subscribeModel.subscribers.length > 0) {
          msgProps = {
            subscribers: subscribeModel.subscribers.map(String),
            route: this.$route,
            title: this.objectTitle,
            content: this.discussData.content
          }
        }
        // 添加讨论消息
        if (this.id === 0) {
          Object.assign(this.discussData,
            {
              module: {
                id: this.$route.params.objectID,
                type: this.$route.params.category,
                title: ''
              },
              objectType: this.objectType,
              objectID: +this.objectID,
              objectTitle: this.objectTitle
            })
          this.addComment({ comment: this.discussData, msgProps: msgProps })
          this.discussData.content = ''
          this.$emit('submit')
          this.$emit('submitFinished')
        } else {
          this.updateComment({ id: +this.id, content: this.discussData.content, msgProps: msgProps })
          this.$emit('close')
        }
      } else {
        showWarningMessage(`${this.$t(`discuss.type.${this.type}`)}内容不能为空`)
      }
    }
  },
  mounted () {
    this.discussData.content = this.content
    if (this.objectType === 'assess') {
      this.initAssess()
    }
    if (this.objectType === 'allocation') {
      this.initAllocation()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
