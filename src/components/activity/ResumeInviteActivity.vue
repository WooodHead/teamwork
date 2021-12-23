<!-- 面试邀约动态 -->
<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span>
        {{$t('activity.on')}}
        <router-link
          class="text-primary"
          :to="{name:'recruitPlanDetail',params:{id:activity.objectId}}"
        >
          {{activity.objectTitle}}
        </router-link>
        {{$t('activity.among')}}{{activity.actor}}{{$t(`activity.resume.${activity.description}`)}}
      </span>
    </div>
    <div class="q-ml-sm text-caption">
      <!-- 时间安排 -->
      <div class="row">
        时间安排：
        <div>
          <div
            v-for="arrange in arranges"
            :key="arrange.date + arrange.type"
          >
            <q-icon
              v-if="arrange.type === '视频'"
              name="videocam"
              color="green"
              size="sm"
            />
            <q-icon
              v-else
              name="schedule"
              color="green"
              size="xs"
            />
            {{arrange.date}}
          </div>
        </div>
      </div>
      <!-- 邀约人员 -->
      <div class="row">
        邀约人员：
        <div class="row">
          <div
            v-for="(person,index) in personList"
            :key="person.Name + person.DeliveryID"
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeInviteActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      detail: {}
    }
  },
  computed: {
    arranges () {
      let arr = []
      if (!_.isEmpty(this.detail)) {
        Object.keys(this.detail.arranges).map(date => {
          let dateKey = date.replace('T', ' ')
          let type = this.detail.arranges[date]['InterviewType']
          arr.push({
            date: dateKey,
            type: type
          })
        })
      }
      return arr
    },
    personList () {
      return this.detail.interviewees
    }
  },
  mounted () {
    if (_.isObject(this.activity.widget.detail)) {
      this.detail = this.activity.widget.detail
    } else {
      this.detail = JSON.parse(this.activity.widget.detail)
    }
    if (_.isObject(this.detail.Interviewees)) {
      this.detail.interviewees = this.detail.Interviewees
    } else {
      this.detail.interviewees = JSON.parse(this.detail.Interviewees)
    }
    if (_.isObject(this.detail.Detail)) {
      this.detail.arranges = this.detail.Detail
    } else {
      this.detail.arranges = JSON.parse(this.detail.Detail)
    }
  }
}

</script>

<style lang='scss' scoped>
/deep/.content {
  font-size: 0.85rem;
}
</style>
