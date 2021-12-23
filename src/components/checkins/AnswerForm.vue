<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-y-md"
  >
    <q-input
      class="q-pb-sm"
      :label="$t('answer.date')"
      v-model="model.postDate"
      outlined
      @click="time=true"
    >
      <template v-slot:prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
          @click="time=true"
        >
        </q-icon>
      </template>
    </q-input>
    <quasar-editor
      @input="(val)=>{model.content=val}"
      :value="content"
      :folder="category"
      :applied="goIntoAction"
      placeholder="请填写你的答案..."
    ></quasar-editor>
    <div>
      <q-btn
        :label="$t('answer.postMyAnswer')"
        type="submit"
        color="primary"
      />
    </div>
    <tw-choose-notify
      v-if="!categoryModel.isTemplate"
      :module="{category,id:+objectID}"
      :widget="{category:'answer',id:+answerID}"
      :always="true"
      :notifyHint="$t('subscribe.whenIPostThisANotificationWillBeSentTo')"
      initMemberDutys="leader"
      :subscribers.sync="subscribers"
    />
    <q-dialog v-model="time">
      <q-date
        v-model="model.postDate"
        :mask="formatString"
        today-btn
      />
    </q-dialog>
  </q-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { LocalStorage } from 'quasar'
import Checkin from '@/store/checkins/model'
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'AnswerForm',
  mixins: [getCategory],
  props: {
    category: {
      type: String,
      required: false,
      default: 'project'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    questionID: {
      type: [Number, String],
      required: false,
      default: 0
    },
    answerID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  components: {
    TwChooseNotify: () => import('components/base/TwChooseNotify'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  },
  data () {
    return {
      myinfo: LocalStorage.getItem('myself') || {},
      formatString: 'YYYY-MM-DD',
      model: new Checkin.Answer(),
      time: false,
      content: '',
      subscribers: [],
      goIntoAction: false
    }
  },
  methods: {
    ...mapActions('checkins', ['addAnswer', 'updateAnswer', 'loadAnswer']),
    onSubmit () {
      this.goIntoAction = true
      this.model.questionID = +this.questionID
      this.model.objectId = +this.objectID
      this.model.objectType = this.category
      this.model.objectTitle = this.resource.title // todo
      // 订阅人员处理
      this.model.subscribers = this.subscribers
      if (this.model.id) {
        // 调用更新方法
        this.updateAnswer({ ...this.model }).then(res => {
          if (res) {
            this.$emit('submit', res)
            // 路由跳转
            this.$router.push({
              name: 'questionDetail',
              params: {
                category: this.category,
                objectID: +this.objectID,
                id: +this.questionID
              }
            })
          }
        })
      } else {
        this.addAnswer({ ...this.model }).then(res => {
          res && this.$emit('submit', res)
        })
      }
    }
  },
  computed: {
    ...mapState('breadcrumbs', ['resource'])
  },
  mounted () {
    if (+this.answerID !== 0) {
      let that = this
      this.loadAnswer(+this.answerID).then(answer => {
        Object.assign(that.model, _.cloneDeep(answer))
        answer && (this.content = answer.content)
      })
    }
  }
}
</script>
<style scoped>
.editor {
  min-height: calc(100vh - 450px);
}
.hr {
  border: none;
  height: 1px;
  background-color: lightgray;
}
</style>
