<template>
  <q-card flat>
    <div class="row items-center q-mb-lg">
      <q-avatar
        :size="$q.screen.lt.sm?'md':''"
        color="primary"
        text-color="white"
      >
        <span>{{filterCommunications.length}}</span>
      </q-avatar>
      <span :class="$q.screen.gt.xs?'q-ml-md text-h5':'q-ml-sm text-subtitle1'">
        {{$q.lang.getLocale().includes('zh') ?$t('consult.consultDetail.chinese'):''}}{{$t('consult.consultDetail.communication')}}
      </span>
      <div :class="['col',$q.screen.gt.xs?'q-pl-md':'q-pl-sm']">
        <q-separator
          color="dark"
          :style="$q.screen.gt.xs?'height:3px':'height:1px'"
        />
      </div>
    </div>

    <q-list class="q-gutter-md">
      <div
        class="row"
        v-for="(communication,index) in filterCommunications"
        :key="index"
      >
        <tw-avatar
          v-if="$q.screen.gt.xs"
          :id="communication.senderID"
          class="q-mt-md"
        />
        <q-card
          class="bg-grey-1 col"
          flat
        >
          <q-item
            :class="{'q-pl-none q-pt-none':$q.screen.lt.sm}"
            :style="$q.screen.lt.sm?'min-height: auto;':''"
          >
            <q-item-section
              v-if="$q.screen.lt.sm"
              avatar
            >
              <tw-avatar
                size="md"
                :id="communication.senderID"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ personName(communication.senderID)}}
              </q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section
              :style="$q.screen.lt.sm?'padding-left:0px;':''"
              side
            >
              <q-item-label caption>
                {{communication.senderTime}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section class="q-pt-none">
            <!-- 由于v-html无法分析vue组件，所以评分组件单独显示 -->
            <div v-if="communication.type===5">
              <q-rating
                v-if="communication.content &&JSON.parse(communication.content).newRate"
                v-model="JSON.parse(communication.content).newRate"
                max="5"
                size="2.5em"
                color="yellow"
                icon="star_border"
                icon-selected="star"
                no-dimming
              />
              <div
                v-if="communication.content &&JSON.parse(communication.content).newCommunication"
                v-html="JSON.parse(communication.content).newCommunication"
                class="q-pt-md"
                style="word-wrap: break-word;text-align: initial;"
              />
            </div>
            <div
              v-else
              v-html="communication.content"
              class="tiptap-content editor__content"
              style="word-wrap: break-word;text-align: initial;"
            ></div>
          </q-card-section>
        </q-card>
      </div>
    </q-list>
  </q-card>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ConsultCommunication',
  props: {
    communications: {
      type: Array,
      required: true,
      default: () => []
    },
    consultantID: {
      type: [Number, String],
      required: true,
      description: '咨询人ID'
    }
  },
  computed: {
    ...mapState('person', ['selectPersons']),
    filterCommunications () {
      if (this.$myinfo.auth.role.isConsultAdministrator || this.$myinfo.auth.role.isSystemAdministrator || +this.consultantID === +this.$myinfo.id) {
        return this.communications
      } else {
        return this.communications.filter(r => r.type !== 5)
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  },
  methods: {
    personName (id) {
      return id ? (this.selectPersons[+id] && this.selectPersons[+id].name) : this.$t('consult.consultDetail.autoReply')
    }
  }
}
</script>

<style lang="scss" scoped>
.q-card {
  border-radius: 1rem;
}
.q-item__section--avatar {
  min-width: 40px;
  padding-right: 8px;
}
</style>
