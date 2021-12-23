<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span v-if="activity.description === 'CloseRecruitPlan'">
        {{activity.actor}} {{$t(`activity.recruitPlan.${activity.description}`)}}
      </span>
      <span v-else>
        {{$t('activity.on')}}
        <router-link
          class="text-primary"
          :to="{name:'recruitPlanDetail',params:{id:activity.objectId}}"
        >
          {{activity.objectTitle}}
        </router-link>
        {{$t('activity.among')}}{{activity.actor}}{{$t(`activity.resume.${activity.description}`,{InterviewerName:activity.widget.detail.InterviewerName})}}
      </span>
    </div>
    <div class="q-ml-sm text-caption">
      <!-- 邀约岗位： -->
      <div v-if="activity.widget.title">
        投递岗位：
        <router-link
          class="text-primary"
          :to="{name:'jobDetail',params:{id:activity.widget.id}}"
        >
          {{activity.widget.title}}
        </router-link>
      </div>
      <!-- 邀约人员 -->
      <div class="row">
        <div
          v-for="(person,index) in personList"
          :key="index"
        >
          <router-link
            class="text-primary"
            :to="{name:'resumeDetail',params:{resumeDeliveryID:person.DeliveryID}}"
          >
            {{person.Name}}
          </router-link>
          {{personList.length > 1 ? index === personList.length - 1 ? '' : '，' : ''}}
        </div>
      </div>
      <div
        v-if="score"
        class="text-caption q-pt-sm"
      >
        总分：<span class="text-red">{{score}}</span>
      </div>
      <div v-if="content">
        <div
          class="editor__content tiptap text-body2"
          v-html="content"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  computed: {
    detail () {
      return _.isObject(this.activity.widget.detail) ? this.activity.widget.detail : JSON.parse(this.activity.widget.detail)
    },
    personList () {
      if (_.isEmpty(this.detail.Interviewees)) {
        return []
      }
      return _.isObject(this.detail.Interviewees) ? this.detail.Interviewees : JSON.parse(this.detail.Interviewees)
    },
    content () {
      return this.detail.Content ? this.detail.Content.replace(/\\/g, '') : ''
    },
    score () {
      if (this.activity.description === 'AddInterviewRecord' || this.activity.description === 'PassInterview' || this.activity.description === 'EditResumeRecord' || this.activity.description === 'DeleteResumeRecord') {
        return this.detail.Score || ''
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.ProseMirror {
  min-height: auto;
}
</style>
