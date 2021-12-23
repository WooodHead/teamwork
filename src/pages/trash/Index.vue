<template>
  <q-page>
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <tw-header-card :title="$t('trash.title')"></tw-header-card>
      <div class="q-px-xxl q-py-md">
        <div class="q-py-lg full-width column items-center">
          <tw-group-header class="text-body1 q-mb-md full-width">
            <template v-slot:title>
              <div class="q-px-sm text-subtitle1">
                {{ $t('trash.trashByYou')}}
              </div>
            </template>
          </tw-group-header>
          <div
            v-if="deletedDataByMe && deletedDataByMe.length"
            class="flex flex-wrap flex-center full-width"
          >
            <div
              v-for="(item, index) in deletedDataByMe"
              :key="index"
              class="q-pa-sm trash-card"
            >
              <trash-card :model="item"></trash-card>
            </div>
          </div>
          <div
            v-else
            class="text-body1 text-grey-6"
          >{{$t('trash.none')}}</div>
        </div>
        <div class="q-py-lg full-width column items-center">
          <tw-group-header class="text-body1 q-mb-md full-width">
            <template v-slot:title>
              <div class="q-px-sm text-subtitle1">
                {{ category==='person'?$t('trash.myTrashByOther'):$t('trash.trashByOther')}}
              </div>
            </template>
          </tw-group-header>
          <div
            v-if="deletedDataByOther && deletedDataByOther.length"
            class="flex flex-wrap flex-center full-width"
          >
            <div
              v-for="(item, index) in deletedDataByOther"
              :key="index"
              class="q-pa-sm trash-card"
            >
              <trash-card :model="item"></trash-card>
            </div>
          </div>
          <div
            v-else
            class="text-body1 text-grey-6"
          >{{$t('trash.none')}}</div>
        </div>

        <div class="text-center text-grey-6">
          <q-separator class="q-my-md" />
          <div>
            {{$t('trash.showTips')}}
          </div>
        </div>
      </div>
    </q-card>
    <router-view></router-view>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapActions, mapMutations } from 'vuex'
const my = LocalStorage.getItem('myself') || {}
export default {
  name: 'PageTrash',
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: () => {
        return my.id
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    TwGroupHeader: () => import('components/base/TwGroupHeader'),
    TrashCard: () => import('components/trash/TrashCard')
  },
  data () {
    return {
      myself: LocalStorage.getItem('myself'),
      data: []
    }
  },
  computed: {
    deletedDataByMe () {
      let backData = _.orderBy(_.filter(this.data, item => {
        return item.deleteBy ? item.deleteBy === this.myself.name : false
      }), 'deleteTime', 'desc')
      backData = this.category === 'person' ? this.filterResourceData(backData) : backData
      return backData
    },
    deletedDataByOther () {
      let backData
      backData = _.orderBy(_.filter(this.data, item => {
        if (this.category === 'person') {
          return item.createBy === this.myself.name && item.deleteBy !== this.myself.name
        } else {
          return item.deleteBy !== this.myself.name
        }
      }), 'deleteTime', 'desc')
      backData = this.category === 'person' ? this.filterResourceData(backData) : backData
      return backData
    }
  },
  watch: {
  },
  methods: {
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', ['pushModuleBreadcrumb']),
    // 加载我删除的数据
    loadDeleteList () {
      let dataJson = {
        'task': ['Tasks'],
        'checkins': ['Answers', 'Questions'],
        'document': ['Documents'],
        'notice': ['Notices']
      }
      // 如果是我的工作台中的废纸篓，需要加载以下数据
      let myDataJson = {
        'team': ['Teams'],
        'organize': ['Organizes'],
        'project': ['Projects'],
        'order': ['Orders'],
        'opportunity': ['Opportunitys'],
        'customer': ['Customers'],
        'productDev': ['ProductDevs']
      }
      if ((this.category !== 'person' && +this.objectID !== +this.myself.id) || !this.category || !this.objectID) {
        let objectType = this.category
        let objectID = +this.objectID
        let query = { objectType, objectID }
        for (let key in dataJson) {
          for (let item of dataJson[key]) {
            this.$store.dispatch(`${key}/load${item}InTrash`, query).then(res => {
              if (res) {
                this.data = [...this.data, ...this.$store.getters[`${key}/${item}InTrash`](objectType, objectID)]
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      } else {
        dataJson = { ...myDataJson, ...dataJson }
        for (let key in dataJson) {
          for (let item of dataJson[key]) {
            this.$store.dispatch(`${key}/load${item}InMyTrash`)
              .then(res => {
                if (res) {
                  this.data = [...this.data, ...this.$store.getters[`${key}/${item}InMyTrash`]]
                }
              }).catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    filterResourceData (data) {
      let resourceData = _.filter(data, item => {
        return Object.keys(item).includes('resourceType')
      })
      let backData = _.filter(data, item => {
        if (Object.keys(item).includes('resourceType')) {
          return true
        } else {
          let objectID = item.objectId || item.objectID
          let objectType = item.objectType
          let filterData = _.filter(resourceData, data => {
            return data.resourceType === objectType && data.id === objectID
          })
          if (filterData.length > 0) {
            return false
          } else {
            return true
          }
        }
      })
      return backData
    }
  },
  mounted () {
    this.loadDeleteList()
    this.setModuleBreadcrumbs()
    if (this.category === 'person') {
      this.pushModuleBreadcrumb({
        id: `${this.category}${this.objectID}`,
        title: `${this.myself.name}`,
        to: { name: `${this.category}Detail`, params: { id: this.objectID } },
        category: this.category,
        level: 'detail',
        type: 'module'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.trash-card {
  width: 24%;
  max-width: 220px;
  overflow: hidden;
}
@media screen and (max-width: 1024px) {
  .trash-card {
    width: 45%;
  }
}
</style>
