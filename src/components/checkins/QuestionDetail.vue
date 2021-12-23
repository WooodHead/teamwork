<!--
 * @Author: your name
 * @Date: 2020-04-09 10:06:25
 * @LastEditTime: 2020-08-07 09:16:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \teamwork\src\pages\checkins\PageQuestion.vue
 -->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
    clickable
  >
    <tw-header-detail :noMenu="question.archived">
      <template #menu>
        <tw-menu
          :menus="menusList"
          @edit="editQuestion(id)"
          @move="moveQuestion(id)"
          @copy="copyQuestion(id)"
          @archive="onArchive(id)"
          @delete="onDelete(id)"
          @publicLink="onLinkOpen"
          @history="onHistory(id)"
          @seeSomeoneAnswers="seeSomeoneAnswers(id)"
          @bookmark="bookmark()"
          @deleteBookmark="removeBookmark()"
        />
      </template>
    </tw-header-detail>
    <q-card-section
      v-if="question.archived"
      class="q-px-xxl"
    >
      <tw-archive-notes
        :id="id"
        type="question"
        :label="$t('question.title')"
        :archiveTime="question.archiveTime"
        :archiveBy="question.archiveBy"
        @delete="onDeleteFromArchived"
      />
    </q-card-section>
    <div class="q-px-xxl">
      <question-header
        :id="id"
        :showEdit="false"
      />
      <question-content :id="id" />
    </div>
  </q-card>
</template>
<script>
import { mapActions } from 'vuex'
import { showConfirm } from '@/utils/show-confirm'
import { LocalStorage } from 'quasar'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'QuestionDetail',
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
    id: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      // 需要显示的菜单按钮
      // menus: ['edit', 'move', 'copy', 'archive', 'delete', 'bookmark', { group: ['publicLink'] }, { group: ['history'] }],
      myself: LocalStorage.getItem('myself'),
      isBookmark: false
    }
  },
  components: {
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    QuestionContent: () => import('components/checkins/QuestionContent'),
    QuestionHeader: () => import('components/checkins/QuestionHeader')
  },
  computed: {
    question () {
      return this.$store.getters['checkins/question'](+this.id)
    },
    // 菜单
    menusList () {
      return ['edit', 'move', 'copy', 'archive', 'delete', this.isBookmark ? 'deleteBookmark' : 'bookmark',
        { group: ['publicLink'] }, { group: ['history', 'seeSomeoneAnswers'] }]
    }
  },
  watch: {
    'question': {
      deep: true,
      handler (newVal, oldVal) {
        this.$route.meta.label = newVal.content
        document.title = `${newVal.content} | TeamWork`
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.loadQuestion(Number(to.params.id))
    next()
  },
  mounted () {
    this.loadQuestion(+this.id)
    this.isExistBookmark()
    this.$route.meta.label = this.question.content
    document.title = `${this.question.content} | TeamWork`
  },
  methods: {
    ...mapActions('checkins', ['loadQuestion', 'archiveQuestion', 'deleteQuestion']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    editQuestion (id) {
      this.$router.push({ // 核心语句
        name: 'questionEdit',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +id
        }
      })
    },
    moveQuestion (id) {
      this.$router.push({
        name: 'questionMove',
        params: {
          id: +id,
          category: this.question.objectType,
          objectID: +this.question.objectId
        }
      })
    },
    copyQuestion (id) {
      this.$router.push({
        name: 'questionCopy',
        params: {
          id: +id,
          category: this.question.objectType,
          objectID: +this.question.objectId
        }
      })
    },
    onArchive (id) {
      this.archiveQuestion(+id)
    },
    onDelete (id) {
      showConfirm(this.$t('question.reallyDelete'), () => {
        this.deleteQuestion(+id)
        if (this.isBookmark) {
          this.removeBookmark()
        }
        this.$router.push({ // 核心语句
          name: 'checkins',
          params: {
            category: this.category,
            objectID: +this.objectID
          }
        })
      })
    },
    onDeleteFromArchived () {
      if (this.isBookmark) {
        this.removeBookmark()
      }
      this.$router.push({ // 核心语句
        name: 'checkins',
        params: {
          category: this.category,
          objectID: +this.objectID
        }
      })
    },
    onLinkOpen () {
      // 弹出分享框
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'question',
          param: encodeURIComponent(JSON.stringify({
            objectType: this.category,
            objectID: +this.objectID,
            id: this.question.id
          })),
          title: this.question.content
        }
      })
    },
    onHistory () {
      // 历史记录
      this.$router.push({
        name: 'questionHistory',
        params: {
          objectType: this.category,
          objectID: +this.objectID,
          id: this.question.id
        }
      })
    },
    seeSomeoneAnswers () {
      // 查看某个人的回答
      this.$router.push({
        name: 'selectAnswerPersons',
        params: {
          objectType: this.category,
          objectID: +this.objectID,
          id: this.question.id
        }
      })
    },
    // 添加书签
    bookmark () {
      const { name, params, path } = this.$route
      let bookmark = new Bookmark({
        module: {
          id: +this.objectID,
          title: '',
          type: this.category
        },
        route: { name, params, path },
        objectID: +this.id,
        objectType: 'checkins',
        objectTitle: this.question.content,
        owner: this.myself.id
      })
      this.addBookmark(bookmark).then(res => {
        if (res) {
          this.isBookmark = true
          showSuccessMessage(this.$t(`bookmark.addBookmarkSuccess`))
        } else {
          showWarningMessage(this.$t(`bookmark.addBookmarkFail`))
        }
      })
    },
    // 移除书签
    removeBookmark () {
      let query = [
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'checkins', Oper: 'eq' }
      ]
      this.deleteBookmark(query).then(res => {
        if (res) {
          this.isBookmark = false
          showSuccessMessage(this.$t(`bookmark.delBookmarkSuccess`))
        } else {
          showWarningMessage(this.$t(`bookmark.delBookmarkFail`))
        }
      })
    },
    // 判断当前页面是否存在书签
    isExistBookmark () {
      let query = [
        { Key: 'Owner', Value: +this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'checkins', Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    }
  }
}
</script>
<style scoped>
</style>
