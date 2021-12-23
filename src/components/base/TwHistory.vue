<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-px-xxl"
  >
    <q-card-section />
    <q-card-section>
      <div class="row q-gutter-lg no-wrap">
        <!-- 左侧卡片 -->
        <div
          class="q-pt-md"
          v-if="$q.screen.gt.sm"
        >
          <slot name="content">
            <q-card :class="cardStyle+'-card'">
              <q-card-section>
                <component
                  :is="`${capitalize(type)}Intro`"
                  :param="{id: +id, category: category, objectID: objectID}"
                  :id="+id"
                />
              </q-card-section>
            </q-card>
          </slot>
        </div>
        <!-- 右侧内容 -->
        <div class="column q-gutter-y-md">
          <q-timeline color="brown-5">
            <q-timeline-entry class="text-h5 ">
              {{$t('history.heading')}}
            </q-timeline-entry>

            <q-timeline-entry
              v-for="history in historys"
              :key="history.Id"
              :subtitle="history.ActTime|formatActionDate"
            >
              <div>
                {{$t('history.title',{Actor:history.Actor, Action:$t('history.Action.' + history.Action), Name:$t(`${something[history.Name]||history.Name}.title`)})}}
                <span v-if="history.Extra">
                  <span
                    class="text-primary"
                    v-if="!(history.Name ==='document' && history.Extra.Title==='Title')"
                  >
                    {{getFieldName(history)}}
                  </span>
                  <div
                    v-if="history.Extra.OldContent"
                    class="q-pl-sm"
                  >
                    <div v-if="history.Extra.Title==='CronSchedule'">
                      <span>
                        {{$t(`history.Extra.OldContent`,{content:getFieldName(history)})}}
                      </span>
                      <span class="text-primary">
                        {{GetTitle(history)}}
                      </span>
                    </div>
                    <div v-else>
                      <div v-if="history.Name ==='document' && history.Extra.Title==='Title'">
                        <span>
                          {{$t(`history.Extra.OldContent`,{content:'文档'})}}
                        </span>
                        <!-- history.Extra.OldContent.includes('|')是为了兼顾历史数据 -->
                        <span>
                          <q-btn
                            flat
                            style="text-decoration:underline;"
                            type="a"
                            :label="history.Extra.OldContent.includes('|')?history.Extra.OldContent.split('|')[0]:history.Extra.OldContent"
                            color="primary"
                            @click="history.Extra.OldFilePath&&download(history.Extra.OldFilePath)"
                          />
                        </span>
                      </div>
                      <div v-else>
                        <span>
                          {{$t(`history.Extra.OldContent`,{content:getFieldName(history)})}}
                        </span>
                        <mind-map
                          v-if="markmap && markmap.extension === 'markmap'"
                          :controls='false'
                          :code="history.Extra.OldContent"
                          :title="getFieldName(history)"
                        />
                        <span
                          v-else
                          class="text-primary tiptap-content editor__content"
                          v-html="history.Extra.OldContent"
                        >
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="history.Extra.Send">
                    <span>
                      {{$t(`history.Extra.Send`,{content:getFieldName(history)})}}
                    </span>
                    <span
                      class="text-primary tiptap-content editor__content"
                      v-html="history.Extra.Send"
                    >
                    </span>
                  </div>
                </span>
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { format, date } from 'quasar'
import { convertToModel } from '@/store/checkins/model'
import { download } from '@/boot/file'
const { capitalize } = format,
  module = {
    event: 'schedule',
    question: 'checkins',
    answer: 'checkins'
  }
export default {
  name: 'TwHistory',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    objectID: {
      type: [Number, String],
      required: false
    },
    category: {
      type: String,
      required: false
    },
    cardStyle: {
      type: String,
      default: 'torn', // whole
      required: false,
      description: '撕边/完整卡片'
    },
    type: {
      type: String,
      required: false,
      description: '用于调取各模块action，如 `type`/load`type`History'
    }
  },
  filters: {
    /**
     * 格式化活动日期取时间。格式为HH:mm
    **/
    formatActionDate (actTime) {
      return date.formatDate(actTime, 'YYYY-MM-DD HH:mm')
    }
  },
  components: {
    EventIntro: () => import('components/calendar/EventIntro'),
    TaskIntro: () => import('components/task/TaskIntro'),
    QuestionIntro: () => import('components/checkins/QuestionIntro'),
    AnswerIntro: () => import('components/checkins/AnswerIntro'),
    ProductIntro: () => import('components/product/ProductIntro'),
    MindMap: () => import('components/document/markmap/MindMap')
  },
  data () {
    return {
      historys: [],
      showExtra: false,
      something: {
        item: 'task.item',
        group: 'task.group',
        list: 'task.list'
      }
    }
  },
  computed: {
    markmap () {
      return this.$store.getters['document/currentModel'](+this.id)
    }
  },
  created () {
    this.$store.dispatch(`${module[this.type.toLowerCase()] || this.type.toLowerCase()}/load${capitalize(this.type.toLowerCase())}History`, +this.id)
      .then(historys => {
        if (this.type === 'task') {
          this.historys = []
          historys.forEach(item => {
            if (item.Extra.OldContent && item.Extra.OldContent === '1000/1/1 0:00:00') {
              item.Extra.OldContent = '空'
            } else if (item.Extra.OldContent) {
              item.Extra.OldContent = item.Extra.OldContent.replace('0:00:00', '')
            }
            this.historys.push(item)
          })
        } else {
          this.historys = historys
        }
      })
  },
  methods: {
    download,
    GetPersonName (model) {
    },
    GetTitle (model) {
      let title = ''
      if (model.Extra.Title && model.Extra.Title === 'CronSchedule') {
        let cron = convertToModel(model.Extra.OldContent)
        title = this.$t('history.CronSchedule.header.title', { Cron: this.GetCron(cron), time: cron.time })
      }
      return title
    },
    GetCron (cron) {
      if (cron.type === 'month') {
        if (cron.monthtype === 'firstweek') {
          return this.$t('question.header.cron.firstweek', { days: this.GetDays(cron) })
        } else if (cron.monthtype === 'lastweek') {
          return this.$t('question.header.cron.lastweek', { days: this.GetDays(cron) })
        } else if (cron.monthtype === 'lastday') {
          return this.$t('question.header.cron.lastday')
        } else {
          return this.$t('question.header.month', { days: this.GetDays(cron) })
        }
      } else if (cron.type === 'week') {
        return this.$t('question.header.week', { days: this.GetDays(cron) })
      } else {
        return this.$t('question.header.day')
      }
    },
    GetDays (cron) {
      let days = []
      if (cron.days) {
        if (cron.days.includes('sun')) {
          days.push(this.$t('checkins.sunday'))
        }
        if (cron.days.includes('mon')) {
          days.push(this.$t('checkins.monday'))
        }
        if (cron.days.includes('tue')) {
          days.push(this.$t('checkins.tuesday'))
        }
        if (cron.days.includes('wed')) {
          days.push(this.$t('checkins.wednesday'))
        }
        if (cron.days.includes('thu')) {
          days.push(this.$t('checkins.thursday'))
        }
        if (cron.days.includes('fri')) {
          days.push(this.$t('checkins.friday'))
        }
        if (cron.days.includes('sat')) {
          days.push(this.$t('checkins.saturday'))
        }
      }
      if (cron.monthtype === 'day') {
        days.push(cron.days)
      }
      return days.join(' ')
    },
    getFieldName (history) {
      return history.Name === 'product' || history.Action === 'send'
        ? history.Extra.Title
        : this.$t(`history.Extra.${history.Extra.Title}`)
    },
    capitalize
  }
}
</script>

<style lang="scss" scoped>
  .q-timeline--dense--right .q-timeline__entry {
    padding-left: 20px;
  }
  /deep/.q-timeline__subtitle {
    opacity: 1;
    margin-bottom: 0;
    color: #283c46;
    font-weight: normal;
  }
  /deep/.q-timeline__title {
    margin-bottom: 0;
  }
  /deep/.q-timeline__dot:before {
    width: 9px;
    height: 9px;
    top: 7px;
    left: 3px;
  }
  /deep/.q-timeline__dot:after {
    width: 1px;
    opacity: 1;
    left: 7px;
    top: 16px;
    bottom: -8px;
  }
  /deep/.extra_old_content p {
    margin-bottom: 0 !important;
  }
</style>
