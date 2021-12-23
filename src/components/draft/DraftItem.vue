<template>
  <div>
    <q-item
      clickable
      class="q-pa-md"
      @click="openDetail"
    >
      <q-item-section>
        <q-item-label
          lines="1"
          class="text-h6 text-weight-bold"
        >
          {{ draft.title }}
        </q-item-label>
        <q-item-label
          lines="2"
          class="text-body1 text-brown"
        >
          <span>{{ isDocType() }}</span>
          <span v-html="$t('document.modify.lastEdited',{
           dateTime:timeAgo({ dateTime: draft.modifyTime })
          })">
          </span>
          —
          <span
            class="text-black"
            v-html="htmlToText(draft.content)"
          >
          </span>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          dense
          v-close-popup
          flat
          round
          icon="delete"
          @click.stop="Delete()"
        />
      </q-item-section>
    </q-item>
    <q-separator
      inset
      spaced
    />
  </div>

</template>

<script>
import htmlToText from '@/utils/html-to-text'
import timeAgo from '@/utils/time-ago'
import { showConfirm } from '@/utils/show-confirm'
import { mapActions } from 'vuex'
export default {
  name: 'DraftItem',
  props: {
    draft: {
      type: Object,
      default: function () {
        return []
      }
    }
  },
  methods: {
    ...mapActions('document', ['deleteDocument']),
    ...mapActions('notice', ['deleteNotice']),
    htmlToText,
    timeAgo,
    openDetail () {
      if (this.draft.classify) {
        let params = { id: +this.draft.id }
        if (this.draft.objectType) {
          Object.assign(params, { category: this.draft.objectType, objectID: +this.draft.objectID })
        }
        this.$router.push({ name: `${this.draft.classify}Detail`, params })
      } else {
        this.$router.push({
          name: 'noticeDetail',
          params: { id: +this.draft.id, category: this.draft.objectType, objectID: +this.draft.objectID }
        })
      }
    },
    Delete () {
      let that = this
      showConfirm(that.$t('action.reallyDelete'), () => {
        if (this.draft.classify) {
          that.deleteDocument(+that.draft.id)
        } else {
          that.deleteNotice(+that.draft.id)
        }
      })
    },
    isDocType () {
      return this.draft.classify ? '【文档】' : '【公告】'
    }
  }
}
</script>

<style>
</style>
