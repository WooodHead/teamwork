<!-- 简历基本信息组件 -->
<template>
  <div>
      <div class="row q-pb-sm">
        <div class="col-12 q-py-sm">
          <q-card
            class="no-shadow"
            bordered
          >
            <q-card-section
              class="text-grey-7"
              :class="$q.screen.lt.sm?'q-px-sm':''"
            >
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="items-center row no-wrap resume_info_row q-pb-xs">
                    <!-- 头像 -->
                    <div
                      class="col-auto"
                      @click="$refs.viewer.$viewer.show()"
                    >
                      <tw-avatar
                        class="my-avatar"
                        :img="resumeView.photo"
                        :name="resumeView.interviewee"
                        size="100px"
                        fontSize="2rem"
                        :popupCard="false"
                      />
                      <div class="absolute-top-right">
                        <!-- 星标 -->
                        <q-icon
                          v-if="isStared"
                          name="star"
                          color="yellow-8"
                          class="cursor-pointer transparent"
                          style="font-size: 30px;"
                          @click.capture.stop="noStarResume"
                        />
                        <q-icon
                          v-else
                          name="star_border"
                          color="blue-grey-3"
                          class="cursor-pointer transparent"
                          style="font-size: 30px;"
                          @click.capture.stop="starResume"
                        />
                      </div>
                    </div>
                    <!-- 其他 -->
                    <div class="col q-pl-md">
                      <div class="row no-wrap resume_info_row text-h5 resume_bold">
                        {{resume.name}}
                      </div>
                      <div class="row no-wrap resume_info_row resume_bold q-py-xs">
                        {{highestEducation&&highestEducation.college}} | {{resume.highestEducation}}
                      </div>
                      <div class="row resume_info_row q-gutter-xs q-py-xs">
                        <q-badge
                          color="blue-grey-4"
                          :label="resume.sex"
                        />
                        <q-badge
                          color="blue-grey-4"
                          :label="resume.maritalStatus"
                        />
                        <q-badge
                          color="blue-grey-4"
                          :label="formatDate(resume.birthday&&resume.birthday.replace(/-/g, '/'), 'YYYY-MM-DD')"
                        />
                        <q-badge
                          color="blue-grey-4"
                          :label="resume.workingYears"
                        />
                      </div>
                      <!-- 电话号码 -->
                      <div class="row no-wrap resume_info_row">
                        <span class="resume_info_key">
                          {{$t('resume.model.Tel')}}
                        </span>
                        <span>
                          {{resume.tel}}
                        </span>
                      </div>
                      <!-- 邮箱 -->
                      <div class="row no-wrap resume_info_row">
                        <span class="resume_info_key">
                          {{$t('resume.model.Email')}}
                        </span>
                        <span>
                          {{resume.email}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <!-- 国籍 · 籍贯 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.Country')}}/{{$t('resume.model.Nativeplace')}}
                    </span>
                    <span>
                      {{resume.country}}/{{resume.nativeplace}}
                    </span>
                  </div>
                  <!-- 身份证号 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.IdentityNumber')}}
                    </span>
                    <span>
                      {{resume.identityNumber}}
                    </span>
                  </div>
                  <!-- 民族 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.Nation')}}
                    </span>
                    <span>
                      {{resume.nation}}
                    </span>
                  </div>
                  <!-- 政治面貌 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.Politics')}}
                    </span>
                    <span>
                      {{resume.politics}}
                    </span>
                  </div>
                  <!-- 居住地 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.PresentAddress')}}
                    </span>
                    <span>
                      {{resume.presentAddress}}
                    </span>
                  </div>
                  <!-- 通讯地址 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.MailingAddress')}}
                    </span>
                    <span>
                      {{resume.mailingAddress}}
                    </span>
                  </div>
                </div>
                <div class="col-12">
                  <!-- 专业技能 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.Skills')}}
                    </span>
                    <span>
                      {{resume.skills}}
                    </span>
                  </div>
                  <!-- 特长爱好 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.Hobbies')}}
                    </span>
                    <span>
                      {{resume.hobbies}}
                    </span>
                  </div>
                  <!-- 自我评价 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.SelfEvaluation')}}
                    </span>
                    <span>
                      {{resume.selfEvaluation}}
                    </span>
                  </div>
                  <!-- 个人荣誉 -->
                  <div class="row no-wrap">
                    <span class="resume_info_key">
                      {{$t('resume.model.Honors')}}
                    </span>
                    <span>
                      {{resume.honors}}
                    </span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 q-py-xs">
          <q-card
            class="no-shadow"
            bordered
          >
            <q-card-section
              class="text-grey-7"
              :class="$q.screen.lt.sm?'q-px-sm':''"
            >
              <div class="row">
                <div class="col-12 col-md-6">
                  <!-- 求职岗位 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.JobTitle')}}
                    </span>
                    <span>
                      {{resumeView.jobTitle}}
                    </span>
                  </div>
                  <!-- 求职城市 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.City')}}
                    </span>
                    <span>
                      {{resumeView.city}}
                    </span>
                  </div>
                  <!-- 面试轮次 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.InterviewCount')}}
                    </span>
                    <span>
                      {{resumeView.interviewCount}}
                    </span>
                  </div>
                  <!-- 面试类型 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.InterviewType')}}
                    </span>
                    <span>
                      {{resumeView.interviewType||'暂未确定'}}
                    </span>
                  </div>
                  <!-- 面试时间 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.InterviewTime')}}
                    </span>
                    <span>
                      {{resumeView.interviewTime === '2000-01-01 00:00:00'?'暂未确定':resumeView.interviewTime}}
                    </span>
                  </div>
                  <!-- 面试地点 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.InterviewPlace')}}
                    </span>
                    <span>
                      {{resumeView.interviewPlace||'暂未确定'}}
                    </span>
                  </div>
                  <!-- 面试要求 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.InterviewExtra')}}
                    </span>
                    <span>
                      {{resumeView.interviewExtra||'暂无'}}
                    </span>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <!-- 到岗时间 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.PostTime')}}
                    </span>
                    <span>
                      {{formatDate(resume.postTime&&resume.postTime.replace(/-/g, '/'), 'YYYY-MM-DD')}}
                    </span>
                  </div>
                  <!-- 期望薪资 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.ExpectedSalary')}}
                    </span>
                    <span>
                      {{resume.expectedSalary}}
                    </span>
                  </div>
                  <!-- 期望工作地 -->
                  <div class="row no-wrap resume_info_row">
                    <span class="resume_info_key">
                      {{$t('resume.model.ExpectedWorkPlace')}}
                    </span>
                    <span>
                      {{resume.expectedWorkPlace}}
                    </span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    <!-- 头像预览 -->
    <viewer
      v-show="false"
      ref="viewer"
    >
      <img :src="getUrl(resumeView.photo)">
    </viewer>
  </div>
</template>

<script>
import { LocalStorage, date } from 'quasar'
import { getUrl } from '@/boot/file'
const { formatDate } = date
export default {
  name: 'ResumeBasicInfo',
  props: {
    resumeDeliveryID: {
      type: [Number, String],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      staredResumes: LocalStorage.getItem('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id)) || []

    }
  },
  computed: {
    resumeView () {
      return this.$store.getters['resume/resumeView'](+this.resumeDeliveryID)
    },
    resume () {
      return this.$store.getters['resume/resume'](+this.resumeView.resumeID)
    },
    highestEducation () {
      if (!_.isEmpty(this.resume)) {
        return _.last(_.sortBy(this.resume.educations, 'startTime'))
      } else {
        return ''
      }
    },
    // 星标状态
    isStared () {
      return this.staredResumes && this.staredResumes.indexOf(+this.resumeDeliveryID) !== -1
    }
  },
  methods: {
    formatDate,
    getUrl,
    // 星标简历
    starResume () {
      this.staredResumes = LocalStorage.getItem('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id)) || []
      if (this.staredResumes && this.staredResumes.indexOf(+this.resumeDeliveryID) === -1) {
        this.staredResumes.push(+this.resumeDeliveryID)
        LocalStorage.set('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id), this.staredResumes)
      }
    },
    // 解除星标简历
    noStarResume () {
      this.staredResumes = LocalStorage.getItem('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id)) || []
      if (this.staredResumes && this.staredResumes.indexOf(+this.resumeDeliveryID) !== -1) {
        this.staredResumes = _.difference(this.staredResumes, [+this.resumeDeliveryID])
        LocalStorage.set('staredResume_' + (LocalStorage.getItem('myself') && LocalStorage.getItem('myself').id), this.staredResumes)
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    Viewer: () => import('v-viewer/src/component.vue')
  }
}
</script>

<style lang="scss" scoped>
.resume-avatar {
  background-color: lightgray;
}
.resume-avatar img[data-v-7c5c7417] {
  width: 7.25rem;
  border: 1px solid #e0e0e0;
}
.my-avatar {
  border-radius: 3px;
  min-height: 120px;
  height: auto;
}
/deep/.my-avatar .q-avatar__content {
  line-height: 120px;
}
</style>
