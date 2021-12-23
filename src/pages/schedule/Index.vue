<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs
      moduleSwitchable
      @switchTo="switchTo"
    ></tw-breadcrumbs>
    <q-card
      v-show="!clickEvent"
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <tw-header-card
        :title="$t('schedule.title')"
        :actions="actions"
        :add="{
          label: $t('schedule.newEvent'),
          click: ()=>addingEvent=true
        }"
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
        <div class="full-width column items-center">
          <tw-calendar
            style=" max-width: 800px;width: 100%;"
            v-bind="{category:category,objectID:+objectID}"
          />
        </div>
      </q-card-section>
      <q-card-section
        v-if="archivedCount>0"
        class="q-px-xxl"
      >
        <tw-archived-count
          align="start"
          :inset="false"
          :label="$t('archive.someArchived',{count:archivedCount,something:$t('schedule.event')})"
          @click="$router.push({name:'archivedEvents',params:{category,objectID}})"
        />
      </q-card-section>
    </q-card>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapMutations, mapActions } from 'vuex'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import Bookmark from '@/store/bookmark/model'
const my = LocalStorage.getItem('myself') || {}
export default {
  name: 'PageSchedule',
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: () => {
        return my.id
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwCalendar: () => import('components/calendar/TwCalendar'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwMenu: () => import('components/base/TwMenu'),
    TwArchivedCount: () => import('components/base/TwArchivedCount'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  data () {
    return {
      actions: ['add', 'menu'],
      // menus: ['bookmark', { group: ['publicLink'] }],
      myself: LocalStorage.getItem('myself'),
      isBookmark: false
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    ...mapState('schedule', ['event', 'archivedCount']),
    addingEvent: {
      get () {
        return this.$store.state.schedule.addingEvent
      },
      set (value) {
        this.setAddingEvent(value)
      }
    },
    clickEvent: {
      get () {
        return this.$store.state.schedule.clickEvent
      },
      set (value) {
        this.setClickEvent(value)
      }
    },
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    },
    routeEvent () {
      return {
        route: this.$route,
        event: this.event
      }
    },
    menuLists () {
      return [this.isBookmark ? 'deleteBookmark' : 'bookmark', { group: ['publicLink'] }]
    }
  },
  watch: {
    resource: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
        this.loadArchivedCount({
          resourceCategory: this.category,
          resourceId: +this.objectID
        })
      }
    },
    routeEvent: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        const newRoute = newVal.route || { params: {} },
          id = +newRoute.params.id
        this.clickEvent = (newRoute.name !== 'schedule')

        // 当不在日程主页时，加入日程主页面包屑
        newRoute.name !== 'schedule'
          ? this.pushWidgetBreadcrumb({
            id: `${this.category}${this.objectID}ScheduleIndex`,
            title: this.widgets.schedule.label,
            to: { name: 'schedule', params: { category: this.category, objectID: this.objectID } },
            click: () => {
              this.clickEvent = false
              this.$router.push({ name: 'schedule', params: { category: this.category, objectID: this.objectID } })
            }
          })
          : this.clearWidgetBreadcrumbs()

        if (!id || !newVal.event) { return }
        // 设置归档区面包屑
        newRoute.name === 'eventDetail' && newVal.event.archived
          ? this.pushWidgetBreadcrumb({
            id: 'archivedEvents',
            title: this.$t('schedule.archivedEvents'),
            to: {
              name: 'archivedEvents',
              params: {
                category: this.category,
                objectID: +this.objectID
              }
            }
          })
          : this.deleteWidgetBreadcrumb('archivedEvents')
          // 设置日程实例面包屑
        newRoute.name.includes('event') && newRoute.name !== 'eventDetail'
          ? this.pushWidgetBreadcrumb({
            id: newVal.event.id,
            title: newVal.event.title,
            to: {
              name: 'eventDetail',
              params: {
                id: id,
                category: this.category,
                objectID: +this.objectID
              }
            }
          })
          : this.deleteWidgetBreadcrumb(id)
      }
    }
  },
  methods: {
    ...mapActions('resource', ['loadCategory', 'loadCustomCategoryOfItem']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', ['pushWidgetBreadcrumb', 'clearWidgetBreadcrumbs', 'deleteWidgetBreadcrumb']),
    ...mapMutations('schedule', ['setAddingEvent', 'setClickEvent']),
    ...mapActions('schedule', ['loadArchivedCount']),
    ...mapActions('bookmark', ['loadBookmarks', 'addBookmark', 'deleteBookmark', 'existBookmark']),
    switchTo (resource) {
      this.$router.replace(
        {
          name: 'schedule',
          params: { category: resource.category.name, objectID: +resource.id }
        })
      window.scrollTo(0, 0)
    },
    publicLink () {
      this.$router.push({
        name: 'generatePublicLink',
        params: {
          category: 'schedule',
          param: encodeURIComponent(JSON.stringify({ objectID: Number(this.objectID), category: this.category })),
          title: this.$store.state.breadcrumbs.resource.title + '的' + this.$t('schedule.title')
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
        objectType: 'schedule',
        objectTitle: this.$t('schedule.title'),
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
        { Key: 'ObjectType', Value: 'schedule', Oper: 'eq' },
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
        { Key: 'ObjectType', Value: 'schedule', Oper: 'eq' },
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
  mounted () {
    this.isExistBookmark()
  }
}
</script>

<style lang="scss" scoped>
</style>
