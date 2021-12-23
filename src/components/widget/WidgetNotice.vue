<template>
  <widget-layout
    :isEmpty="notices.length===0"
    widget="notice"
    :category="category"
    :id="objectID"
  >
    <template slot="content">
      <q-list :class="{'emoji-font':$q.platform.is.win}">
        <q-item
          v-for="notice in notices"
          :key="notice.id"
          class="text-left"
        >
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{notice.title}}
            </q-item-label>
            <q-item-label
              caption
              lines="1"
            >
              {{notice.noticeType?`${notice.noticeType}—`:''}}
              <span v-html="notice.content.replace(/<\/?.+?>/g, '').replace(/check_box_outline_blank/g,'cat').replace(/check_box/g,'cat')"></span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </template>
  </widget-layout>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'NoticeCard',
  props: {
    category: {
      type: String,
      default: undefined,
      required: true
    },
    objectID: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      notices: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('notice', ['loadWidgetNotices']),
    init () {
      this.loadWidgetNotices({
        query: JSON.stringify([
          { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' },
          'and',
          { Key: 'IsPublish', Value: 1, Oper: 'eq' },
          'and',
          { Key: 'Archived', Value: 0, Oper: 'eq' }
        ])
      }).then(notices => {
        this.notices = notices
      })
    }
  },
  watch: {
    objectID (newVal) {
      this.init()
    }
  },
  components: {
    WidgetLayout: () => import('layouts/WidgetLayout')
  }
}
</script>

<style scoped>
</style>
