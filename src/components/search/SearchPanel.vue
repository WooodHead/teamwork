<template>
  <q-card-section>
    <!-- 快捷搜索(当前页面内搜索和查看上一次搜索) -->
    <div
      class="q-pb-sm cursor-pointer text-primary"
      @click="searchCurrentPage"
    >
      <span class="q-mr-lg">{{ $t("search.searchCurrentPage") }}</span>
    </div>

    <!-- 顶部自定义搜索 -->
    <q-input
      v-model="search"
      :placeholder="$t('search.searchFor')"
      outlined
      dense
      debounce="1000"
    >
      <template v-slot:append>
        <q-btn
          round
          dense
          flat
          size="sm"
          icon="local_offer"
          @click.stop="dialog = true"
        >
          <q-tooltip>{{ $t("base.selectTags") }} </q-tooltip>
        </q-btn>
        <div
          v-if="search"
          class="cursor-pointer"
          @click="Reset"
        >
          <q-icon
            name="close"
            size="xs"
          ></q-icon>
        </div>
      </template>
    </q-input>

    <!-- 所有模块 -->
    <div
      class=" q-pt-sm q-gutter-sm"
      style="font-size:14px"
      :class="$q.screen.lt.sm ? '' : 'row'"
    >
      <q-select
        class="col-md-2"
        v-model="modules"
        option-value="value"
        option-label="label"
        option-disable=""
        :options="moduleOptions"
        outlined
        rounded
        options-dense
        dense
      >
        <template v-slot:option="scope">
          <q-separator v-if="scope.opt.value === 'all'" />
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- 搜索人 -->
      <tw-select-person
        class="col-md-2"
        v-model="person"
        @reset="ResetPerson"
        mode="download"
        outlined
        rounded
        dense
        :label="$t('base.selectPerson')"
      >
      </tw-select-person>
      <!-- 日期选择 -->
      <q-input
        v-model="searchDateTitle"
        outlined
        rounded
        dense
        class="col-md"
        :placeholder="$t('search.startEndDate')"
      >
        <template v-slot:append>
          <q-icon
            v-if="searchDate"
            size="xs"
            name="close"
            @click.stop="ResetSearchDate"
            class="cursor-pointer"
          ></q-icon>
          <q-icon
            flat
            name="event"
            class="cursor-pointer text-dark"
            title="选择日期"
          >
            <q-popup-proxy
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="searchDate"
                mask="YYYY-MM-DD"
                minimal
                range
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- 部门选择 -->
      <tw-select-organize
        v-if="selectOrganize"
        class="col"
        v-model="organize"
        @reset="ResetOrganize"
        outlined
        rounded
        dense
      />
      <!-- 资源选择 -->
      <tw-select-resource
        v-else
        class="col-md"
        v-model="object"
        @reset="ResetResource"
        outlined
        rounded
        dense
      />
    </div>
    <!-- 搜索结果 -->
    <div
      class="q-gutter-sm q-mt-md"
      :class="{ 'q-px-sm': $q.platform.is.mobile }"
    >
      <!-- 最近访问 -->
      <history-list
        ref="historyList"
        v-if="showRecentVisit"
        :showBorder="false"
        style="padding-top:0 !important;"
      />
      <search-result
        ref="searchResult"
        v-else
        :modules="modules"
        :object="object"
        :person="person"
        :search="search"
        :searchDate="searchDate"
        :organize="organize"
      />
    </div>

    <!-- 弹出标签选择 -->
    <q-dialog
      v-model="dialog"
      position="top"
    >
      <q-card
        style="width: 600px; max-width: 150vw; max-height:150vh"
        class="q-gutter-sm q-pa-md"
      >
        <span
          v-for="tag in tags"
          :key="tag.id"
          @click="selectCondition(tag.id)"
        >
          <q-chip
            class="cursor-pointer"
            rounded
            :color="tag.selected ? 'primary' : ''"
            :text-color="tag.selected ? 'white' : 'black'"
            :label="tag.title"
            no-caps
          />
        </span>
      </q-card>
    </q-dialog>
  </q-card-section>
</template>
<script>
import { LocalStorage } from 'quasar'
import { mapState, mapActions, mapMutations } from 'vuex'
import Vue from 'vue'
export default {
  name: 'SearchPa',
  data () {
    return {
      dialog: false,
      myinfo: LocalStorage.getItem('myself'),
      tags: []
    }
  },
  components: {
    'search-result': () => import('components/search/SearchResult'),
    'tw-select-person': () => import('components/base/TwSelectPerson'),
    'tw-select-resource': () => import('components/base/TwSelectResource'),
    'tw-select-organize': () => import('components/base/TwSelectOrganize'),
    HistoryList: () => import('components/home/HistoryList')
  },
  computed: {
    ...mapState('breadcrumbs', ['resource']),
    ...mapState('search', ['moduleOptions']),
    showRecentVisit () {
      return (
        !this.search &&
        this.modules.value === 'all' &&
        !this.person.id &&
        !this.organize.id &&
        this.object.value === 'all'
      )
    },
    searchDateTitle () {
      if (this.searchDate) {
        return this.searchDate.from + '~' + this.searchDate.to
      } else {
        return ''
      }
    },
    selectOrganize () {
      if ('project,team,productDev'.includes(this.modules.value)) {
        return true
      } else {
        return false
      }
    },
    organize: {
      get () {
        return this.$store.state.search.organize
      },
      set (value) {
        this.setOrganize(value)
      }
    },
    // 搜索内容
    search: {
      get () {
        return this.$store.state.search.search
      },
      set (value) {
        this.setSearch(value)
      }
    },
    // 搜索模块
    modules: {
      get () {
        return this.$store.state.search.modules
      },
      set (value) {
        this.setModules(value)
      }
    },
    // 搜索人员
    person: {
      get () {
        return (
          this.$store.state.search.person || {
            id: null,
            name: '',
            type: 'all'
          }
        )
      },
      set (value) {
        this.setPerson(value)
      }
    },
    // 搜索日期
    searchDate: {
      get () {
        return this.$store.state.search.searchDate
      },
      set (value) {
        if (value) {
          let date = {
            from: '',
            to: ''
          }
          if (!value.from) {
            date.from = value
            date.to = value
          } else {
            date = value
          }
          this.setSearchDate(date)
        }
      }
    },
    // 搜索资源
    object: {
      get () {
        return this.$store.state.search.object
      },
      set (value) {
        this.setObject(value)
      }
    }
  },
  watch: {
    search: {
      deep: true,
      handler (newVal, oldVal) {
        this.tags.forEach(item => {
          // 判断一个数组是否包含另一个数组
          if (
            _.union(newVal.split(','), item.title.split(',')).length ===
            newVal.split(',').length
          ) {
            item.selected = true
          } else {
            item.selected = false
          }
        })
      }
    }
    // $route: {
    //   immediate: true,
    //   deep: true,
    //   handler (newVal, oldVal) {
    //     debugger
    //     if ('projectDetail,productDevDetail,teamDetail'.includes(newVal.name)) {
    //       this.object = {
    //         label: this.resource.title,
    //         value: this.resource.id,
    //         type: this.resource.category
    //       }
    //       this.setModules(this.moduleOptions.find(a => a.type === 'all'))
    //     } else {
    //       let route = this.findModuleInRoute(newVal.path)
    //       this.setModules(this.moduleOptions.find(a => a.type === route))
    //       if (this.resource.id) {
    //         this.object = {
    //           label: this.resource.title,
    //           value: this.resource.id,
    //           type: this.resource.category
    //         }
    //       }
    //     }
    //   }
    // }
  },
  mounted () {
    this.loadTags().then(res => {
      if (res && res.length > 0) {
        // 对象数组去重
        this.tags = _.uniqBy(res, 'title')
        this.tags.forEach(item => {
          // 判断一个数组是否包含另一个数组
          if (
            _.union(this.search.split(','), item.title.split(',')).length ===
            this.search.split(',').length
          ) {
            item.selected = true
          } else {
            item.selected = false
          }
        })
      }
    })
  },
  methods: {
    ...mapActions('tag', ['loadTags']),
    ...mapMutations('search', [
      'setSearch',
      'setObject',
      'setPerson',
      'setModules',
      'setSearchDate',
      'setOrganize'
    ]),
    searchCurrentPage () {
      let newVal = this.$route
      if ('projectDetail,productDevDetail,teamDetail'.includes(newVal.name)) {
        this.object = {
          label: this.resource.title,
          value: this.resource.id,
          type: this.resource.category
        }
        this.setModules(this.moduleOptions.find(a => a.type === 'all'))
      } else {
        let route = this.findModuleInRoute(newVal.path)
        this.setModules(this.moduleOptions.find(a => a.type === route))
        if (this.resource.id) {
          this.object = {
            label: this.resource.title,
            value: this.resource.id,
            type: this.resource.category
          }
        }
      }
    },
    Reset () {
      let search = ''
      this.setSearch(search)
    },
    ResetPerson () {
      let person = {
        id: null,
        name: '',
        type: 'all'
      }
      this.setPerson(person)
    },
    ResetResource () {
      let object = {
        label: '',
        value: 'all',
        type: 'all'
      }
      this.setObject(object)
    },
    ResetSearchDate () {
      this.setSearchDate(null)
    },
    ResetOrganize () {
      let organize = {
        id: '',
        name: '',
        type: 'organize'
      }
      this.setOrganize(organize)
    },
    selectCondition (value) {
      let a = []
      if (this.search !== '') {
        a = this.search
          .replace(/^,+/, '')
          .replace(/,+$/, '')
          .split(',')
      }
      let index = this.tags.findIndex(item => item.id === value)
      this.tags[index].selected = !this.tags[index].selected
      if (this.tags[index].selected) {
        a.push(this.tags[index].title)
      } else {
        Vue.delete(
          a,
          a.findIndex(a => a === this.tags[index].title)
        )
      }
      this.setSearch(a.join(','))
    },
    findModuleInRoute (route) {
      let list = _.reverse(route.split('/'))
      let moduleItem = 'all'
      for (let i = 0; i < list.length; i++) {
        if (
          list[i] !== '' &&
          [
            'project',
            'productDev',
            'team',
            'task',
            'notice',
            'document',
            'schedule',
            'checkins'
          ].includes(list[i])
        ) {
          moduleItem = list[i]
          break
        }
      }
      return moduleItem
    }
  }
}
</script>
<style lang="scss" scoped>
.my-card {
  max-width: 860px;
  min-width: 50vw;
}
/deep/.q-btn__wrapper {
  padding: 5px 9px;
}
</style>
