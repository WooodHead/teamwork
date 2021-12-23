<template>
  <q-card
    flat
    bordered
    class="cursor-pointer consult-card"
    @click.stop="openDetail"
  >
    <q-card-section class="q-pt-sm q-pb-none">
      <div class="row items-center no-wrap">
        <div>
          <tw-avatar
            size="md"
            :id="model&&model.consultantID"
          />
        </div>

        <div class="q-pl-sm line-height32">
          <q-icon name="arrow_forward" />
        </div>

        <div class="q-pl-sm">
          <tw-avatar
            size="md"
            :id="model&&model.transactorID"
          />
        </div>
        <q-space />
        <q-badge
          class="text-tip-g"
          :color="consultStatus[+model.status].color"
          :label="consultStatus[+model.status].label"
        />
      </div>
      <div
        class="q-pt-sm text-weight-bold ellipsis"
        :title="item&&item.title"
      > {{item&&item.title}}
      </div>
    </q-card-section>

    <q-item>
      <q-item-section>
        <span :style="$q.screen.lt.sm?'':'min-height:9.5vh;'">
          <q-item-label
            :lines="2"
            :title="htmlToText(model&&model.content)"
            style="word-wrap: break-word;"
            v-html="$t('consult.question')+htmlToText(model&&model.content)"
          />
          <q-item-label
            :lines="2"
            :title="htmlToText(answer())"
            style="word-wrap: break-word;"
            v-html="$t('consult.answer')+htmlToText(answer())"
          />
        </span>

        <q-item-label
          caption
          :lines="1"
          class="q-pt-xs"
        >
          {{model.startTime||model.submitTime}}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script>
import htmlToText from '@/utils/html-to-text'
import { mapState } from 'vuex'
export default {
  name: 'ConsultCards',
  props: {
    model: { type: Object }
  },
  computed: {
    ...mapState('consult', ['consultStatus']),
    item () {
      return this.$store.getters['consult/consultItem'](+this.model.itemID)
    }
  },
  methods: {
    htmlToText,
    openDetail () {
      this.$router.push({
        name: 'consultDetail',
        params: { id: +this.model.id }
      })
    },
    answer () {
      // 显示办理人回复的最后一条消息。如果没有，显示除申请人回复的最后一条消息
      if (!_.isEmpty(this.model)) {
        let answer = this.model.communication.filter(n => { return n.roleName === 'Transactor' })
        if (answer && answer.length) {
          return answer[answer.length - 1].content
        } else {
          answer = this.model.communication.filter(n => { return n.roleName !== 'Consultant' })
          return (answer && answer[answer.length - 1].content) || ''
        }
      } else {
        return ''
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style lang="scss" scoped>
.consult-card {
  overflow: hidden;
  border-radius: 0.6rem;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.line-height32 {
  line-height: 32px;
}
/deep/.q-badge {
  padding: 5px 7px;
}
</style>
