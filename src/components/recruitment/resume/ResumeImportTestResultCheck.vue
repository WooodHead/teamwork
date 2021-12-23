<template>
  <div ref="checkTable">
    <q-tabs
      v-if="Object.keys(modelList).length>1"
      v-model="resumeTab"
      dense
      class="bg-green-1"
      align="justify"
      narrow-indicator
    >
      <q-tab
        :ripple="false"
        v-for="(tab, index) in modelList"
        :key="index"
        :name="index"
        :label="index"
      />
    </q-tabs>
    <q-table
      flat
      :title="tableTitle"
      class="my-sticky-header-column-table text-center"
      bordered
      :columns="columns[resumeTab]"
      :data="tabelData"
      separator="cell"
      :pagination="initialPagination"
    >
      <template v-slot:top>
        <tw-search-panel
          :label="'搜索'"
          :search.sync="search"
          :showPanelBtn="false"
        />
      </template>
      <template v-slot:pagination="scope">
        <div class="check-tips">测评结果仅识别“待测评、测评中、通过、未通过”，其他结果不会上传</div>
        {{((scope.pagination.page-1)*scope.pagination.rowsPerPage)+1}}-{{scope.isLastPage?tabelData.length:scope.pagination.page*scope.pagination.rowsPerPage}}/{{tabelData.length}}
        <!-- 共{{checkList.length}}条 -->
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.firstPage"
          class="q-ml-md"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.lastPage"
        />
      </template>
    </q-table>
    <q-stepper-navigation align="center">
      <q-btn
        class="q-px-md"
        size="lg"
        @click="$emit('next',checkList)"
        style="background:#33ac37;color:white"
        :label="$t(`${moduleType}.stepLabel.nextStep`)"
      />
    </q-stepper-navigation>
    <q-stepper-navigation
      align="center"
      class="q-pt-none"
    >
      <q-btn
        flat
        color="primary"
        :label="$t(`${moduleType}.stepLabel.back`)"
        @click="$emit('back')"
      />
    </q-stepper-navigation>
  </div>

</template>

<script>
const appConfig = require('app/app.config.js')
export default {
  name: 'ResumeImportTestResultCheck',
  props: {
    modelList: {
      type: Object,
      required: false,
      default: () => { return {} }
    },
    tableFixedColumn: {
      type: Array,
      required: false,
      default: () => { return [] },
      description: '表格需要固定的列'
    },
    moduleType: {
      type: String,
      required: false,
      default: '',
      description: '类型'
    },
    tableTitle: {
      type: String,
      default: '',
      required: false,
      description: 'table的标题'
    }
  },
  data () {
    return {
      recordNumKey: appConfig[this.moduleType].templateRequiredColumn[1],
      requiredColumn: appConfig[this.moduleType].templateRequiredColumn,
      checkList: {},
      columns: {},
      initialPagination: {
        rowsPerPage: 10
      },
      resumeTab: '',
      search: '',
      persons: this.$store.state.person.selectPersons
    }
  },
  watch: {
    search () {
      if (!this.search) {
        this.search = ''
      }
    }
  },
  computed: {
    tabelData () {
      let columns = appConfig[this.moduleType].templateRequiredColumn
      return _.filter(this.checkList[this.resumeTab], item => {
        let flag = false
        for (let index in columns) {
          if (_.includes(_.isNumber(item[columns[+index]]) ? item[columns[+index]].toString() : item[columns[+index]], this.search)) {
            flag = true
          }
        }
        return flag
      })
    }
  },
  components: {
    TwSearchPanel: () => import('components/base/TwSearchPanel')
  },
  mounted () {
    // 滚动至表格
    this.$nextTick(() => {
      document.querySelector('.q-stepper__header').scrollIntoView({
        behavior: 'smooth'
      })
    })
    // 默认选中第一个sheet
    this.resumeTab = Object.keys(this.modelList)[0]
    // 获取所有的列
    for (let list in this.modelList) {
      let salarys = this.modelList[list]
      let checkSalarys = []
      if (salarys.length) {
        checkSalarys = _.cloneDeep(salarys)
        this.checkList[list] = checkSalarys
        this.getColumns(list, salarys)
      }
    }
  },
  methods: {
    getColumns (key, salarys) {
      this.columns[key] = []
      let keys = _.cloneDeep(_.keys(salarys[0]))
      _.remove(keys, k => {
        return ['psonID', 'name', 'relevanceWeChat'].includes(k)
      })
      _(keys).forEach(e => {
        // header
        let w = {}
        if (e !== 'id') {
          w = {
            name: e,
            label: e,
            align: 'center',
            field: row => row[e],
            headerStyle: 'width: 80px;color: rgba(80,80,80,.65);background: #fafafa;'
          }
        } else {
          return
        }
        const isSpecial = this.tableFixedColumn.includes(e)
        if (isSpecial) {
          w.style = 'background-color: #f5f5dc;'
        }
        if (!isSpecial) {
          w.headerStyle += 'font-weight: 900 !important;'
        }
        this.columns[key].push(w)
      })
      let fix = _.filter(this.columns[key], m => {
        return this.tableFixedColumn.includes(m.name)
      })
      _.pull(this.columns[key], ...fix)
      this.columns[key].unshift(...fix)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-sticky-header-column-table {
  /deep/ .q-table__bottom {
    position: relative;
    .check-tips {
      position: absolute;
      top: 50%;
      left: 15px;
      transform: translateY(-50%);
    }
  }
  /deep/ .q-table {
    tr th:first-child,
    tr td:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
      min-width: 120px;
    }
  }
}
/deep/ .q-tab--active {
  background: $green;
  color: white;
}
[role="tab"] {
  border-right: 2px solid $green;
  &:last-child {
    border-right: none;
  }
}
</style>
