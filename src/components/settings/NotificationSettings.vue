<!-- 个人设置组件 -->
<template>
  <div class="personal_settings">
    <!-- 组件标题 -->
    <tw-separator left>
      <div class="text-bold q-my-sm">
        {{title}}
      </div>
    </tw-separator>
    <!-- 标题描述 -->
    <q-item-label class="description">
      {{description}}
    </q-item-label>
    <!-- 组件中间按钮 -->
    <q-btn
      v-if="hasLegalWay && rightTime"
      class="q-mt-md"
      filled
      rounded
      outline
      @click="handleClick"
    >
      {{myButton.title}}
    </q-btn>
    <!-- 组件链接 -->
    <div
      class="q-mt-md column"
      v-if="!model.settings.notificationsOff"
    >
      <a
        class="text-primary"
        href="javascript:void(0);"
        @click="changeSetting()"
      >
        {{$t('settings.linkChangeSetting')}}
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import Person from '@/store/person/model'
export default {
  name: 'NotificationSettings',
  components: {
    TwSeparator: () => import('components/base/TwSeparator')
  },
  data () {
    return {
      model: new Person(),
      buttons: [
        {}
      ]
    }
  },
  computed: {
    myInfo: () => LocalStorage.getItem('myself'),
    // 有通知方式（number类型不影响）
    hasLegalWay () {
      return this.model.settings.howToNotify.includes('email') || this.model.settings.howToNotify.includes('popup')
    },
    // 合适的时间
    rightTime () {
      let date = new Date()
      let index = date.getDay()
      let nowTime = date.getTime()
      let indexDay = this.$t('settings.weekOptions')[index]

      let startTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + this.model.settings.whenToNotify.startTime
      let endTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + this.model.settings.whenToNotify.endTime
      startTime = new Date(startTime).getTime()
      endTime = new Date(endTime).getTime()

      let anytime = this.model.settings.whenToNotify.type === 'always'
      let rightTm = this.model.settings.whenToNotify.days.split(',').includes(indexDay.value) && startTime <= nowTime && nowTime <= endTime
      return anytime || rightTm
    },
    // 组件标题
    title () {
      if (this.model.settings.notificationsOff) {
        return this.$t('settings.notificationsOff')
      } else if (this.hasLegalWay && this.rightTime) {
        return this.$t('settings.notificationsOn')
      } else {
        return this.$t('settings.notificationsOff')
      }
    },
    descriptionHow () {
      if (this.model.settings.howToNotify.includes('email') && this.model.settings.howToNotify.includes('popup')) {
        return this.$t('settings.emailAndBrowserDescription')
      } else if (this.model.settings.howToNotify.includes('email')) {
        return this.$t('settings.emailDescription')
      } else if (this.model.settings.howToNotify.includes('popup')) {
        return this.$t('settings.browserDescription')
      } else {
        return ''
      }
    },
    descriptionWhat () {
      if (this.model.settings.whatToNotify.type === 'everything') {
        return this.$t('settings.everythingToNotifyDescription')
      } else if (this.model.settings.whatToNotify.type === 'ping') {
        return this.$t('settings.pingsToNotifyDescription')
      } else {
        return this.$t('settings.customeToNotifyDescription')
      }
    },
    descriptionWhen () {
      if (this.model.settings.whenToNotify.type === 'always') {
        return this.$t('settings.allTheTimeDescription')
      } else {
        let start = this.model.settings.whenToNotify.startTime
        let end = this.model.settings.whenToNotify.endTime
        let days = []
        if (this.model.settings.whenToNotify.days) {
          if (this.model.settings.whenToNotify.days.includes('sun')) {
            days.push(this.$t('settings.weekOptions')[0].label)
          }
          if (this.model.settings.whenToNotify.days.includes('mon')) {
            days.push(this.$t('settings.weekOptions')[1].label)
          }
          if (this.model.settings.whenToNotify.days.includes('tue')) {
            days.push(this.$t('settings.weekOptions')[2].label)
          }
          if (this.model.settings.whenToNotify.days.includes('wed')) {
            days.push(this.$t('settings.weekOptions')[3].label)
          }
          if (this.model.settings.whenToNotify.days.includes('thu')) {
            days.push(this.$t('settings.weekOptions')[4].label)
          }
          if (this.model.settings.whenToNotify.days.includes('fri')) {
            days.push(this.$t('settings.weekOptions')[5].label)
          }
          if (this.model.settings.whenToNotify.days.includes('sat')) {
            days.push(this.$t('settings.weekOptions')[6].label)
          }
        }
        return this.$t('settings.betweenTimeDescription', { start: start, end: end, days: days })
      }
    },
    // 组件标题说明
    description () {
      if (this.model.settings.notificationsOff) {
        // 通知关闭
        return this.$t('settings.offNotificationDescription')
      } else if (!this.hasLegalWay) {
        // 无通知方式
        return this.$t('settings.noLegalWayDescription')
      } else if (this.hasLegalWay && this.rightTime) {
        // 有通知方式且包含当天
        return this.$t('settings.allowTodayDescription', { what: this.descriptionWhat, how: this.descriptionHow, when: this.descriptionWhen })
      } else if (this.hasLegalWay && !this.rightTime) {
        // 有通知方式但不包含当天
        return this.$t('settings.notAllowTodayDescription', { when: this.descriptionWhen })
      } else {
        return ''
      }
    },
    // 组件中间按钮标题
    myButton () {
      if (this.model.settings.notificationsOff) {
        return {
          title: this.$t('settings.turnNotification'),
          action: 'turnNotification'
        }
      } else {
        return {
          title: this.$t('settings.offNotification'),
          action: 'offNotification'
        }
      }
    }
  },
  methods: {
    ...mapActions('person', ['loadPerson', 'updatePerson']),
    transDate (time) {
      return new Date(time).getTime()
    },
    turnNotification () {
      this.model.settings.notificationsOff = false
      this.updateModel()
    },
    offNotification () {
      this.model.settings.notificationsOff = true
      this.updateModel()
    },
    changeSetting () {
      this.$router.push({
        name: 'myNotificationSettings'
      })
    },
    handleClick () {
      this[this.myButton.action]()
    },
    logout () {
      this.$emit('toLogout')
    },
    updateModel () {
      let that = this
      this.updatePerson(this.model).then(res => {
        that.model = res
      })
    }
  },
  mounted () {
    let that = this
    this.loadPerson(this.myInfo.id).then(res => {
      that.model = res
    })
  }
}

</script>

<style lang='scss' scoped>
.personal_settings {
  color: #283c46;
  font-size: 0.9rem;

  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
}
.personal_settings .description {
  font-size: 0.8rem;
  line-height: 1.5 !important;
}
</style>
