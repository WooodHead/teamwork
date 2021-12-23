<!-- 更改我的通知 -->
<template>
  <q-page>
    <tw-form
      @primary="onSubmit"
      :title="$t('settings.workCanWait')"
    >
      <!-- 图标 -->
      <q-item
        class="row justify-center"
        v-if="!$q.platform.is.mobile"
      >
        <q-item-section>
          <q-icon
            size="5rem"
            class="self-center"
            :name="`img:${$logo['favicon-96x96.png']}`"
          />
        </q-item-section>
      </q-item>
      <!-- 标题 -->
      <q-item v-if="!$q.platform.is.mobile">
        <q-item-section>
          <div class="text-h5 text-bold text-center">
            {{$t('settings.workCanWait')}}
          </div>
        </q-item-section>
      </q-item>
      <!------------------ what ------------------>
      <!-- 任意类型 -->
      <q-item>
        <q-item-section>
          <tw-separator left>
            <div class="text-h5 text-bold">
              {{$t('settings.whatToNotify')}}
            </div>
          </tw-separator>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          <q-radio
            v-model="person.settings.whatToNotify.type"
            val="everything"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyEverything')}}
          </q-item-label>
          <q-item-label caption>
            {{$t('settings.notifyEverythingDescription')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <!-- 私聊或@ -->
      <q-item>
        <q-item-section side>
          <q-radio
            v-model="person.settings.whatToNotify.type"
            val="ping"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyOnlyPings')}}
          </q-item-label>
          <q-item-label caption>
            {{$t('settings.notifyOnlyPingsDescription')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <!-- 自定义类型 -->
      <q-item>
        <q-item-section side>
          <q-radio
            v-model="person.settings.whatToNotify.type"
            val="custom"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyChooseType')}}
          </q-item-label>
          <q-item-label
            caption
            v-if="person.settings.whatToNotify.type !== 'custom'"
          >
            {{$t('settings.notifyChooseTypeDescription')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="person.settings.whatToNotify.type === 'custom'">
        <q-item-section side>
          <q-radio
            v-model="person.settings.whenToNotify.type"
            val="custom"
            style="opacity:0;"
          ></q-radio>
        </q-item-section>
        <q-item-section>
          <q-select
            filled
            multiple
            clearable
            use-chips
            lazy-rules
            emit-value
            map-options
            :options="msgTypes"
            :label="$t('settings.notifyChooseTypeDescription')"
            :rules="[ val => val && val.length > 0 || $t('rule.fieldIsRequired')]"
            :value="person.settings.whatToNotify.selection"
            @add="onAddType"
            @remove="onRemoveType"
            @clear="person.settings.whatToNotify.selection=[]"
          />
        </q-item-section>
      </q-item>

      <!------------------ how ------------------>
      <!-- 邮件 -->
      <q-item>
        <q-item-section>
          <tw-separator left>
            <div class="text-h5 text-bold">
              {{$t('settings.howToNotify')}}
            </div>
          </tw-separator>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          <q-checkbox
            val="email"
            v-model="how"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyEmail')}}
          </q-item-label>
          <q-item-label caption>
            {{$t('settings.notifyEmailDescription')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <!-- 弹窗 -->
      <q-item>
        <q-item-section side>
          <q-checkbox
            val="popup"
            v-model="how"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyPopup')}}
          </q-item-label>
          <q-item-label
            caption
            v-if="push.Permission.has()"
          >
            {{$t('settings.notifyPopupEnabledDescription')}}
          </q-item-label>
          <q-item-label
            caption
            v-else
          >
            {{$t('settings.notifyPopupDisabledDescription')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <!-- 微信 -->
      <q-item v-if="config.extranet">
        <q-item-section side>
          <q-checkbox
            val="wechat"
            v-model="how"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyWechat')}}
          </q-item-label>
          <q-item-label caption>
            {{$t('settings.notifyWechatDescription')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <!------------------ when ------------------>
      <!-- 任意时间 -->
      <q-item>
        <q-item-section>
          <tw-separator left>
            <div class="text-h5 text-bold">
              {{$t('settings.whenToNotify')}}
            </div>
          </tw-separator>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          <q-radio
            v-model="person.settings.whenToNotify.type"
            val="always"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyAnytime')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <!-- 工作时间 -->
      <q-item>
        <q-item-section side>
          <q-radio
            v-model="person.settings.whenToNotify.type"
            val="workHours"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{$t('settings.notifyWorkhours')}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="person.settings.whenToNotify.type==='workHours'">
        <q-item-section
          side
          class="col-auto"
        >
          <q-radio
            val="workHours"
            style="opacity:0;"
            v-model="person.settings.whenToNotify.type"
          />
        </q-item-section>
        <q-item-section class="col-shrink">
          <!-- 开始时间 -->
          <q-input
            dense
            filled
            v-model="person.settings.whenToNotify.startTime"
          >
            <template v-slot:append>
              <q-icon
                name="access_time"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    format24h
                    v-model="person.settings.whenToNotify.startTime"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
        <q-item-section class="col-auto">
          <q-item-label>to</q-item-label>
        </q-item-section>
        <q-item-section class="col-shrink">
          <!-- 结束时间 -->
          <q-input
            dense
            filled
            v-model="person.settings.whenToNotify.endTime"
          >
            <template v-slot:append>
              <q-icon
                name="access_time"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    format24h
                    v-model="person.settings.whenToNotify.endTime"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <!-- 选择星期几 -->
      <q-item v-if="person.settings.whenToNotify.type==='workHours'">
        <q-item-section side>
          <q-radio
            val="workHours"
            style="opacity:0;"
            v-model="person.settings.whenToNotify.type"
          />
        </q-item-section>
        <q-item-section>
          <tw-select-week-day
            :cronDays="person.settings.whenToNotify.days"
            @select="getSelectDays"
          />
        </q-item-section>
      </q-item>
    </tw-form>
  </q-page>
</template>

<script>
import Push from 'push.js'
import { mapState, mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
import Person from '@/store/person/model'
import { showSuccessMessage } from '@/utils/show-message'
import setMyinfo from '@/utils/local-storage-myinfo'
const config = require('app/app.config.js')
export default {
  name: 'NotificationSettings',
  components: {
    TwSelectWeekDay: () => import('components/checkins/TwSelectWeekDay'),
    TwSeparator: () => import('components/base/TwSeparator'),
    TwForm: () => import('components/base/TwForm')
  },
  data () {
    return {
      submitting: false,
      person: LocalStorage.getItem('myself'),
      push: Push,
      config: config
    }
  },
  computed: {
    ...mapState('message', ['messageType']),
    msgTypes () {
      return Object.values(this.messageType).filter(r => r.value && r.label)
    },
    how: {
      get () {
        return [...new Set(this.person.settings.howToNotify)]
      },
      set (val) {
        this.person.settings.howToNotify = val
      }
    }
  },
  methods: {
    ...mapActions('person', ['loadPerson', 'updatePersonField']),
    getSelectDays (selectDays) {
      this.person.settings.whenToNotify.days = selectDays.join(',')
    },
    onAddType (obj) {
      this.person.settings.whatToNotify.selection.push(obj.value)
      if (obj.value === 'taskDueDateChanged' || obj.value === 'taskDueDateAdded') {
        this.person.settings.whatToNotify.selection.push('taskDueDateChanged')
        this.person.settings.whatToNotify.selection.push('taskDueDateAdded')
        this.person.settings.whatToNotify.selection = [...new Set(this.person.settings.whatToNotify.selection)]
      }
    },
    onRemoveType (obj) {
      if (obj.value === 'taskDueDateChanged' || obj.value === 'taskDueDateAdded') {
        this.person.settings.whatToNotify.selection = this.person.settings.whatToNotify.selection.filter(item => item !== 'taskDueDateChanged' && item !== 'taskDueDateAdded')
      } else {
        this.person.settings.whatToNotify.selection = this.person.settings.whatToNotify.selection.filter(item => item !== obj.value)
      }
    },
    onSubmit () {
      this.submitting = true
      let toPerson = Person.to(this.person)
      this.updatePersonField({
        id: this.person.id,
        fieldName: 'settings',
        value: JSON.stringify(toPerson.Settings)
      }).then(res => {
        setMyinfo(this.person)
        this.submitting = false
        showSuccessMessage(this.$t(`settings.settingSucceed`))
      })
    }
  }
}

</script>

<style lang='scss' scoped>
  .notification-settings {
    font-size: 1rem;
    color: #283c46;
  }
  .q-badge--floating {
    top: 0.3rem;
    right: -0.1rem;
  }
  .q-badge {
    padding: 4px;
    border-radius: 50%;
  }
  .q-item__label--caption {
    color: #6d6d6d;
  }
</style>
