<template>
  <q-card-section>
    <div class="q-px-xxl">
      <slot name="content">
        <q-card-section class="q-pt-none q-gutter-y-sm">
          <div class="row no-wrap col">
            <div class="col q-gutter-y-sm">
              <div class="text-subtitle2">
                {{cardItem.modifyBy}}
                {{$t('document.modify.lastUpdated')}}
                {{timeAgo({ dateTime:cardItem.modifyTime.replace(/-/g, '/')})}}
              </div>
              <div style="font-size:12px;">{{cardItem.noticeType}}</div>
              <div class="text-h6">
                <span class="text-weight-bold">{{cardItem.title}}</span>
              </div>
            </div>
          </div>
          <div
            v-html="cardItem.content"
            class="tiptap-content editor__content"
          ></div>
        </q-card-section>
      </slot>
    </div>
  </q-card-section>
</template>

<script>
import { format } from 'quasar'
const { capitalize } = format
import { mapActions } from 'vuex'
import timeAgo from '@/utils/time-ago'
export default {
  name: 'DocumentPublicDetail',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    type: {
      type: String,
      default: 'document'
    },
    code: {
      type: String,
      required: false
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
  data () {
    return {
      quickSelected: null
    }
  },
  mounted () {
    if (!this.$route.name === 'publicLink') {
      this.init()
    }
  },
  computed: {
    elementStyle () {
      return ['q-mt-md', { 'col pageDetailWidth': this.$q.screen.gt.sm }]
    },
    cardItem () {
      return this.$store.getters[`${this.type}/currentModel`](+this.id)
    }
  },
  watch: {
    id: function (id) {
      if (!this.$route.name === 'publicLink') {
        this.init()
      }
    }
  },
  methods: {
    timeAgo,
    ...mapActions('member', ['loadMembers']),
    init () {
      let that = this
      this.$store.dispatch(`${this.type}/load${capitalize(this.type)}`, this.id)
      // 获取资源类型指定的人员(用于订阅组件快捷选中人员)
      that.category && that.objectID && that.loadMembers({ category: that.category, objectID: +that.objectID }).then(ids => {
        if (ids.length) {
          that.quickSelected = {
            title: that.$t(`${that.category}.title`) + '成员',
            personIDs: ids
          }
        }
      })
    },
    updateModel (item) {
      if (this.type === 'document') {
        this.cardItem = item
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
</style>
