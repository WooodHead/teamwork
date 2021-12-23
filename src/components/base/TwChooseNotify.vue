<template>
  <div class="text-caption text-grey-7 q-my-md">
    <q-option-group
      v-if="!always"
      :options="options"
      type="radio"
      v-model="notify"
    />
    <resource-team-view
      v-if="always||notify"
      class="q-pl-sm"
      size="md"
      fontSize="0.7rem"
      position="text-left"
      :quickSelected="quickSelected"
      :members="subscribers"
      @updateMembers="ChooseSubscribers"
    >
      <template
        v-slot:title
        v-if="always"
      >
        <div class="text-caption text-grey-7 q-my-sm">
          {{notifyHint||$t('subscribe.whenIPostThisThesePeopleWillBeNotified', { count: subscribers.length })}}</div>
      </template>
    </resource-team-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'TwChooseNotify',
  props: {
    module: {
      type: Object,
      required: true,
      desc: '模块对象{category,id}'
    },
    widget: {
      type: Object,
      required: false,
      default: () => { return { id: 0 } },
      desc: '工具对象{category,id}'
    },
    always: {
      type: Boolean,
      default: false,
      desc: '总是会通知么？'
    },
    notifyHint: {
      type: String,
      required: false,
      default: null
    },
    initMemberDutys: {
      type: String,
      required: false,
      default: 'leader,member',
      desc: '初始化人员职位，即默认通知的人员类型。如果传值，比如‘leader’，则获取leader数据，若不传，则默认获取所有'
    },
    subscribers: {
      type: Array,
      required: false,
      default () {
        return []
      },
      desc: '初始化订阅人'
    }
  },
  components: {
    ResourceTeamView: () => import('components/resource/ResourceTeamView')
  },
  data () {
    return {
      quickSelected: null, // 人员选择面板快捷选中
      notifyTo: [], // 通知人
      notify: false, // 是否选择订阅人（文档）
      options: [
        { label: this.$t('subscribe.whenIPostThisDontNotifyAnyone'), value: false },
        { label: this.$t('subscribe.letMeChooseWhoToNotify'), value: true }
      ],
      myinfo: LocalStorage.getItem('myself')
    }
  },
  watch: {
    notify (value) {
      if (value) {
        this.subscribers.length ||
          this.subscribers.push(...this.notifyTo)
        !this.subscribers.length && this.getMembers((IDs) => {
          this.subscribers.push(...IDs)
          this.notifyTo.push(...IDs)
          this.addQuickSelected(IDs)
          this.updateNotifyLable(value)
        })
        this.subscribers.length && this.updateNotifyLable(value)
      } else {
        this.subscribers.splice(0, this.subscribers.length)
        this.updateNotifyLable(value)
      }
    }
  },
  mounted () {
    // 获取已经订阅的人员
    this.loadSubscribe({
      objectID: this.widget.id,
      objectType: this.widget.category
    }).then(res => {
      if (res && res.subscribers) {
        this.always && this.subscribers.push(...res.subscribers)
        this.notifyTo.push(...res.subscribers)
      }
      this.always && this.getMembers((IDs) => {
        !this.subscribers.length && this.subscribers.push(...IDs)
        !this.subscribers.length && this.notifyTo.push(...IDs)
        this.addQuickSelected(IDs)
      })
    })
  },
  methods: {
    ...mapActions('member', ['loadMembers']),
    ...mapActions('subscribe', ['loadSubscribe']),
    ChooseSubscribers (ids) {
      this.subscribers.splice(0, this.subscribers.length)
      this.notifyTo = []
      this.notifyTo.push(...ids)
      this.subscribers.push(...ids)
      this.notify && (this.options[1].label = this.$t('subscribe.notifyThesePeople', { count: this.subscribers.length }))
    },
    getMembers (callback) {
      this.loadMembers({
        category: this.module.category,
        objectID: +this.module.id,
        types: this.initMemberDutys
      }).then(ids => {
        if (ids.length) {
          let IDs = ids.filter(a => a !== this.myinfo.id)
          callback && callback(IDs)
        }
      })
    },
    addQuickSelected (IDs) {
      if (this.module.category !== 'room' && this.module.category !== 'person') {
        // 由于目前PersonSelectPanel组件的quickSelected字段需要传所有的member值，所以如果initMemberDutys有值，则需重新获取所有人
        if (this.initMemberDutys) {
          this.loadMembers({
            category: this.module.category,
            objectID: +this.module.id,
            types: this.initMemberDutys
          }).then(ids => {
            if (ids.length) {
              this.quickSelected = {
                title: this.$t(`${this.module.category}.title`) + '成员',
                personIDs: ids
              }
            }
          })
        } else {
          this.quickSelected = {
            title: this.$t(`${this.module.category}.title`) + '成员',
            personIDs: IDs
          }
        }
      }
    },
    updateNotifyLable (value) {
      this.options[1].label = value
        ? this.$t('subscribe.notifyThesePeople', { count: this.subscribers.length })
        : this.options[1].label = this.$t('subscribe.letMeChooseWhoToNotify')
    }
  }
}
</script>

<style>
</style>
