<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page"
  >
    <tw-header-card title="公告草稿箱">
    </tw-header-card>
    <q-card-section class="q-px-xxl full-width column items-center">
      <!-- 草稿提示 -->
      <q-banner
        rounded
        dense
      >
        <template v-slot:avatar>
          <q-icon
            name="info"
            color="info"
          />
        </template>
        {{$t('notice.noticeDraftsInfo')}}
      </q-banner>

      <!-- 公告列表 -->
      <notice-list
        v-if="notices.length"
        :notices="notices"
      ></notice-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
export default {
  name: 'NoticeDrafts',
  props: {
    category: {
      type: String,
      default: undefined,
      required: false
    },
    objectID: {
      type: [String, Number],
      default: 0,
      required: false
    }
  },
  computed: {
    notices () {
      return this.$store.getters['notice/noticeDrafts']({ objectType: this.category, objectID: this.objectID })
    },
    queryCondition () {
      // 筛选条件
      let queryCondition = [
        { Key: 'ObjectType', Value: this.category, Oper: 'eq' },
        'and',
        { Key: 'ObjectID', Value: this.objectID, Oper: 'eq' },
        'and',
        { Key: 'IsPublish', Value: 0, Oper: 'eq' }
      ]
      if (LocalStorage.getItem('myself')) {
        queryCondition.push('and')
        queryCondition.push({ Key: 'CreateByID', Value: LocalStorage.getItem('myself').id, Oper: 'eq' })
      }
      return queryCondition
    }
  },
  mounted () {
    this.loadNotices({ query: this.queryCondition })
  },
  methods: {
    ...mapActions('notice', ['loadNotices'])
  },
  components: {
    NoticeList: () => import('components/notice/NoticeList'),
    TwHeaderCard: () => import('components/base/TwHeaderCard')
  }
}
</script>

<style lang="scss" scoped>
</style>
