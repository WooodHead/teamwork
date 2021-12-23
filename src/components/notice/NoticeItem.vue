<template>
  <q-item
    v-ripple
    class="cursor-pointer"
    @click.native="$emit('click-item',notice)"
  >
    <q-item-section class="col-12">
      <q-item-label class="ellipsis text-grey-9 text-left text-h2-g ">
        <span class="text-bold">
          {{notice.title}}
        </span>
      </q-item-label>
      <q-item-label
        caption
        :lines="dense?1:2"
        class="text-left"
      >
        {{notice.noticeType}} • 
        <span>{{formatDate(notice.modifyTime.replace(/-/g, '/'),'YYYY-MM-DD')}}</span>—
        <span
          class="text-body2 text-text2"
          v-html="notice.content.replace(/<\/?.+?>/g, '').replace(/check_box_outline_blank/g,'cat').replace(/check_box/g,'cat')"
        ></span>
      </q-item-label>
    </q-item-section>

    <q-item-section
      side
      top
      v-if="notice.isPublish==0"
    >
      <q-btn
        flat
        round
        icon="delete"
        color="negative"
        @click.native.stop="deleteNotice"
      />
    </q-item-section>
    <q-item-section
      side
      v-if="notice.isPublish && !dense"
    >
      <q-badge
        rounded
        v-if="notice.commentCount"
        align="middle"
        :label="notice.commentCount"
        color="primary"
        title="评论数"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import { showConfirm } from '@/utils/show-confirm'
import { date } from 'quasar'
const { formatDate } = date
export default {
  name: 'NoticeItem',
  props: {
    notice: {
      type: Object,
      required: true
    },
    dense: {
      type: Boolean,
      default: false,
      required: false
    },
    showAvatar: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatDate,
    deleteNotice () {
      let that = this
      showConfirm(that.$t('message.reallyDelete'), () => {
        that.$store.dispatch('notice/deleteNotice', +that.notice.id)
      })
    }
  },
  components: {
    // 'TwAvatar': () => import('components/base/TwAvatar')
  }
}
</script>

<style scoped>
.q-item__section--avatar {
  min-width: 38px;
}
</style>
