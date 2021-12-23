<!-- 注释 -->
<template>
  <q-card
    flat
    bordered
    class="base-card"
    style="overflow:hidden"
    @click="onClickCard()"
  >
    <q-card-section class="position-relative q-pa-sm full-height">
      <div class="flex q-gutter-x-sm full-height">
        <!-- 头像、姓名 -->
        <div
          class="col-auto column flex-center full-height"
          style="width: 90px;"
        >
          <q-img
            :src="resumeView.photo?getUrl(resumeView.photo):'icons/default-profile.png'"
            contain
            spinner-color="primary"
            spinner-size="82px"
          />
          <div class="text-primary1 text-weight-bold q-mt-xs">{{resumeView.interviewee}}</div>
        </div>
        <div class="col column">
          <!-- 投递岗位, 分数 -->
          <div class="relative-position q-mr-xl text-text1">
            <p class="q-mt-none q-mb-xs text-body-g text-weight-bold">
              {{resumeView.jobTitle}}
            </p>
            <p class="q-my-none text-body-g text-weight-bold">
              <span>
                地点：
              </span>
              <span>
                {{resumeView.city}}
              </span>
            </p>
          </div>
          <q-separator class="q-my-xs" />
          <!-- 学历、学校、工作经验、期望薪资 -->
          <div class="text-text2 relative-position">
            <p
              v-show="highestEducation"
              class="flex q-my-none text-body-g  q-mb-xs"
            >
              <span>毕业院校</span>：
              <span class="">{{highestEducation.college}}</span>
            </p>
            <p class="flex q-my-none text-body-g  q-mb-xs">
              <span>专业</span>：
              <span class="">{{highestEducation.major}}</span>
            </p>
            <p class="flex q-my-none text-body-g  q-mb-xs">
              <span>学历</span>：
              <span class="">{{resumeView.highestEducation}}</span>
            </p>
            <p class="flex q-my-none text-body-g q-mb-xs">
              <span>期望薪资</span>：
              <span class="">{{resumeView.expectedSalary}}</span>
            </p>
          </div>
          <!-- 额外信息 -->
          <div class="q-gutter-x-xs">
            <!-- 内推码 -->
            <span
              v-show="resumeView.pushCode"
              class="q-mr-sm"
            >
              <q-badge
                color="auxiliary1"
                :label="resumeView.pushCode"
              />
            </span>
          </div>
          <div class="text-text2 col column justify-end">
            <q-separator class="q-my-xs" />
            <div class="flex text-body-g q-mb-xs">
              <span>上次修改</span>：
              <span class="">{{resumeView.modifyTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { getUrl } from '@/boot/file'
export default {
  name: 'ResumeDashboardCard',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0,
      description: '简历投递ID'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    resumeView () {
      return this.$store.state.resume.dashboardResumeViews.find(v => v.resumeDeliveryID === this.resumeDeliveryID)
    },
    highestEducation () {
      return _.last(_.sortBy(this.resumeView.educations, 'startTime')) || false
    }
  },
  methods: {
    getUrl,
    onClickCard () {
      this.$router.push({
        name: 'resumeDetail',
        params: {
          resumeDeliveryID: this.resumeDeliveryID
        }
      })
    }
  }
}

</script>

<style lang='scss' scoped>
p > span:first-child {
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
  min-width: 55px;
}
</style>
