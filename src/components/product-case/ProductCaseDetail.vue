<!--
@Name：成熟案例库详情
@Author：陆欢
@date：2021/10/29
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <!-- 头部区域 -->
    <tw-header-card
      :title="model.title?model.title:''"
      :actions="model.authorID===$myinfo.id||$myinfo.auth.role.isSystemAdministrator?['menu']:[]"
    >
      <!-- <template v-slot:add>
        <add-product-case-menu :id="id" />
      </template> -->
      <template
        v-slot:titleAppend
        v-if="!model.isPublish"
      >
        <q-badge
          align="top"
          color="orange"
          class="q-ml-xs q-pb-xs"
        >未发布</q-badge>
      </template>
      <template
        v-slot:menu
        v-if="model.authorID===$myinfo.id||$myinfo.auth.role.isSystemAdministrator"
      >
        <folder-menu
          :model="model"
          :excludeButton="['move', 'copy', 'archive','secrecy','bookmark']"
        />
      </template>
    </tw-header-card>
    <!-- 初始化未更新，正在加载中 -->
    <div
      class="row justify-center q-py-md"
      v-if="id === 0"
    >
      <q-spinner-dots
        color="primary"
        size="40px"
      />
    </div>
    <div :class="{ 'q-px-xl': !$q.platform.is.mobile }">
      <detail-content
        :id="id"
        v-if="id > 0"
      />
      <q-card-section>
        <discuss-board
          objectType="document"
          :objectID="+id"
          :objectTitle="model.title||''"
        />
      </q-card-section>

      <!-- 订阅 -->
      <q-card-section>
        <tw-subscribe
          objectType="document"
          :objectID="+id"
        />
      </q-card-section>
    </div>
  </q-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ProductCaseDetail',
  props: {
    id: {
      type: [Number, String],
      default: 0,
      required: false
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.loadDocument(+this.id)
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    model () {
      return this.$store.getters['document/currentModel'](+this.id)
    }
  },
  methods: {
    ...mapActions('document', ['loadDocument'])
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    FolderMenu: () => import('components/document/folder/FolderMenu'),
    DetailContent: () => import('components/product-case/DetailContent'),
    // AddProductCaseMenu: () => import('components/product-case/AddProductCaseMenu'),
    DiscussBoard: () => import('components/discuss/DiscussBoard'),
    TwSubscribe: () => import('components/base/TwSubscribe')
  }
}
</script>

<style lang="scss" scoped>
  .card-grow-in-page {
    max-width: 90vw;
  }
  @media (max-width: $breakpoint-xs-max) {
    .card-grow-in-page {
      min-width: 100%;
    }
  }
</style>
