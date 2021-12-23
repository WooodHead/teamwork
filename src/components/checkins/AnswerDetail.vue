<!--
 * @Author: your name
 * @Date: 2020-04-09 10:10:56
 * @LastEditTime: 2020-09-02 13:13:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\pages\checkins\PageAnswer.vue
 -->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
    clickable
  >
    <tw-header-detail>
      <template #menu>
        <tw-menu
          :menus="menus"
          @edit="onEdit(answerID)"
          @delete="onDelete(answerID)"
          @publicLink="onLinkOpen"
          @history="onHistory(answerID)"
        />
      </template>
    </tw-header-detail>
    <div class="q-px-xxl">
      <q-card-section class="header">
        <template>
          <div class="person-name text-weight-normal">{{$t('answer.whoseAnswer',{name:answer.createBy})}}</div>
          <div class="checkin-name text-weight-bold">{{question.content}}</div>
        </template>
      </q-card-section>
      <q-card-section class="answers">
        <answer-card
          :answerID="answerID"
          :menuable="false"
          :discussable="false"
        />
      </q-card-section>
      <q-card-section
        discuss-board
        :class="$q.platform.is.desktop ?'q-mt-md':''"
      >
        <discuss-board
          :objectID="+answerID"
          objectType="answer"
          :objectTitle="$t('answer.whoseAnswer', { name: answer.createBy }) + question.content"
          @submitFinished="onSubmitDiscuss"
        />
      </q-card-section>
      <!-- 订阅 -->
      <q-card-section>
        <tw-subscribe
          :objectID="+answerID"
          objectType="answer"
          :quickSelected="quickSelected"
        />
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
export default {
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
    answerID: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      myInfo: LocalStorage.getItem('myself'),
      quickSelected: null
      // menus: ['edit', 'delete', { group: ['publicLink'] }, { group: ['history'] }]
    }
  },
  computed: {
    menus () {
      if (this.answer.createByID === this.myInfo.id && !this.question.archived) {
        return ['edit', 'delete', { group: ['publicLink'] }, { group: ['history'] }]
      } else {
        return [{ group: ['publicLink'] }, { group: ['history'] }]
      }
    },
    answer () {
      return this.$store.getters['checkins/answer'](+this.answerID)
    },
    question () {
      return this.$store.getters['checkins/question'](+this.answer.questionID)
    }
  },
  watch: {
    $route (to, from) {
      if (to.fullPath !== from.fullPath) {
        this.initAnswer(Number(to.params.answerID))
      }
    }
  },
  components: {
    AnswerCard: () => import('components/checkins/AnswerCard'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail')
  },
  methods: {
    ...mapActions('checkins', ['loadAnswer', 'loadQuestion', 'deleteAnswer', 'updateAnswerCommentCount']),
    ...mapActions('person', ['loadPerson']),
    ...mapActions('member', ['loadMembers']),
    onEdit (answerID) {
      this.$router.push({ // 核心语句
        name: 'answerEdit',
        params: {
          category: this.question.objectType,
          objectID: this.question.objectId,
          questionID: +this.answer.questionID,
          answerID: +answerID
        }
      })
    },
    onDelete (answerID) {
      showConfirm(this.$t('message.reallyDelete'), () => {
        this.deleteAnswer(+answerID)
        this.$router.push({ // 核心语句
          name: 'questionDetail',
          params: {
            category: this.question.objectType,
            objectID: this.question.objectId,
            id: +this.answer.questionID
          }
        })
      })
    },
    onLinkOpen () {
      // 弹出分享框
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'answer',
          param: encodeURIComponent(JSON.stringify({ id: +this.answerID })),
          title: this.question.content
        }
      })
    },
    initAnswer (id) {
      this.loadAnswer(+id).then(answer => {
        this.loadQuestion(+answer.questionID)
      })
    },
    onHistory () {
      // 弹出分享框
      this.$router.push({
        name: 'answerHistory',
        params: {
          category: this.category,
          objectID: +this.objectID,
          questionID: this.question.id,
          id: this.answerID
        }
      })
    },
    onSubmitDiscuss () {
      this.updateAnswerCommentCount({
        id: +this.answerID,
        isAdd: true
      })
    }
  },
  // beforeRouteUpdate (to, from, next) {
  //   // 在当前路由改变，但是该组件被复用时调用
  //   // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  //   // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  //   // 可以访问组件实例 `this`
  //
  //   this.initAnswer(Number(to.params.answerID))
  //   next()
  // },
  mounted () {
    this.initAnswer(+this.answerID)
    // 获取资源类型指定的人员(用于订阅组件快捷选中人员)
    this.category && this.objectID && this.loadMembers({ category: this.category, objectID: +this.objectID }).then(ids => {
      if (ids.length) {
        let IDs = ids.filter(a => a !== this.myInfo.id)
        this.quickSelected = {
          title: this.$t(`${this.category}.title`) + '成员',
          personIDs: IDs
        }
      }
    })
  }
}
</script>
<style scoped>
.answer-subscribe {
  min-height: unset;
  border-top: none;
}
.card-grow-in-page .header {
  color: #283c46;
}
.card-grow-in-page .all-answers {
  text-decoration: underline;
  cursor: pointer;
}
.card-grow-in-page .person-name,
.card-grow-in-page .checin-name {
  color: inherit;
}
.card-grow-in-page .person-name {
  font-size: 1.5em;
}
.card-grow-in-page .checkin-name {
  font-size: 2em;
}
.card-grow-in-page .header h1,
.card-grow-in-page .header h2 {
  line-height: 1.2;
  margin: 0;
}
</style>
