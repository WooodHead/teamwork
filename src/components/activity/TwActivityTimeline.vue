<template>
  <q-timeline-entry
    :subtitle="activity.actTime | formatActivityTime"
    :side="getSide(index)"
  >
    <template v-slot:title>
      <div class="row">
        <div class="text-caption col-shrink q-pr-sm">
          <tw-avatar
            :id="activity.actorId"
            size="lg"
          />
        </div>
        <!-- 任务 -->
        <task-activity
          v-if="activity.widget.type === 'task'"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
          @clickTask="toDetail"
        />
        <!-- 日程 -->
        <event-activity
          v-else-if="activity.widget.type === 'schedule'"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 讨论 -->
        <discuss-activity
          v-else-if="activity.widget.type === 'discuss'"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 添加、移除成员 -->
        <member-activity
          v-else-if="['AddMembers','DeleteMembers'].includes(activity.description)"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 项目、产品激活挂起 -->
        <suspend-activate-activity
          v-else-if="['suspended','activate'].includes(activity.action)"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 项目、产品、团队、订单、机构、生产单位、客户创建 -->
        <add-modify-activity
          v-else-if="'added'===activity.description"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 项目、产品、商机审批 -->
        <approval-activity
          v-else-if="['project','productDev', 'opportunity'].includes(activity.widget.type)&&['start','finish','approval'].includes(activity.action)"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 公告、文档、markmap思维导图发送 -->
        <notice-activity
          v-else-if="activity.action === 'send' && (activity.widget.type === 'notice' || activity.widget.type === 'document')"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 工程服务 -->
        <service-activity
          v-else-if="activity.widget.type === 'service'"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 面试邀约 -->
        <resume-invite-activity
          v-else-if="activity.objectType === 'recruitPlan' && activity.description === 'SendInterviewInvite'"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 招聘计划 -->
        <recruit-plan-activity
          v-else-if="activity.objectType === 'recruitPlan' && activity.description.includes('RecruitPlan')"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 简历 -->
        <resume-activity
          v-else-if="activity.objectType === 'recruitPlan' && activity.description !== 'SendInterviewInvite'"
          class="col text-body1 text-weight-bold text-left"
          :activity="activity"
        />
        <!-- 其他 -->
        <div
          v-else
          class="col text-body1 text-weight-bold text-left"
        >
          <span>
            {{$t(`activity.${activity.widget.type}.${activity.description}`,{name:activity.actor})}}
          </span>
          <a
            class="text-primary"
            style="word-wrap:break-word;"
            href="javascript:void(0);"
            @click="toDetail(activity)"
            v-html="activity.widget.title"
          > </a>
          <!-- markmap 文档 -->
          <mind-map
            v-if="isObject(activity.widget.detail) && activity.widget.detail.Extension==='markmap'"
            :controls="false"
            :code="activity.widget.detail.Content"
            :title="activity.widget.title"
          />
          <div
            v-else
            v-html="isObject(activity.widget.detail) ? activity.widget.detail.Content : activity.widget.detail"
            class="tiptap-content editor__content text-caption"
          />
        </div>
      </div>
    </template>
  </q-timeline-entry>
</template>
<script>
import { date } from 'quasar'
export default {
  name: 'TwActivityTimeLine',
  props: {
    activity: {
      type: Object,
      required: false,
      default: () => { }
    },
    index: {
      type: Number,
      required: false,
      default: 0
    }
  },
  filters: {
    /**
     * 格式化活动日期取时间。格式为HH:mm
    **/
    formatActivityTime (actTime) {
      return date.formatDate(actTime.replace(/-/g, '/'), 'HH:mm')
    }
  },
  components: {
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
    RecruitPlanActivity: () => import('components/activity/RecruitPlanActivity')
  },
  methods: {
    isObject: _.isObject,
    // 左右布局
    getSide (index) {
      if (index % 2 === 0) {
        return 'left'
      } else {
        return 'right'
      }
    },
    // 详情
    toDetail (model) {
      switch (model.widget.type) {
        case 'question': {
          this.$router.push({
            name: 'questionDetail',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.id
            }
          })
          break
        }
        case 'answer': {
          this.$router.push({
            name: 'answer',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              questionID: +model.widget.on.id,
              answerID: +model.widget.id
            }
          })
          break
        }
        case 'file': {
          this.$router.push({
            name: `${model.widget.on.type}Detail`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.id
            }
          })
          break
        }
        case 'folder': {
          this.$router.push({
            name: `${model.widget.on.type}`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.id
            }
          })
          break
        }
        case 'doc': {
          this.$router.push({
            name: `${model.widget.on.type}Detail`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.id
            }
          })
          break
        }
        case 'link': {
          this.$router.push({
            name: `${model.widget.on.type}Detail`,
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.id
            }
          })
          break
        }
        case 'task': {
          this.$router.push({
            name: 'taskDetail',
            params: {
              id: +model.widget.id,
              category: model.objectType,
              objectID: +model.objectId
            }
          })
          break
        }
        case 'notice': {
          this.$router.push({
            name: 'noticeDetail',
            params: {
              category: model.objectType,
              objectID: +model.objectId,
              id: +model.widget.id
            }
          })
          break
        }
        default:
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.q-timeline__dot:before {
  display: none;
}
/deep/.q-timeline__dot:after {
  top: 0;
  left: 7px;
  bottom: 0;
  width: 1px;
  opacity: 1;
  content: "" !important;
  background-color: rgba(0, 0, 0, 0.1);
}
/deep/.q-timeline__subtitle {
  opacity: 1;
  color: #283c46;
  font-weight: normal;
}
/deep/.content {
  overflow: hidden;
  font-size: 0.85rem;
}
/deep/.content img {
  transition: all 0.6s;
  -moz-transition: all 0.6s;
  -webkit-transition: all 0.6s;
  -ms-transition: all 0.6s;
}
/deep/.content img.scale {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
}
</style>
