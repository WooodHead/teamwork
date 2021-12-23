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
          <template>
            <q-badge
              floating
              v-if="messageType[message.type]"
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
          :title="$t('message.resumeUnreaded')"
          text-color="red"
          color="grey-5"
          size="0.6rem"
          font-size="0.6rem"
          class="cursor-pointer"
          @mouseover="showUndo=true"
          @mouseleave="showUndo=false"
          @click.stop="markAsUnread(message.id)"
          :icon="showUndo?'undo':''"
        />
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import htmlToText from '@/utils/html-to-text'
export default {
  data () {
    return {
      showUndo: false
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
    ...mapActions('message', ['markAsUnread']),
    htmlToText
  },
  components: {
    'tw-avatar': () => import('components/base/TwAvatar')
  }
}

</script>
<style lang='scss' scoped>
  .btn-visiable {
    display: none;
  }
  .q-badge {
    padding: 4px;
    border-radius: 50%;
  }
  .q-item:hover {
    background: $blue-grey-1;
  }
</style>
