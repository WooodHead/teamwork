<!-- 书签页 -->
<template>
  <q-page>
    <q-card class="card-grow-in-page">
      <tw-header
        :title="$t('bookmark.title')"
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
          {{$t('bookmark.title')}}</div>
        <q-separator />
      </q-card-section>
      <q-card-section class="q-px-xxl q-pt-none">
        <div
          class="q-px-md"
          v-if="Object.keys(bookmarks).length"
        >
          <!-- 书签列表 -->
          <div
            v-for="category in bookmarks"
            :key="category.id"
          >
            <div class="row items-center q-mt-md q-mb-xs bookmark_category">
              <router-link
                class="q-mr-sm text-grey-8 category-title"
                :to="categoryTo(category[0])"
              >{{category[0].module.title}}</router-link>
            </div>
            <q-item
              v-for="item in category"
              :key="item.id"
              :to="item.route.path"
              class="q-pa-sm"
            >
              <q-item-section
                class="col-auto row items-center q-mr-xs category-icon"
                :class="'bg-' + resourceIcon[item.objectType].color"
              >
                <q-icon
                  :name="resourceIcon[item.objectType].icon"
                  size="xs"
                  class="text-white"
                ></q-icon>
              </q-item-section>
              <q-item-section class="text-left text-grey-8 text-subtitle2">{{item.objectTitle}}</q-item-section>
              <q-item-section side>
                <q-btn
                  dense
                  v-close-popup
                  flat
                  round
                  icon="close"
                  @click.stop.prevent="removeBookmark(item)"
                />
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div
          v-else
          class="q-pa-md"
        >
          <div>{{$t('bookmark.noneRemind')}}</div>
          <q-img
            src="icons/bookmark-remind.gif"
            class="q-mt-md bookmark_remind_img"
          />
        </div>
      </q-card-section>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapGetters, mapActions } from 'vuex'
import { showSuccessMessage, showWarningMessage } from '@/utils/show-message'
import { showConfirm } from '@/utils/show-confirm'

export default {
  name: 'MyBookmark',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwHeader: () => import('components/base/TwHeader')
  },
  data () {
    return {
      person: LocalStorage.getItem('myself')
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarks']),
    ...mapState('resource', ['resourceIcon'])
  },
  methods: {
    ...mapActions('bookmark', ['loadBookmarks', 'deleteBookmark']),
    categoryTo (category) {
      if (category.module.id) {
        return '/' + category.module.type + '/' + category.module.id
      } else {
        if (category.module.type === 'project') {
          return '/project'
        } else if (category.module.type === 'product') {
          return '/product'
        } else if (category.module.type === 'productDev') {
          return '/productDev'
        } else if (category.module.type === 'team') {
          return '/team'
        } else if (category.module.type === 'organize') {
          return '/contacts'
        } else if (category.module.type === 'service') {
          return '/service'
        }
      }
    },
    removeBookmark (e) {
      showConfirm(this.$t('action.reallyRemove'), () => {
        let query = [
          { Key: 'Owner', Value: this.person.id, Oper: 'eq' },
          'and',
          { Key: 'ObjectID', Value: +e.objectID, Oper: 'eq' },
          'and',
          { Key: 'ObjectType', Value: e.objectType, Oper: 'eq' }
        ]
        this.deleteBookmark(query).then(res => {
          if (res) {
            this.isBookmark = false
            showSuccessMessage(this.$t(`bookmark.removeBookmarkSuccess`))
          } else {
            showWarningMessage(this.$t(`bookmark.delBookmarkFail`))
          }
        })
      })
    }
  },
  mounted () {
    let that = this
    let queryCondition = [
      { Key: 'Owner', Value: this.person.id, Oper: 'eq' }
    ]
    that.loadBookmarks({ query: queryCondition })
  }
}
</script>

<style lang='scss' scoped>
.boost-title {
  font-size: 2em;
}
.bookmark_category {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(40, 60, 70);
}
.bookmark_category::after {
  content: "";
  flex: 1;
  height: 0.0625rem;
  background-color: #e5e5e5;
}
.category-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}
.category-title {
  min-height: auto;
  text-decoration: none;
}
.bookmark_remind_img {
  border: 1px solid #e5e5e5;
}
</style>
