<template>
  <div>
    <q-carousel
      v-model="slide"
      padding
      autoplay
      swipeable
      animated
      infinite
      navigation
      navigation-icon="radio_button_unchecked"
      transition-next="slide-left"
      control-color="white"
      :height="height"
    >
      <template v-if="lstNotice.length>0">
        <q-carousel-slide
          v-for="notice in lstNotice"
          :key="notice.id"
          :name="notice.id"
          :img-src="getImgSrc(notice)"
          class="cursor-pointer"
          @click="onClick(notice)"
        >
          <div class="row full-height">
            <div class="col-8 column no-wrap flex-center">
              <div class="text-h1-g text-text1 text-white text-left full-width ellipsis">{{notice.title}}</div>
              <div class="text-white text-left full-width ellipsis-2-lines q-mt-xs">{{notice.content | filterText}}</div>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          v-if="showMore && lstNotice.length===4"
          name="more"
          :img-src="getImgSrc()"
          class="cursor-pointer"
          @click="onMore"
        >
          <div class="row full-height">
            <div class="col-8 column no-wrap flex-center">
              <div class="text-h1-g text-text1 text-white text-left full-width ellipsis">查看更多……</div>
            </div>
          </div>
        </q-carousel-slide>
      </template>

      <template v-else>
        <q-carousel-slide
          name="default"
          :img-src="getImgSrc()"
        />
      </template>

      <template v-slot:control>
        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
        >
          <div class="q-gutter-sm">
            <q-btn
              v-if="showConfig"
              round
              dense
              unelevated
              color="white"
              text-color="primary"
              icon="settings"
              @click="carouselConfig"
            />
          </div>
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TwCarouselNotice',
  props: {
    objectType: { type: String, required: true },
    objectId: { type: Number, required: true },
    list: { type: Array, desc: '直接传列表数据' },
    height: { type: String, default: '200px' },
    showConfig: { type: Boolean, default: false },
    showMore: { type: Boolean, default: false }
  },
  data () {
    return {
      slide: 'default'
    }
  },
  filters: {
    filterText: function (value) {
      return value.replace(/<.+?>/g, '')
    }
  },
  watch: {
    lstNotice (newVal, oldVal) {
      if ((this.slide === 'default' || !_.some(newVal, { id: this.slide })) && newVal.length > 0) {
        this.slide = this.lstNotice[0].id
      } else if (this.lstNotice.length === 0) {
        this.slide = 'default'
      }
    }
  },
  computed: {
    ...mapState('notice', ['notices']),
    lstNotice () {
      return this.list || _.orderBy(
        _.filter(this.notices, n =>
          n.objectType === this.objectType &&
          n.objectID === this.objectId &&
          n.isPublish === 1 &&
          !n.archived &&
          !n.deleted),
        ['orderNumber', 'modifyTime'], ['desc', 'desc']).slice(0, 4)
    }
  },
  methods: {
    ...mapActions('notice', ['loadNotices', 'loadWidgetNotices']),
    getImgSrc (notice) {
      let imgSrc = ''
      // 根据noticeType匹配内置背景，默认设备公告
      switch (this.objectType) {
        case 'product':
          imgSrc = '/icons/notice/device.png'
          break
        default:
          if (notice) {
            /喜报/.test(notice.noticeType) ? (imgSrc = '/icons/notice/project-good-news.png')
              : /赏罚/.test(notice.noticeType) ? (imgSrc = '/icons/notice/award-punishment.png')
                : /设备/.test(notice.noticeType) ? (imgSrc = '/icons/notice/device.png')
                  : /会议/.test(notice.noticeType) ? (imgSrc = '/icons/notice/meeting.png')
                    : /人事/.test(notice.noticeType) ? (imgSrc = '/icons/notice/personnel-assignment.png')
                      : /制度/.test(notice.noticeType) ? (imgSrc = '/icons/notice/system-renewal.png')
                        : (imgSrc = '/icons/notice/general.png')
          } else {
            imgSrc = '/icons/notice/general.png'
          }
          break
      }
      return imgSrc
    },
    carouselConfig () {
      this.$router.push({ name: 'notice', params: { category: this.objectType } })
    },
    onClick (notice) {
      let params = { category: this.objectType, id: notice.id }
      this.objectId && Object.assign(params, { objectID: this.objectId })
      this.$router.push({ name: 'noticeDetail', params })
    },
    onMore () {
      this.$router.push({ name: 'notice', params: { category: this.objectType, objectID: this.objectId } })
    }
  },
  created () {
    if (!this.list) {
      let queryNotices = [
        { Key: 'ObjectType', Value: this.objectType, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectId, Oper: 'eq' },
        'and',
        { Key: 'IsPublish', Value: 1, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' }
      ]
      this.loadNotices({ query: queryNotices })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
