<!-- 草稿页 -->
<template>
  <q-page>

    <q-card class="card-grow-in-page">
      <tw-header
        :title="$t('draft.title')"
        noMenu
      ></tw-header>
      <!-- 头部logo -->
      <q-card-section
        v-if="!$q.platform.is.mobile"
        class="text-center q-px-none"
      >
        <!-- 顶部头像 -->
        <tw-avatar
          :id="person.id"
          :name="person.name"
          :img="person.img"
        />
        <div class=" text-h5 q-py-sm">
          {{$t('draft.title')}}</div>
        <q-separator />
      </q-card-section>
      <q-card-section class="q-px-xxl q-pt-none">
        <div v-if="draftList.length">
          <!-- 草稿列表提示 -->
          <q-banner
            v-if="draftList.length"
            rounded
            dense
            class="bg-grey-3 text-body1 text-left full-width q-mb-sm"
          >
            <template v-slot:avatar>
              <q-icon
                name="info"
                color="info"
              />
            </template>
            {{$t('notice.noticeDraftsInfo')}}
          </q-banner>
          <draft-item
            v-for="draft in draftList"
            :key="draft.id"
            :draft="draft"
            class="text-left"
          />
        </div>
        <div v-else>
          <div>{{$t('draft.noneRemind')}}</div>
        </div>
      </q-card-section>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MyDrafts',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    DraftItem: () => import('components/draft/DraftItem'),
    TwHeader: () => import('components/base/TwHeader')
  },
  data () {
    return {
      person: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapState('document', ['documentList']),
    ...mapState('notice', ['notices']),
    draftList () {
      let docList = _.filter(this.documentList, { 'isPublish': 0, 'deleted': false, 'archived': false, 'authorID': this.person.id })
      let noticeList = _.filter(this.notices, { 'isPublish': 0, 'deleted': false, 'archived': false, 'createByID': this.person.id })
      let list = _.concat(docList, noticeList)
      return _.orderBy(list, ['modifyTime'], ['desc'])
    }
  },
  methods: {
    ...mapActions('document', ['loadMyDraftList']),
    ...mapActions('notice', ['loadNotices']),
    loadDraftNotices () {
      let queryCondition = [
        { Key: 'IsPublish', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'CreateByID', Value: this.person.id, Oper: 'eq' }
      ]
      this.loadNotices({
        query: queryCondition,
        byPage: false
      })
    },
    loadDraftDocuments () {
      let queryCondition = [
        { Key: 'IsPublish', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'Archived', Value: 0, Oper: 'eq' },
        'and',
        { Key: 'AuthorID', Value: this.person.id, Oper: 'eq' }
      ]
      this.loadMyDraftList({
        query: queryCondition
      })
    }
  },
  mounted () {
    this.loadDraftNotices()
    this.loadDraftDocuments()
  }
}

</script>

<style lang='scss' scoped>
.boost-title {
  font-size: 2em;
}
.squiggle-text {
  font-size: 1rem;
  background: #fff;
  color: #ffa235;
  padding: 0 0.5rem;
}
.boost-content {
  border: 1px solid #e5e5e5;
  border-radius: 1rem;
  width: 14.3rem;
  min-width: 14.3rem;
  position: relative;
  padding: 2.5rem 1.3rem 1.3rem 2.5rem;
}
.boost-container {
  margin: 2.3rem 0 0 1.3rem !important;
  background: #faf8f7;
  padding: 0.5rem;
  border-radius: 2.5rem;
  border-top-left-radius: 0;
}
</style>
