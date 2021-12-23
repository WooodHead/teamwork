<template>
  <!-- <q-card
    v-if="!$q.platform.is.mobile"
    flat
    bordered
  >
    <q-card-section>
      <div
        v-if="homeOrganizeId>0"
        class="flex"
      >
        <router-link
          tag="span"
          class="text-h1-g text-text1 cursor-pointer"
          :to="{name:'notice',params:{category:'organize',objectID:homeOrganizeId}}"
        >{{organizeNoticeWidget.label}}</router-link>
        <q-space />
        <router-link
          tag="span"
          class="text-body-g text-text3 cursor-pointer"
          :to="{name:'notice',params:{category:'organize',objectID:homeOrganizeId}}"
        >查看更多 ></router-link>
      </div>
      <div v-else>
        <span class="text-yellow-8">{{$t('home.homeOrganizeNotes')}}</span>
      </div>
    </q-card-section>

    <div class="text-center">
      <template v-if="notices.length>0">
        <tw-carousel-notice
          objectType="organize"
          :objectId="homeOrganizeId"
          :list="notices"
        />
      </template>
      <template v-else>
        <q-card-section :class="$q.screen.gt.xs?'q-py-lg':'q-py-xs'">
          <q-btn
            round
            :size="$q.screen.gt.xs?'32px':'20px'"
            :color="organizeNoticeWidget.color"
            :icon="organizeNoticeWidget.icon"
            :to="homeOrganizeId>0?{name:'notice',params:{category:'organize',objectID:homeOrganizeId}}:{name:'home'}"
          />
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-9">
          {{organizeNoticeWidget.notes}}
        </q-card-section>
      </template>
    </div>
  </q-card> -->

  <q-card
    flat
    :bordered="!$q.platform.is.mobile"
  >
    <tw-carousel-notice
      objectType="organize"
      :objectId="homeOrganizeId"
      :list="notices"
      :height="$q.platform.is.mobile ? '152px' : '214px'"
    />

    <q-card-section>
      <div
        class="row items-center q-gutter-x-sm cursor-pointer"
        @click="onMore"
      >
        <q-icon
          name="volume_up"
          size="sm"
          color="orange"
        />
        <span class="text-h3-g">更多公告</span>
        <q-icon
          name="chevron_right"
          size="sm"
          color="grey-5"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Company',
  components: {
    TwCarouselNotice: () => import('components/base/TwCarouselNotice')
  },
  data () {
    return {
      homeOrganizeId: 0,
      homeOrganize: {},
      organizeNoticeWidget: {},
      notices: []
    }
  },
  methods: {
    ...mapActions('settings', ['loadSettings']),
    ...mapActions('resource', ['loadCategory']),
    ...mapActions('organize', ['loadCompany']),
    ...mapActions('notice', ['loadWidgetNotices']),
    loadByHomeOrganizeId (organizeId) {
      let that = this
      this.loadCompany(organizeId)
        .then(res => {
          that.homeOrganize = res
        })
      that.loadWidgetNotices({
        query: JSON.stringify([
          { Key: 'ObjectType', Value: 'organize', Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: organizeId, Oper: 'eq' },
          'and',
          { Key: 'IsPublish', Value: 1, Oper: 'eq' },
          'and',
          { Key: 'Archived', Value: 0, Oper: 'eq' }
        ]),
        limit: 4
      }).then(function (notices) {
        that.notices = notices
      })
    },
    onMore () {
      this.$router.push({ name: 'notice', params: { category: 'organize', objectID: this.homeOrganizeId } })
    }
  },
  created () {
    let that = this

    that.loadCategory('organize').then(res => {
      that.organizeNoticeWidget = res.widgets.notice
    })

    this.loadSettings().then(settings => {
      if (settings && settings.company) {
        that.homeOrganizeId = settings.company.id
        that.loadByHomeOrganizeId(settings.company.id)
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.q-card--bordered {
  border: 1px solid $primary7;
}
</style>
