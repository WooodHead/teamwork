<template>
  <div>
    <q-infinite-scroll
      @load="loadData"
      :offset="250"
      ref="infiniteScroll"
    >
      <tw-search-panel
        label='Bom信息/物料信息...'
        :search.sync="search"
        :showPanelBtn="false"
        class="q-pb-md"
      />
      <mat-main-list
        v-if="selectType === 'showlist'"
        :matList="matList"
      />
      <div
        v-else-if="selectType === 'showcards'"
        class="row q-gutter-y-md"
      >
        <mat-main-card
          v-for="model in matList"
          :key="model.id"
          :model="model"
        />
      </div>
      <mat-main-table
        v-else
        :matList="matList"
      />
      <!-- 加载中提示 -->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <div
      v-if="matList.length<=0 && loaded"
      class="row justify-center q-pt-md"
    >
      <tw-banner-no-result style="width: 250px" />
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'MatMainGrid',
  props: {
    selectType: {
      type: String,
      default: 'showcards',
      required: false
    }
  },
  data () {
    return {
      loaded: false, // 是否加载完成
      search: '',
      matList: []
    }
  },
  computed: {
    ...mapState('material', ['MatMainList', 'bomNameType', 'matType', 'listType'])
  },
  methods: {
    ...mapActions('material', ['loadMatMainData', 'loadSearchBomData']),
    ...mapMutations('material', ['resetPageList']),
    // 加载列表数据
    loadData (index, done) {
      let count = this.$store.state.material.mainPage.nextPageToken
      if (count === -1) {
        done(true)
        this.loaded = true
        return
      }
      let psonID = LocalStorage.getItem('myself').id
      let orgPath = LocalStorage.getItem('myself').organizeNum + '%'
      let condition = [{ Key: 'IsDelete', Value: 0, Oper: 'eq' }]
      condition.push('and', { Key: 'OrganizePath', Value: orgPath, Oper: 'like' })
      if (this.listType === 'my') {
        condition.push('and', { Key: 'CreateByID', Value: psonID, Oper: 'eq' })
      }
      this.loadMatMainData({
        loderType: 'data',
        fields: 'Select',
        query: condition,
        limit: this.$store.state.material.mainPage.limit,
        offset: this.$store.state.material.mainPage.offset,
        byPage: true
      }).then(res => {
        this.loaded = true
        if (count === -1) {
          done(true)
        } else {
          done()
        }
      })
    },
    searchUpdate (val) {
      this.loaded = false
      if (val) {
        this.matList = _.filter(this.MatMainList, el => (el.BomTypeName.includes(val) || el.MatTypeName.includes(val) || el.Code.includes(val) || el.DeployCode.includes(val) || el.Code.includes(val) || el.FileName.includes(val) || el.AutoFileName.includes(val) || el.PrepareBy.includes(val) || el.FileName.includes(val) || el.CheckBy.includes(val) || el.BuditBy.includes(val) || el.CreateBy.includes(val)))
        // 根据输入的物料信息，找出对应的Bom
        this.loadSearchBomData(val).then(res => {
          res.forEach(item => {
            item.BomTypeName = this.bomNameType[item.BomType]
            item.MatTypeName = this.matType[item.MaterialType]
          })
          this.matList.push(..._.difference(res, this.matList))
          this.loaded = true
        })
      } else {
        this.matList = this.MatMainList
        this.loaded = true
      }
    }
  },
  mounted () {
  },
  watch: {
    search: {
      immediate: true,
      handler (newVal, oldVal) {
        this.searchUpdate(newVal)
      }
    },
    listType: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (this.$refs.infiniteScroll) {
          //  重置列表属性
          this.resetPageList('data')
          this.$refs.infiniteScroll.reset() // 设置滚动索引为0
          this.$refs.infiniteScroll.resume() // 重新开启加载
          this.$refs.infiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
          this.searchUpdate('')
        }
      }
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel'),
    MatMainList: () => import('components/material/MatMainList'),
    MatMainCard: () => import('components/material/MatMainCard'),
    MatMainTable: () => import('components/material/MatMainTable'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}
</script>

<style scoped>
.my-resource-list-item {
  min-width: 9vw;
  max-width: 9vw;
}
</style>
