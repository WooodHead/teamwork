<!-- 我的工具箱 -->
<template>
  <q-card
    flat
    :bordered="!$q.platform.is.mobile"
  >
    <!-- 标题 -->
    <q-card-section class="flex">
      <div class="cursor-pointer text-h2-g text-text1 ">
        {{$t('home.myWorkPlate.title')}}
      </div>
    </q-card-section>
    <!-- 列表 -->
    <q-card-section class="row items-stretch justify-start q-gutter-y-sm q-pt-none">
      <div
        v-for="item in myTools"
        :key="item.name"
        class="relative-position col-3"
      >
        <q-btn
          :size="$q.platform.is.mobile?'':'lg'"
          :color="item.color"
          :icon="item.icon"
          :to="toRoute(item)"
          @click="onClick(item)"
          class="full-width"
          stack
          flat
        >
          <template>
            <div
              class="text-dark text-body2"
              :class="$q.platform.is.mobile?'':'q-pt-sm '"
            >
              {{item.notes}}
            </div>
          </template>
        </q-btn>
      </div>
    </q-card-section>
    <!-- 弹出框 -> 历史记录 -->
    <q-dialog
      v-model="showHistoryCard"
      :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    >
      <history-list />
    </q-dialog>
  </q-card>
</template>

<script>
import { LocalStorage } from 'quasar'
const config = require('app/app.config.js')
export default {
  name: 'MyWorkPlate',
  data () {
    return {
      myself: LocalStorage.getItem('myself'),
      recentHistory: JSON.parse(LocalStorage.getItem('recent-history/' + LocalStorage.getItem('myself').id)),
      showHistoryCard: false
    }
  },
  computed: {
    allTools () {
      return this.$store.state.home.tools
    },
    commonTools () {
      return config.app.toolsDefaultInWorkbench
    },
    myTools () {
      return _.map(this.commonTools, name => {
        return this.allTools[name]
      })
    }
  },
  methods: {
    toRoute (item) {
      if (item.name === 'history') {
        return ''
      } else {
        return item.to
      }
    },
    onClick (item) {
      if (item.name === 'history') {
        this.showHistoryCard = true
      }
    }
  },
  components: {
    HistoryList: () => import('components/home/HistoryList')
  }
}
</script>

<style lang='scss' scoped>
.relative-position /deep/.q-btn__wrapper {
  padding-left: 0;
  padding-right: 0;
}
</style>
