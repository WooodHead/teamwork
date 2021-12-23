<template>
  <q-page>
    <q-card class="card-grow-in-page">
      <tw-header
        :title="$t('settings.personalSettingsTitle')"
        noMenu
      ></tw-header>
      <!-- 头部logo -->
      <q-card-section
        v-if="!$q.platform.is.mobile"
        class="text-center q-px-none"
      >
        <!-- 顶部头像 -->
        <tw-avatar :id="$myinfo.id" />
        <div class=" text-h5 q-py-sm">
          {{$t('settings.personalSettingsTitle')}}</div>
        <q-separator />
      </q-card-section>
      <q-card-section class="q-px-xxl q-pt-none">
        <q-list
          separator
          class="text-left rounded-borders"
        >
          <q-item>
            <q-item-section>
              <q-item-label>{{$t('settings.dataViewSetting')}}</q-item-label>
              <q-item-label caption>{{$t('settings.dataViewSettingNote')}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section
              side
              top
            >
              <q-radio
                v-model="listStyle"
                val="showcards"
                :label="$t('action.showcards')"
              />
            </q-item-section>

            <q-item-section>
              <q-img src="/icons/settings/cards-view.png" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section
              side
              top
            >
              <q-radio
                v-model="listStyle"
                val="showlist"
                :label="$t('action.showlist')"
              />
            </q-item-section>

            <q-item-section>
              <q-img src="/icons/settings/list-view.png" />
            </q-item-section>
          </q-item>

          <q-item v-if="!$q.platform.is.mobile">
            <q-item-section
              side
              top
            >
              <q-radio
                v-model="listStyle"
                val="showtable"
                :label="$t('action.showtable')"
              />
            </q-item-section>

            <q-item-section>
              <q-img src="/icons/settings/table-view.png" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
import { i18n } from '@/boot/i18n'
import { showSuccessMessage } from '@/utils/show-message'
export default {
  name: 'MySettings',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwHeader: () => import('components/base/TwHeader')
  },
  data () {
    return {
      myself: this.$q.localStorage.getItem('myself'),
      listStyle: ''
    }
  },
  watch: {
    listStyle (newVal, oldVal) {
      if (oldVal !== '' && newVal !== oldVal) {
        const mysettings = this.$q.localStorage.getItem('mysettings') || {}
        !mysettings[this.myself.id] && (mysettings[this.myself.id] = {})
        Object.assign(mysettings[this.myself.id], { listStyle: newVal })
        this.$q.localStorage.set('mysettings', mysettings)
        // 更新所有模块的当前数据视图
        this.setAllListStyle(newVal)
        showSuccessMessage(i18n.t(`settings.settingSucceed`))
      }
    }
  },
  methods: {
    ...mapMutations('resource', ['setAllListStyle'])
  },
  mounted () {
    const mysettings = this.$q.localStorage.getItem('mysettings') || {}
    this.listStyle = (mysettings[this.myself.id] &&
      mysettings[this.myself.id].listStyle) || 'showcards'
  }
}
</script>

<style lang='scss' scoped>
.my-title {
  font-size: 2em;
}
</style>
