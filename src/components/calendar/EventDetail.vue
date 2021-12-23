<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-detail>
      <template #menu>
        <tw-menu
          :menus="menusList"
          @edit="action('edit')"
          @move="action('move')"
          @copy="action('copy')"
          @archive="openConfirm('archive')"
          @delete="openConfirm('delete')"
          @publicLink="publicLink"
          @history="onHistory(id)"
          @bookmark="bookmark()"
          @deleteBookmark="removeBookmark()"
        />
      </template>
    </tw-header-detail>
    <div class="q-px-xxl">
      <!-- 归档说明区 -->
      <q-card-section v-if="event.archived">
        <tw-archive-notes
          :id="event.id"
          :type="type"
          :label="$t('schedule.event')"
          :archiveBy="event.archiveBy"
          :archiveTime="event.archiveTime"
          @delete="actionThen['delete'](1)"
        />
      </q-card-section>

      <event-content :event="event" />

      <q-card-section :class="{'q-ml-md':$q.screen.lt.sm}">
        <tw-boost-pack
          :boostTo="event.modifyBy"
          :objectID="+id"
          :objectType="type"
          :messageTitle="event.title"
        />
      </q-card-section>

      <q-card-section>
        <discuss-board
          :objectID="+id"
          :objectType="type"
          :objectTitle="event.title"
        />
      </q-card-section>

      <!-- 订阅 -->
      <q-card-section>
        <tw-subscribe
          :objectID="+id"
          :objectType="type"
          :quickSelected="quickSelected"
        />
      </q-card-section>
    </div>
    <event-confirm
      :action="curAction"
      :confirm.sync="confirm"
      @justThis="justThis"
    />
  </q-card>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Event from '@/store/schedule/model'
import { format, LocalStorage } from 'quasar'
import { showConfirm } from '@/utils/show-confirm'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
const { capitalize } = format
export default {
  name: 'EventDetail',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    }
  },
  data () {
    const that = this
    return {
      menus: ['edit', 'move', 'copy', 'archive', 'delete', 'bookmark', 'publicLink', 'history'],
      type: 'event',
      event: new Event(),
      confirm: false,
      curAction: 'archive',
      actionThen: {
        archive: (res) => {
          res && Object.assign(that.event, res)
        },
        delete: (res) => {
          res && that.$router.push({
            name: 'schedule',
            params: {
              category: that.category,
              objectID: +that.objectID
            }
          })
        }
      },
      myself: LocalStorage.getItem('myself'),
      isBookmark: false,
      quickSelected: null
    }
  },
  components: {
    TwMenu: () => import('components/base/TwMenu'),
    TwHeaderDetail: () => import('components/base/TwHeaderDetail'),
    TwArchiveNotes: () => import('components/base/TwArchiveNotes'),
    TwBoostPack: () => import('components/boost/TwBoostPack'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe'),
    EventContent: () => import('components/calendar/EventContent'),
    EventConfirm: () => import('components/calendar/EventConfirm')
  },
  mounted () {
    this.initEvent(Number(this.id))
    this.isExistBookmark()
    // 获取资源类型指定的人员(用于订阅组件快捷选中人员)
    this.category && this.objectID && this.loadMembers({ category: this.category, objectID: +this.objectID }).then(ids => {
      if (ids.length) {
        let IDs = ids.filter(a => a !== this.myself.id)
        this.quickSelected = {
          title: this.$t(`${this.category}.title`) + '成员',
          personIDs: IDs
        }
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.initEvent(Number(to.params.id))
    next()
  },
  computed: {
    ...mapState('schedule', ['repeatType']),
    // 菜单
    menusList () {
      this.isBookmark ? this.$set(this.menus, _.indexOf(this.menus, 'bookmark'), 'deleteBookmark') : this.$set(this.menus, _.indexOf(this.menus, 'deleteBookmark'), 'bookmark')
      return this.menus
    }
  },
  watch: {
    'event.archived': {
      deep: true,
      handler: function (newV, oldV) {
        if (newV) {
          this.menus = ['move', 'copy', { group: ['publicLink'] }, { group: ['history'] }]
        } else {
          this.menus = ['edit', 'move', 'copy', 'archive', 'delete', 'bookmark', { group: ['publicLink'] }, { group: ['history'] }]
        }
      }
    },
    '$store.state.schedule.event': {
      handler: function (newV, oldV) {
        newV && Object.assign(this.event, newV)
      }
    }
  },
  methods: {
    ...mapActions('member', ['loadMembers']),
    ...mapMutations('schedule', ['setClickEvent', 'setSelectedDateBetween']),
    ...mapActions('schedule', ['loadEvent', 'archiveEvent', 'unarchiveEvent', 'deleteEvent']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    initEvent (id) {
      this.loadEvent(+id).then((event) => {
        this.event = event
        // 如果当前选定的日期不在该事件的时间范围内，这选定事件的起始时间
        const { startTime, endTime } = event
        if (!(event.archived || event.deleted)) {
          // 归档和删除的日程不影响日历当前日期
          this.setSelectedDateBetween({ startTime, endTime })
        }
      })
    },
    action (name) {
      const params = {
        id: +this.id,
        category: this.category,
        objectID: +this.objectID
      }
      this.$router.push({
        name: `event${capitalize(name)}`,
        params
      })
    },
    openConfirm (action) {
      this.curAction = action
      if (this.event.repeat.type !== this.repeatType.DONT_REPEAT) {
        this.confirm = true
      } else {
        if (action === 'delete') {
          showConfirm(this.$t('action.reallyDelete'), () => {
            this[`${this.curAction}Event`]({ id: this.event.id })
              .then((res) => {
                if (this.isBookmark) {
                  this.removeBookmark()
                }
                this.confirm = false
                this.actionThen[this.curAction](res)
              })
          })
        } else {
          this[`${this.curAction}Event`]({ id: this.event.id })
            .then((res) => {
              this.confirm = false
              this.actionThen[this.curAction](res)
            })
        }
      }
    },
    publicLink () {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'event',
          param: encodeURIComponent(JSON.stringify({ id: +this.id })),
          title: this.event.title,
          cardStyle: 'torn'
        }
      })
    },
    justThis (justThis) {
      this[`${this.curAction}Event`]({ justThis, id: this.event.id })
        .then((res) => {
          this.confirm = false
          this.actionThen[this.curAction](res)
        })
    },
    // 历史记录
    onHistory () {
      // 弹出分享框
      this.$router.push({
        name: 'eventHistory',
        params: {
          category: this.category,
          objectID: +this.objectID,
          id: +this.id
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
        objectType: 'schedule',
        objectTitle: this.event && this.event.title,
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
        { Key: 'ObjectType', Value: 'schedule', Oper: 'eq' }
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
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
        'and',
        { Key: 'ObjectType', Value: 'schedule', Oper: 'eq' }
      ]
      this.existBookmark(query).then(res => {
        this.isBookmark = res
      })
    }
  }
}
</script>

<style>
</style>
