<!-- 我的应用 -->
<template>
  <q-card
    flat
    class="myApps"
    :style="$q.platform.is.mobile? '':'background:none;'"
  >
    <!-- 标题 -->
    <q-card-section v-if="$q.platform.is.mobile">
      <div class="cursor-pointer text-h2-g text-text1 ">
        {{$t('home.myApps.title')}}
      </div>
    </q-card-section>
    <!-- 列表 -->
    <q-card-section
      class="row q-py-xs"
      :class="$q.platform.is.mobile? 'items-stretch justify-start q-gutter-y-sm' : 'justify-center q-gutter-sm q-pa-none'"
    >
      <div
        v-for="app in commonUseApps"
        :key="app.name"
        class="relative-position"
        :class="{'col-3':$q.platform.is.mobile}"
      >
        <q-badge
          v-if="app.recommend"
          class="absolute-top-right"
          color="red"
          floating
        >
          推荐
        </q-badge>
        <q-badge
          v-if="app.latest"
          class="absolute-top-right"
          color="red"
          floating
        >
          最新
        </q-badge>
        <q-btn
          v-if="app.name==='more'"
          stack
          flat
          :title="app.notes"
          :color="app.color"
          :icon="app.icon"
          :size="$q.platform.is.mobile?'md':'lg'"
          :class="{'button-wrapper-mobile':$q.platform.is.mobile,'full-width':true}"
          @click="onClickMore"
        >
          <template>
            <div :class="$q.platform.is.mobile?'font-mobile':'font-pc'">
              {{app.label}}
            </div>
          </template>
        </q-btn>
        <q-btn
          v-else-if="app.to.external"
          stack
          flat
          :title="app.notes"
          :color="app.color"
          :icon="app.icon"
          :size="$q.platform.is.mobile?'md':'lg'"
          :class="{'button-wrapper-mobile':$q.platform.is.mobile,'full-width':true}"
          type="a"
          :href="app.to.path"
          target="_blank"
        >
          <template>
            <div :class="$q.platform.is.mobile?'font-mobile':'font-pc'">
              {{app.label}}
            </div>
          </template>
        </q-btn>
        <q-btn
          v-else
          stack
          flat
          :title="app.notes"
          :color="app.color"
          :icon="app.icon"
          :size="$q.platform.is.mobile?'md':'lg'"
          :class="{'button-wrapper-mobile':$q.platform.is.mobile,'full-width':true}"
          :to="app.to"
        >
          <template>
            <div :class="$q.platform.is.mobile?'font-mobile':'font-pc'">
              {{app.label}}
            </div>
          </template>
        </q-btn>
      </div>
    </q-card-section>
    <!-- 弹出框：入口设置 -->
    <q-dialog
      v-model="showAppGrid"
      :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    >
      <app-grid @edit="editCommonUseApps" />
    </q-dialog>
  </q-card>
</template>

<script>
export default {
  name: 'MyApps',
  data () {
    return {
      showAppGrid: false
    }
  },
  computed: {
    commonUseApps () {
      const useApps = this.$store.getters['home/commonUseApps']
      const apps = _.cloneDeep(useApps)
      if (!apps.find(i => i.name === 'more')) {
        apps.push({
          name: 'more',
          to: { name: 'room' },
          icon: 'app:tw-icon-store',
          color: 'blue-grey-6',
          label: '更多',
          notes: '查看/管理更多应用'
        })
      }
      return apps
    }
  },
  methods: {
    editCommonUseApps (apps) {
      this.showAppGrid = false
      window.location.reload()
    },
    onClickMore () {
      this.showAppGrid = true
    }
  },
  components: {
    AppGrid: () => import('components/home/AppGrid')
  }
}
</script>

<style lang='scss' scoped>
.font-mobile {
  font-size: 14px;
}
.font-pc {
  font-size: 18px;
}
.button-wrapper-mobile {
  /deep/.q-btn__wrapper {
    padding-left: 0;
    padding-right: 0;
  }
}
.myApps .q-badge {
  z-index: 2;
}

</style>
