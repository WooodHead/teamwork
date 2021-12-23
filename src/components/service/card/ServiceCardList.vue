<template>
  <div>
    <div class="flex q-gutter-y-md">
      <service-card
        v-for="model in modelList"
        :key="model.id"
        :model="model"
      />
    </div>

    <div
      v-if="showLoading"
      class="row justify-center q-my-md"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>

    <div
      v-if="showMore"
      class="q-mt-md text-center"
    >
      <q-btn
        flat
        color="primary"
        icon-right="keyboard_arrow_down"
        :label="$t('service.more')"
        @click="loadMore"
      />
    </div>

    <tw-banner-no-result
      v-if="modelList.length===0&&!showForm"
      :info="$t('service.noServices')"
      class="q-mt-md"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ServiceCardList',
  components: {
    ServiceCard: () => import('components/service/card/ServiceCard'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  props: {
    showForm: { type: Boolean, default: false, desc: '新建表单是否打开' }
  },
  data () {
    return {
      showLoading: true
    }
  },
  computed: {
    ...mapState('service', ['listServices', 'page']),
    showMore () {
      return this.page.nextPageToken !== -1
    },
    modelList () {
      return _.filter(this.listServices, { archived: false })
    }
  },
  methods: {
    ...mapActions('service', ['loadServices']),
    init () {
      let that = this
      let query = [
        { 'Key': 'Archived', 'Value': 0, 'Oper': 'eq' },
        'and',
        { 'Key': 'IsDelete', 'Value': 0, 'Oper': 'eq' }
      ]
      return this.loadServices({ query: query })
        .then(res => {
          if (that.modelList.length === 0) {
            that.page.nextPageToken = -1
            that.$emit('nodata')
          }
          that.showLoading = false
        })
    },
    loadMore () {
      this.showLoading = true
      this.init()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang='scss' scoped>
.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}
</style>
