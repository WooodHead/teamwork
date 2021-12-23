import { mapState, mapMutations, mapActions } from 'vuex'
import Activity from '@/store/activity/model'
export default {
  data () {
    return {
      noMore: false
    }
  },
  components: {
    TwActivityTimeline: () => import('components/activity/TwActivityTimeline'),
    TwAvatar: () => import('components/base/TwAvatar'),
    MindMap: () => import('components/document/markmap/MindMap'),
    TaskActivity: () => import('components/activity/TaskActivity'),
    ApprovalActivity: () => import('components/activity/ApprovalActivity'),
    SuspendActivateActivity: () => import('components/activity/SuspendActivateActivity'),
    MemberActivity: () => import('components/activity/MemberActivity'),
    DiscussActivity: () => import('components/activity/DiscussActivity'),
    EventActivity: () => import('components/activity/EventActivity'),
    NoticeActivity: () => import('components/activity/NoticeActivity'),
    AddModifyActivity: () => import('components/activity/AddModifyActivity'),
    ServiceActivity: () => import('components/activity/ServiceActivity'),
    ResumeActivity: () => import('components/activity/ResumeActivity'),
    ResumeInviteActivity: () => import('components/activity/ResumeInviteActivity'),
    RecruitPlanActivity: () => import('components/activity/RecruitPlanActivity'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  computed: {
    ...mapState('activity', ['page']),
    layout () {
      return this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose')
    }
  },
  methods: {
    isObject: _.isObject,
    ...mapMutations('activity', ['initPage', 'clearActivitys', 'updateCacheDataFlag']),
    ...mapActions('activity', ['loadActivityPageList']),

    loadActivity (index, done, objectType, objectID) {
      this.loadActivityPageList({
        objectType: objectType,
        objectID: objectID,
        pageIndex: index,
        query: this.query,
        limit: this.page.limit
      }).then(
        (activitys) => {
          this.noMore = (this.page.nextPageToken === -1)
          done(this.noMore)
        }
      )
    },
    // 左右布局
    getSide (index) {
      if (index % 2 === 0) {
        return 'left'
      } else {
        return 'right'
      }
    },

    /**
     * 在相同on的相同操作项合成一个
     * @param {Array} activitysInSomeDate
     */
    adjacentOnInOne (activitysInSomeDate) {
      let activitys = []
      let prev = new Activity()
      for (let activity of activitysInSomeDate) {
        if (activity.widget.on.id &&
          activity.action === prev.action &&
          activity.widget.on.type === prev.widget.on.type &&
          activity.widget.on.id === prev.widget.on.id) {
          let last = _.last(activitys)
          last.widgets
            ? last.widgets.push(activity.widget)
            : last.widgets = [activity.widget]
        } else {
          activity.widgets = [activity.widget]
          activitys.push(activity)
        }
        prev = activity
      }
      return activitys
    },
    initData () {
      this.noMore = false
      this.initPage()
      this.clearActivitys()
      this.updateCacheDataFlag({ objectType: this.category, objectID: this.objectID, value: false })
    },
    initInfiniteScroll () {
      this.$refs.infiniteScrollOfTimeline.reset()
      this.$refs.infiniteScrollOfTimeline.poll()
      this.$refs.infiniteScrollOfTimeline.trigger()
      this.$refs.infiniteScrollOfTimeline.resume()
    }
  },
  created () {
    // 页面渲染完毕，需要置空和重置状态
    this.initData()
  },
  mounted () {
    this.initInfiniteScroll()
  }
}
