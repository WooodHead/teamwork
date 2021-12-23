<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card
      :title="$t('checkins.title')"
      :actions="actions"
      :add="{label:$t('checkins.addLabel'),click:add}"
    >
      <template v-slot:menu>
        <tw-menu
          :menus="menuLists"
          @publicLink="publicLink"
          @bookmark="bookmark()"
          @deleteBookmark="removeBookmark()"
        />
      </template>
    </tw-header-card>
    <q-card-section class="q-px-xxl">
      <div
        v-if="questions.length>0"
        class="q-gutter-y-md"
      >
        <question-card
          v-for="question in questions"
          :key="question.id"
          :question="question"
        />
      </div>
      <tw-banner-no-result v-else />
    </q-card-section>
    <!-- 归档列表 -->
    <q-card-section v-if="archivedCount>0">
      <div class="row justify-center">
        <q-btn
          flat
          :label="$t('archive.someArchived',{count:archivedCount,something:$t('question.title')})"
          icon="class"
          @click.stop="toArchive"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { LocalStorage } from 'quasar'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'CheckinsIndex',
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
    }
  },
  data () {
    return {
      // 是否显示归档问题
      // menus: ['bookmark', { group: ['publicLink'] }]
      myself: LocalStorage.getItem('myself'),
      isBookmark: false
    }
  },
  computed: {
    ...mapState('checkins', ['archivedCount']),
    ...mapState('breadcrumbs', ['resource']),
    ...mapGetters('checkins', ['questionList']),
    questions () {
      return this.questionList
    },
    actions () {
      if (this.showEditMenu) {
        return ['add', 'menu']
      } else { return ['menu'] }
    },
    menuLists () {
      return [this.isBookmark ? 'deleteBookmark' : 'bookmark', { group: ['publicLink'] }]
    }
  },
  mounted () {
    // 获取questionList，参数为objectType，objectID
    this.loadQuestionList({
      objectType: this.category,
      objectID: +this.objectID
    })
    this.loadArchivedCount({
      objectType: this.category,
      objectID: +this.objectID
    })
    this.isExistBookmark()
  },
  methods: {
    ...mapActions('checkins', ['loadQuestionList', 'loadArchivedCount']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    add () {
      this.$router.push({
        name: 'questionAdd',
        params: {
          objectID: +this.objectID,
          category: this.category,
          questionID: 0,
          type: 'add'
        }
      })
    },
    publicLink () {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'question',
          param: encodeURIComponent(JSON.stringify({ objectID: +this.objectID, objectType: this.category })),
          title: this.resource.title
        }
      })
    },
    // 跳转归档区
    toArchive () {
      this.$router.push({
        name: 'archivedQuestions',
        params: {
          category: this.category,
          objectID: +this.objectID
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
        objectID: 0,
        objectType: 'checkins',
        objectTitle: this.$t('checkins.title'),
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
        { Key: 'ObjectID', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'checkins', Oper: 'eq' },
        'and',
        { Key: 'Module.Id', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Module.Type', Value: this.category, Oper: 'eq' }
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
        { Key: 'Owner', Value: this.myself.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'checkins', Oper: 'eq' },
        'and',
        { Key: 'Module.Id', Value: +this.objectID, Oper: 'eq' },
        'and',
        { Key: 'Module.Type', Value: this.category, Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    }
  },
  components: {
    'tw-header-card': () => import('components/base/TwHeaderCard'),
    'tw-menu': () => import('components/base/TwMenu'),
    'question-card': () => import('components/checkins/QuestionCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>
<style scoped>
</style>
