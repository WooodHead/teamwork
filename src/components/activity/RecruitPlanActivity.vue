<template>
  <div>
    <!-- 标题 -->
    <div class="flex">
      <span>
        {{ activity.actor }}
        {{ $t(`activity.recruitPlan.${activity.description}`) }}
      </span>
      <a
        class="text-primary"
        href="javascript:void(0);"
        v-html="activity.objectTitle"
      >
      </a>
    </div>
    <!-- 招聘计划需求动态 -->
    <div
      v-if="
        activity.description === 'AddRecruitPlanNeed' ||
          activity.description === 'UpdateRecruitPlanNeed' ||
          activity.description === 'DeleteRecruitPlanNeed' ||
          activity.description === 'StartRecruitPlanNeed' ||
          activity.description === 'StopRecruitPlanNeed'
      "
    >
      <table class="t">
        <thead>
          <th>需求岗位</th>
          <th>需求部门</th>
          <th>城市</th>
          <th>人数</th>
        </thead>
        <tbody>
          <td>{{ activity.widgets[0].detail.JobName }}</td>
          <td>{{ activity.widgets[0].detail.OrganizeName }}</td>
          <td>{{ activity.widgets[0].detail.City }}</td>
          <td>{{ activity.widgets[0].detail.Num }}</td>
        </tbody>
      </table>
    </div>
    <!-- 应聘者的简历被放入人才库动态 -->
    <div v-if="personList.length" class="q-ml-sm text-caption">
      以下应聘者的简历被放入人才库：
      <div class="row">
        <div v-for="(person, index) in personList" :key="index">
          <router-link
            class="text-primary"
            :to="{
              name: 'resumeDetail',
              params: { resumeDeliveryID: person.DeliveryID }
            }"
          >
            {{ person.Name }}
          </router-link>
          {{
            personList.length > 1
              ? index === personList.length - 1
                ? ""
                : "，"
              : ""
          }}
        </div>
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
      return _.isObject(this.activity.widget.detail)
        ? this.activity.widget.detail
        : JSON.parse(this.activity.widget.detail)
    },
    personList () {
      if (_.isEmpty(this.detail.Interviewees)) {
        return []
      }
      return _.isObject(this.detail.Interviewees)
        ? this.detail.Interviewees
        : JSON.parse(this.detail.Interviewees)
    }
  }
}
</script>

<style lang="scss" scoped>
.t {
  border: 1px gray solid;
  border-spacing: 0px;
  border-collapse: collapse;
  width: 90%;
  line-height: 20px;
  table-layout: fixed;
}
.t td {
  border: 1px gray solid;
  padding: 5px;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
}
.t th {
  border: 1px gray solid;
  padding: 5px;
  font-weight: normal;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
