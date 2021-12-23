<template>
  <!-- 选项卡 -->
  <div class="q-px-xl">
    <q-card>
      <q-tabs
        dense
        v-model="firstTab"
        align="justify"
        class="bg-grey-3"
        active-color="primary"
        narrow-indicator
      >
        <q-tab
          v-for="tab in tabsList"
          :label="tab.FileName"
          :name="tab.ID.toString()"
          :key="tab.ID"
        >
        </q-tab>
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="firstTab"
        animated
      >
        <q-tab-panel
          class="q-pa-none"
          name="dif"
        >
          <q-table
            dense
            class="my-sticky-virtscroll-table"
            row-key="index"
            virtual-scroll
            :columns="difDataColumns"
            :data="dataList('dif')"
            :pagination.sync="pageScroll[0]"
            :rows-per-page-options="[0]"
            :filter="searchList[searchList.length-1]"
            style="height: 395px; max-height:400px;"
          >
            <template v-slot:top-right>
              <tw-search-sort
                style="width: 300px; max-width:400px;"
                :search.sync="searchList[searchList.length-1]"
              />
            </template>
            <template v-slot:body-cell="props">
              <q-td
                v-if="props.col.name === 'CheckResult'"
                :props="props"
              >
                <q-badge
                  :color="resultCheck[props.value]"
                  :label="props.value"
                />
              </q-td>
              <q-td
                v-else-if="isAmountCol(props.col.name)"
                :props="props"
              >
                <q-badge
                  v-if="props.row['公共数量']<props.value"
                  color="blue"
                  :label="props.value"
                />
                <div v-else>
                  {{props.value}}
                </div>
              </q-td>
              <q-td
                v-else
                :props="props"
              >
                {{props.value}}
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
        <q-tab-panel
          class="q-pa-none"
          v-for="(item,index) in keysList"
          :name="item"
          :key="index"
        >
          <q-table
            dense
            class="my-sticky-virtscroll-table"
            row-key="index"
            virtual-scroll
            :filter="searchList[index]"
            :columns="dataTable.excelcolumns"
            :data="dataList(item)"
            :pagination.sync="pagination"
            :rows-per-page-options="[0]"
            style="height: 395px; max-height:400px;"
          >
            <template v-slot:top-right>
              <tw-search-sort
                style="width: 300px; max-width:400px;"
                :search.sync="searchList[index]"
              />
            </template>
            <template v-slot:body-cell-CheckResult="props">
              <q-td :props="props">
                <div>
                  <q-badge
                    :color="resultCheck[props.value]"
                    :label="props.value"
                  />
                </div>
                <div class="my-table-details">
                  {{ props.row.details }}
                </div>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PkResult',
  props: {
    resultData: {
      type: Object,
      required: true,
      description: '对比结果'
    },
    pkList: {
      type: Array,
      default: function () {
        return []
      },
      description: '进行对比的明细表'
    }
  },
  data () {
    return {
      searchList: [],
      firstTab: 'same',
      pageScroll: [],
      pagination: {
        rowsPerPage: 50,
        page: 1
      },
      resultCheck: { '一致': 'green', '不存咋': 'red', '版本较高': 'primary', '版本较低': 'cyan' }

    }
  },
  mounted () {

  },
  computed: {
    ...mapState('material', ['dataTable', 'tabNames']),
    tabsList () {
      let bomList = _.cloneDeep(this.pkList)
      bomList.forEach(item => {
        item.FileName = item.FileName + '(单独项)'
      })
      let tabs = this.tabNames.concat(bomList)
      return tabs
    },
    keysList () {
      return _.keys(this.resultData).map((item) => {
        if (item !== 'dif') {
          return item
        }
      })
    },
    // 拼接不同项数据列标题
    difDataColumns () {
      let difColumns = []
      difColumns = _.cloneDeep(this.dataTable.excelcolumns)
      difColumns.pop()
      // difColumns.pop()
      difColumns.push({ name: 'MinAmount', align: 'left', label: '公共数量', field: '公共数量', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' })
      this.pkList.forEach(item => {
        difColumns.push({ name: item.ID.toString(), align: 'left', label: item.FileName + '(数量)', field: item.FileName + '(数量)', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' })
      })
      // difColumns.push({ name: 'Notes', align: 'left', label: '备注', field: '备注', sortable: true, headerClasses: 'text-primary', headerStyle: 'font-size: 1em;font-weight:bold;' })
      return difColumns
    }
  },
  methods: {
    dataList (key) {
      return this.resultData[key]
    },
    isAmountCol (val) {
      let res = false
      this.pkList.some(item => {
        if (item.ID.toString() === val.toString()) {
          res = true
          return res
        }
      })
      return res
    }
  },
  watch: {
    firstTab (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.pagination.page = 1
      }
    },
    tabsList: {
      immediate: true,
      handler (newVal, oldVal) {
        this.searchList = []
        newVal.forEach(item => {
          this.searchList.push('')
        })
      }
    }
  },
  components: {
    TwSearchSort: () => import('components/base/TwSearchSort')
  }
}
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
