<template>
  <q-card :flat="flat">
    <q-card-section>
      <tw-search-sort :search.sync="search" />
    </q-card-section>
    <q-card-section
      v-if="selectedResourcesList.length"
      :class="{'q-pt-none':multiple}"
    >
      <div class="row q-px-md">
        <q-space />
        <q-checkbox
          v-if="multiple"
          left-label
          v-model="selectAll"
          :label="$t('label.selectAll')"
          keep-color
          color="primary"
        />
      </div>
      <q-list v-if="isVirtualScroll">
        <q-virtual-scroll
          :items="selectedResourcesList"
          :style="$q.screen.gt.sm?'height: 60vh;':'height: 57vh;'"
        >
          <template v-slot="{ item }">
            <resource-item
              :key="item.id"
              :resource="item"
              :category="category"
              @click="$emit('select', item)"
            >
              <q-item-section
                side
                :style="$q.screen.gt.sm?'':'padding-left:0'"
              >
                <q-checkbox
                  v-if="multiple"
                  v-model="selectedResources"
                  :val="item"
                  keep-color
                  color="primary"
                  :disable="isDisableResource(item.id, disableResourceIDs)"
                />
              </q-item-section>
            </resource-item>
          </template>
        </q-virtual-scroll>
      </q-list>

      <q-list v-else>
        <resource-item
          v-for="item in showedResources"
          :key="item.id"
          :resource="item"
          :category="category"
          @click="$emit('select', item)"
        >
          <q-checkbox
            v-if="multiple"
            v-model="selectedResources"
            :val="item"
            keep-color
            color="primary"
            :disable="isDisableResource(item.id, disableResourceIDs)"
          />
        </resource-item>
        <div
          class="row justify-center"
          v-if="moreResources > 0"
        >
          <q-btn
            flat
            :label="$t('app.loadMore')"
            color="primary"
            @click="showedResourceNum += 15"
          />
        </div>
      </q-list>
    </q-card-section>

    <q-card-section v-if="selectedResourcesList.length === 0">
      <tw-banner-no-result class="full-width" />
    </q-card-section>
    <q-card-actions
      align="right"
      v-if="multiple && selectedResourcesList.length"
    >
      <q-btn
        dense
        outline
        :label="$q.lang.label.cancel"
        color="primary"
        v-close-popup
      />
      <q-btn
        dense
        :label="$q.lang.label.ok"
        color="primary"
        @click="$emit('multiSelect', selectedResources)"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { format, LocalStorage } from 'quasar'
const { capitalize } = format
export default {
  name: 'ResourceSelectPanel',
  props: {
    category: {
      type: String,
      required: false,
      default: () => 'person'
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    initSelectedResourceIDs: {
      type: Array,
      required: false,
      default: null,
      description: '初始选中的资源列表Ids'
    },
    disableResourceIDs: {
      type: Array,
      required: false,
      default: function () {
        return []
      },
      description: '禁止修改的关联Ids(比如继承关系的项目关联项目)'
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    isVirtualScroll: {
      type: Boolean,
      required: false,
      default: true,
      description: '是否虚拟滚动'
    },
    objectID: {
      type: [String, Number],
      required: false
    },
    normalCategory: {
      type: String,
      required: false
    }
  },
  components: {
    TwSearchSort: () => import('components/base/TwSearchSort'),
    ResourceItem: () => import('components/resource/ResourceItem'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  },
  data () {
    return {
      objCategory: { custom: false, name: 'person' },
      selectAll: false,
      selectedResources: [],
      resources: [],
      showedResourceNum: 15,
      myInfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    // 将已选中的排序在前
    selectedResourcesList () {
      let that = this
      if (that.initSelectedResourceIDs) {
        // 未选中列表
        let noSelected = _.differenceBy(
          that.resources,
          that.selectedResources,
          'id'
        )
        noSelected = that.resourcesFiltered(noSelected)
        // 已选中列表
        let selected = that.resourcesFiltered(that.selectedResources)
        return _.concat(selected, noSelected)
      } else {
        return that.resourcesFiltered(that.resources)
      }
    },
    search: {
      get () {
        if (this.objCategory.custom) {
          return this.$store.state.resource.search
        } else {
          return (
            this.$store.state[this.category] &&
            this.$store.state[this.category].search
          )
        }
      },
      set (value) {
        if (this.objCategory.custom) {
          this.$store.commit('resource/setSearch', value)
        } else {
          this.$store.commit(`${this.category}/setSearch`, value)
        }
        // 如果有初始值，说明已全部加载，搜索时不需要调用后台
        !this.initSelectedResourceIDs &&
          this.loadResource(this.objCategory.custom, false)
      }
    },
    showedResources () {
      return _.slice(this.selectedResourcesList, 0, this.showedResourceNum)
    },
    moreResources () {
      return this.selectedResourcesList.length - this.showedResourceNum
    }
  },
  watch: {
    //   全选或取消全选
    selectAll: function (val) {
      if (val) {
        this.selectedResources = this.resources
      } else {
        this.selectedResources = []
      }
    },
    category: function (val) {
      this.loadCategory(val).then(c => {
        this.objCategory = c
        this.loadResource(c.custom)
      })
    }
  },
  mounted () {
    // 首次进入需要清空search，否则search不为空且全部加载的情况下，清空search，不再与后台进行交互
    this.initSelectedResourceIDs &&
      this.$store.commit(`${this.category}/setSearch`, '')
    this.loadCategory(this.category).then(c => {
      this.objCategory = c
      this.loadResource(c.custom)
    })
  },
  methods: {
    ...mapActions('resource', ['loadCategory', 'loadCustomCategoryOfItems']),
    loadResource (custom) {
      if (custom) {
        this.loadCustomCategoryOfItems({
          query: [{ 'Key': 'Category', 'Value': this.category, 'Oper': 'eq' }],
          byPage: false,
          category: this.category
        }).then(res => {
          this.resources.splice(0)
          this.resources.push(...res)
          this.initSelectedResources(this.initSelectedResourceIDs)
        })
      } else {
        this.$store.dispatch(
          `${this.category}/loadSelect${capitalize(this.category)}s`
        ).then(res => {
          // 同一类型关联同一类型，不需要显示自己。比如项目关联项目，不能关联自身
          if (
            this.normalCategory &&
            this.normalCategory === this.category
          ) {
            res = _.filter(res, n => {
              return n.id && n.id !== +this.objectID
            })
          } else if (this.category === 'organize') {
            res = this.$store.getters['organize/selectOrganizesRelation'](
              this.myInfo.organizeId
            )
          } else if (this.category === 'person') {
            res = this.$store.getters['person/selectPersonsOfOrganize'](
              this.myInfo.organizeId
            )
          }
          this.resources.splice(0)
          this.resources.push(...res)
          this.initSelectedResources(this.initSelectedResourceIDs)
        })
      }
    },
    // 初始化选中的资源
    initSelectedResources (initSelectedResourceIDs) {
      this.selectedResources = _.filter(this.resources, (resource) => {
        return _.indexOf(initSelectedResourceIDs, resource.id) >= 0
      })
      // 全选状态
      if (
        this.selectedResources.length === this.resources.length &&
        this.resources.length !== 0
      ) {
        this.selectAll = true
      }
    },
    // 搜索
    resourcesFiltered (value) {
      let that = this
      if (that.search) {
        let tempValue = _.filter(
          _.values(value),
          val =>
            (val.title &&
              val.title.toLowerCase().includes(that.search.toLowerCase())) ||
            (val.notes &&
              val.notes.toLowerCase().includes(that.search.toLowerCase())) ||
            (val.name &&
              val.name.toLowerCase().includes(that.search.toLowerCase())) ||
            (val.pinyin &&
              val.pinyin.toLowerCase().includes(that.search.toLowerCase()))
        )
        if (that.category === 'person') {
          tempValue = _.orderBy(
            tempValue,
            ['isInService', 'activated', 'status'],
            ['desc', 'desc', 'desc']
          )
        }
        return tempValue
      } else {
        if (that.category === 'person') {
          value = _.orderBy(
            value,
            ['isInService', 'activated', 'status'],
            ['desc', 'desc', 'desc']
          )
        }
        return value
      }
    },
    // 该行资源是否可以被选择
    isDisableResource (id, disableResourceIDs) {
      return _.indexOf(disableResourceIDs, id) >= 0
    }
  }
}
</script>

<style></style>
