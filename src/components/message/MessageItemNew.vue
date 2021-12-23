<template>
  <div>
    <q-item
      v-ripple
      class="cursor-pointer"
    >
      <q-item-section avatar>
        <tw-avatar
          :id="message.senderID"
          :name="message.senderName"
          :img="message.senderImg"
        >
          <template v-if="messageType[message.type]">
            <q-badge
              floating
              :color="messageType[message.type].color"
            >
              <q-icon
                :name="messageType[message.type].isSvg?
                `img:icons/${messageType[message.type].icon}.svg`:
                messageType[message.type].icon"
                color="white"
                class="rounded-borders"
              />
            </q-badge>
          </template>
        </tw-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="row no-wrap ellipsis">
          {{message.tag? $t(`message.tag.${message.tag}`) : ''}}
          <span v-html="htmlToText(message.title)"></span>
        </q-item-label>
        <q-item-label
          caption
          lines="1"
          class="q-gutter-sm"
        >
          <span>{{message.senderID?message.senderName:$t('app.logo')}}</span>
          <span>{{message.module?message.module.title:''}}</span>
          <span>{{message.sendTime}}</span>
        </q-item-label>
      </q-item-section>
      <q-item-section
        side
        top
      >
        <q-avatar
          v-ripple
          :title="$t('message.markAsRead')"
          text-color="white"
          color="red"
          size="0.6rem"
          font-size="0.6rem"
          class="cursor-pointer"
          @mouseover="showClose=true"
          @mouseleave="showClose=false"
          @click.stop="readMessage(message.id)"
          :icon="showClose?'close':''"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import htmlToText from '@/utils/html-to-text'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      showClose: false,
      close: 'close'
    }
  },
  props: {
    message: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState('message', ['messageType'])
  },
  methods: {
    ...mapActions('message', ['readMessage']),
    htmlToText
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar')
  }
}
</script>
<style lang='scss' scoped>
  .q-badge {
    padding: 4px;
    border-radius: 50%;
  }
  .q-item:hover {
    background: $blue-grey-1;
  }
</style>
