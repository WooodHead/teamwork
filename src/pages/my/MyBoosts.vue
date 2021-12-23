<!-- 点赞页 -->
<template>
  <q-page>
    <tw-header
      :title="$t('home.widget.myBoosts')"
      noMenu
    ></tw-header>
    <q-card class="card-grow-in-page text-center q-px-xxl">
      <div class="q-py-xl q-px-sm">
        <!-- 顶部头像 -->
        <tw-avatar
          v-if="!$q.platform.is.mobile"
          :id="person.id"
          :name="person.name"
          :img="person.img"
          class="q-mb-sm"
        />
        <div v-if="Object.keys(groupedPlates).length">
          <div class="q-px-xs bg-white text-bold boost-title">{{$t('boost.title')}}</div>
          <!-- 点赞列表 -->
          <div
            v-for="modifyTime in Object.keys(groupedPlates)"
            :key="modifyTime"
          >
            <!-- 按'天'划分 -->
            <div class="boost-squiggle text-center">
              <span class="q-px-xs bg-white squiggle-text">{{$t('boost.time')}} {{modifyTime}}</span>
            </div>
            <div class="q-gutter-y-md">
              <tw-boost-plate
                v-for="boostPlate in groupedPlates[modifyTime]"
                :key="boostPlate.id"
                :objectID="boostPlate.objectID"
                :objectType="boostPlate.objectType"
                :model="boostPlate"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="bg-white text-bold boost-title">{{$t('boost.none')}}</div>
          <div class="boost-squiggle"></div>
          <div>{{$t('boost.noneRemind')}}</div>
        </div>
      </div>
    </q-card>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { date, LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PageBoosts',
  components: {
    TwAvatar: () => import('components/base/TwAvatar'),
    TwBoostPlate: () => import('components/boost/TwBoostPlate'),
    TwPageScroller: () => import('components/base/TwPageScroller'),
    TwHeader: () => import('components/base/TwHeader')
  },
  data () {
    return {
      person: LocalStorage.getItem('myself'),
      boostsPlates: []
    }
  },
  computed: {
    ...mapState('message', ['messageType']),
    groupedPlates () {
      let plates = _.groupBy(this.boostsPlates, function (item) {
        return date.formatDate(item.modifyTime.replace(/-/g, '/'), 'YYYY-MM-DD')
      })
      Object.keys(plates).forEach(index => {
        plates[index].sort((a, b) => {
          return Date.parse(b.modifyTime.replace(/-/g, '/')) - Date.parse(a.modifyTime.replace(/-/g, '/'))
        })
      })
      return plates
    }
  },
  methods: {
    ...mapActions('boost', ['loadBoostsPlates']),
    toPage (route) {
      this.$router.push({
        name: route.name,
        params: route.params
      })
    }
  },
  created () {
    this.loadBoostsPlates().then(plates => (this.boostsPlates = plates))
  }
}

</script>

<style lang='scss' scoped>
.boost-title {
  font-size: 2em;
}
.boost-squiggle {
  width: 100%;
  background: url("/icons/squiggle.png") repeat-x left center;
  background-size: 228px 9px;
  padding: 1rem;
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
