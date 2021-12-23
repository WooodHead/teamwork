<template>
  <div>
    <q-item
      clickable
      class="q-pa-md"
      @click="openEdit"
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
          @click.stop="Delete(draft.id)"
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
  data () {
    return {
      showEditDraft: false,
      maximizedToggle: true
    }
  },
  props: {
    draft: {
      type: Object,
      default: function () {
        return []
      }
    },
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('document', ['deleteDocument']),
    htmlToText,
    timeAgo,
    openEdit () {
      let params = { id: +this.draft.id }
      if (this.category) {
        Object.assign(params, { category: this.category, objectID: this.objectID })
      }
      this.$router.push({ name: `${this.draft.classify}Detail`, params })
    },
    Delete (value) {
      let that = this
      showConfirm(this.$t('action.reallyDelete'), () => {
        that.deleteDocument(that.draft.id).then(item => {
        })
      })
    }
  }
}
</script>

<style>
</style>
