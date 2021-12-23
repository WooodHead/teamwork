<template>
  <div>
    <!-- 初始化未更新，正在加载中 -->
    <div
      class="row justify-center q-py-md"
      v-if="consults===null"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <!-- 初始化更新后，卡片列表length>0 -->
    <q-infinite-scroll
      @load="onLoadData"
      :offset="250"
      :class="`row justify-center ${$q.screen.gt.xs?'q-col-gutter-md':'q-col-gutter-sm'}`"
      ref="infiniteScroll"
    >
      <template>
        <div
          :class="`${$q.screen.gt.xs?'col-6':'col-12'}`"
          v-for="model in consults"
          :key="model.id"
        >
          <consult-cards :model="model" />
        </div>

      </template>
      <template
        v-slot:loading
        v-if="showLoading"
      >
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <!-- 初始化更新后，卡片列表length===0 -->
    <tw-banner-no-result
      v-if="consults.length===0"
      :info="consultSearch?
      $t('toolbar.noSearchResults'):
      $t('consult.slogan')"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'ConsultList',
  mounted () {
    this.$refs.infiniteScroll && this.$refs.infiniteScroll.resume()
    this.loadConsultItems()
  },
  computed: {
    ...mapState('consult', ['consultSearch', 'selectedStatus', 'consultStatus']),
    ...mapGetters('consult', ['consults']),
    showLoading () {
      return !(this.$store.state['consult'].page.nextPageToken === -1)
    }
  },
  watch: {
    consultSearch: {
      deep: true,
      handler (newVal, oldVal) {
        if (this.$refs.infiniteScroll) {
          this.$refs.infiniteScroll.reset() // 设置滚动索引为0
          this.$refs.infiniteScroll.resume() // 重新开启加载
          this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
        }
      }
    },
    selectedStatus: {
      deep: true,
      handler (newVal, oldVal) {
        if (this.$refs.infiniteScroll) {
          this.$refs.infiniteScroll.reset() // 设置滚动索引为0
          this.$refs.infiniteScroll.resume() // 重新开启加载
          this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
        }
      }
    }
  },
  methods: {
    ...mapActions('consult', ['loadConsults', 'loadConsultItems']),
    init (callBack) {
      let query = {}
      if (+this.selectedStatus) {
        query = { query: { Key: 'Status', Value: +this.selectedStatus, Oper: 'eq' } }
      }
      this.loadConsults(query).then(res => {
        if (res.length) {
          callBack && callBack()
        }
      })
    },
    onLoadData (index, done) {
      this.init(() => {
        if (this.$store.state['consult'].page.nextPageToken === -1) {
          done(true)
        } else {
          done()
        }
      })
    }
  },
  components: {
    ConsultCards: () => import('components/consult/ConsultCards'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 0.6rem;
}
</style>
