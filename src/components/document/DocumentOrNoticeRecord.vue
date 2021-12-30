<!--
@Name：文档公告的访问或者下载记录
@Author：陆欢
@date：2021/12/24
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div class="q-px-md">
    <div class="row justify-center q-py-md" v-if="modelList === null">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <!-- 初始化更新后，卡片列表length>0 -->
    <q-infinite-scroll
      @load="onLoadData"
      :offset="250"
      class="q-mb-lg row justify-center  q-pt-md"
      ref="infiniteScroll"
    >
      <q-list padding class="full-width">
        <q-item v-for="model in modelList" :key="model.id">
          <q-item-section top avatar>
            <tw-avatar size="lg" :id="model.psonId" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ model.psonName }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ organizeName(model.psonId) }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ model.createTime }}</q-item-label>
            <!-- <q-item-label caption>
              {{model.createTime}}
            </q-item-label> -->
          </q-item-section>
        </q-item>
      </q-list>

      <template v-slot:loading v-if="modelList.length > 0 && showLoading">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <!-- 卡片列表length===0时展示没有数据 -->
    <tw-banner-no-result v-if="modelList.length === 0" info="暂无记录" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DocumentOrNoticeRecord',
  props: {
    type: {
      type: String,
      default: 'visit.download',
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
    },
    id: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data () {
    return {}
  },
  mounted () {},
  computed: {
    ...mapState('file', [
      'visitorRecords',
      'visitRecords',
      'downloadRecords',
      'visitorRecordPage',
      'visitRecordPage',
      'downloadRecordPage'
    ]),
    showLoading () {
      const pagePayload = this[`${this.type}RecordPage`]
      return !(pagePayload['nextPageToken'] === -1)
    },
    modelList () {
      let list = this[`${this.type}Records`]
      let page = this[`${this.type}RecordPage`]
      if (list.length !== page.offset) {
        this.$store.commit(
          `${this.type}/UpdatePage`,
          Object.assign(page, { offset: list.length })
        )
      }
      return list
    }
  },
  methods: {
    organizeName (psonId) {
      let obj = this.$store.state.person.selectPersons[psonId]
      return obj ? obj.orgShortName : '-'
    },
    onLoadData (index, done) {
      this.init(() => {
        setTimeout(() => {
          if (!this.showLoading) {
            done(true)
          } else {
            done()
          }
        }, 1000)
      })
    },
    init (callBack) {
      let query = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: +this.id, Oper: 'eq' },
        'and',
        { Key: 'Type', Value: this.type === 'visitor' ? 'visit' : this.type, Oper: 'eq' }
      ]
      this.$store
        .dispatch('file/loadRecords', { query, type: this.type })
        .then(res => {
          callBack && callBack()
        })
    }
  },
  components: {
    // PublicResourceList: () => import('components/resource/PublicResourceList'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult'),
    TwAvatar: () => import('components/base/TwAvatar')
  }
}
</script>

<style scoped></style>
