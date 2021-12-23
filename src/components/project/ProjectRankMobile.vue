<template>
  <q-card
    class="card-grow-in-page"
    :flat="$q.screen.lt.sm"
  >
    <!-- 标题 -->
    <tw-header :title="$t('project.projectRank')">
    </tw-header>
    <q-card-section class="q-pa-none">
      <div class="border">
        <div
          class="text-white q-pb-xs"
          style="background: url(/icons/project/rankMobile.png);background-size:100% 100%;margin:0 -1px"
        >
          <div class="flex self-center ">
            <q-btn-dropdown
              flat
              class="text-h5"
              :label="selectYear+title"
            >
              <q-list>
                <q-item
                  v-for="year in yearOptions"
                  :key="year.value"
                  clickable
                  v-close-popup
                  @click="yearSelect(year.value)"
                >
                  <q-item-section>
                    <q-item-label>{{year.label}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <div
              v-for="item in titleTips"
              :key="item.key"
              class="text-caption q-pl-md"
            >{{titleTip(item)}}</div>
          </div>
          <q-tabs
            v-model="tabSelected"
            no-caps
            ref="tab"
            dense
            class="text-white q-pt-md"
            align="justify"
            narrow-indicator
          >
            <q-tab
              name="projectSumRank"
              :label="$t('project.projectSumRank')"
            />
            <q-tab
              name="personProportion"
              :label="$t('project.personProportion')"
            />
          </q-tabs>
        </div>
        <q-tab-panels
          animated
          keep-alive
          v-model="tabSelected"
          class="no-border-radius"
        >
          <q-tab-panel
            name="projectSumRank"
            class="q-pa-none"
          >
            <div
              class="no-border"
              v-for="item in tableData"
              :key="item.key"
            >
              <q-table
                class="no-shadow"
                hide-bottom
                :data="item.data"
                :columns="columns"
                :row-key="rowKey"
                binary-state-sort
                wrap-cells
                :rows-per-page-options="[0]"
                :sort-method="customSort"
                ref="qTable"
              >
                <template
                  v-slot:header="props"
                  style="background-color:grey"
                >
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      :class="(col.name==='delayCount' || col.name==='suspendedCount') ? 'sorted' :'sorted sort-desc'"
                      style="color: #858585;font-size:1em;"
                      :style="col.name==='Count' ? 'font-weight:700;color:#1976D2;' :''"
                      @click="colNameclick($event,col.label)"
                      ref="thread"
                    >
                      {{ col.name==='OrgShortName' ?  item.title : col.label}}
                    </q-th>
                  </q-tr>
                </template>
                <!-- 主体插槽 -->
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      key="OrgShortName"
                      :props="props"
                    >
                      <span
                        v-if="(props.rowIndex + 1) <=3"
                        class="text-center"
                      >
                        <q-img
                          v-if="(props.rowIndex + 1) <=3"
                          :src="topThreeBg(props.rowIndex+1)"
                          style="width:1rem;height:1rem;"
                        />
                      </span>
                      <span
                        v-else
                        class="q-mr-sm"
                        style="font-size: 15px;"
                      > {{ props.rowIndex + 1}}</span>
                      {{props.row.OrgShortName}}
                    </q-td>
                    <q-td
                      key="doingCount"
                      :props="props"
                    >
                      {{ props.row.doingCount }}
                    </q-td>
                    <q-td
                      key="delayCount"
                      :props="props"
                    >
                      {{ props.row.delayCount }}
                    </q-td>
                    <q-td
                      key="suspendedCount"
                      :props="props"
                    >
                      {{ props.row.suspendedCount }}
                    </q-td>
                    <q-td
                      key="doneCount"
                      :props="props"
                    >
                      {{ props.row.doneCount }}
                    </q-td>
                    <q-td
                      key="Count"
                      :props="props"
                    >
                      {{ props.row.Count }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
          <q-tab-panel
            name="personProportion"
            class="q-pa-none"
          >
            <div
              class="no-border"
              v-for="item in proportionTableData"
              :key="item.key"
            >
              <q-table
                class="no-shadow"
                hide-bottom
                :data="item.data"
                :columns="colProportion"
                :row-key="rowKey"
                binary-state-sort
                wrap-cells
                :rows-per-page-options="[0]"
                :sort-method="customSort"
                ref="qTable"
              >
                <template
                  v-slot:header="props"
                  style="background-color:grey"
                >
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      style="color: #858585;font-size:1em;"
                      :style="col.name==='Proportion' ? 'font-weight:700;color:#1976D2;' :''"
                      @click="colNameclick($event,col.label)"
                      class="sorted sort-desc"
                      ref="thread"
                    >
                      {{ col.name==='OrgShortName' ?  item.title : col.label}}
                    </q-th>
                  </q-tr>
                </template>
                <!-- 主体插槽 -->
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      key="OrgShortName"
                      :props="props"
                    >
                      <span
                        v-if="(props.rowIndex + 1) <=3"
                        class="text-center"
                      >
                        <q-img
                          v-if="(props.rowIndex + 1) <=3"
                          :src="topThreeBg(props.rowIndex+1)"
                          style="width:1rem;height:1rem;"
                        />
                      </span>
                      <span
                        v-else
                        class="q-mr-sm"
                        style="font-size: 15px;"
                      > {{ props.rowIndex + 1}}</span>
                      {{props.row.OrgShortName}}
                    </q-td>
                    <q-td
                      key="InProjectCount"
                      :props="props"
                    >
                      {{ props.row.InProjectCount }}
                    </q-td>
                    <q-td
                      key="PsonCount"
                      :props="props"
                    >
                      {{ props.row.PsonCount }}
                    </q-td>
                    <q-td
                      key="Proportion"
                      :props="props"
                    >
                      {{ props.row.Proportion }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import projectRank from './mixins-project-rank'
export default {
  name: 'ProjectRankMobile',
  mixins: [projectRank],
  components: {
    TwHeader: () => import('components/base/TwHeader')
  },
  data () {
    return {
      columns: [
        { name: 'OrgShortName', label: '机构', field: 'OrgShortName', align: 'left', style: 'width:20%', sortable: false },
        { name: 'doingCount', label: '进行中(含延期)', field: 'doingCount', align: 'left', style: 'width:20%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'delayCount', label: '延期', field: 'delayCount', align: 'left', style: 'width:15%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'suspendedCount', label: '挂起', field: 'suspendedCount', align: 'left', style: 'width:15%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'doneCount', label: '结项', field: 'doneCount', align: 'left', style: 'width:15%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'Count', label: '总计', field: 'Count', align: 'left', style: 'width:15%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      colProportion: [
        { name: 'OrgShortName', label: '机构', field: 'OrgShortName', align: 'left', style: 'width:20%', sortable: false },
        { name: 'InProjectCount', label: '在项目人数', field: 'InProjectCount', align: 'left', style: 'width:20%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'PsonCount', label: '总人数', field: 'PsonCount', align: 'left', style: 'width:20%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'Proportion', label: '人员占比(%)', field: 'Proportion', align: 'left', style: 'width:20%', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      tabSelected: 'projectSumRank'
    }
  },
  computed: {
    proportionTableData () {
      let res = []
      let data = _.cloneDeep(this.tableData)
      _.forEach(data, r => {
        let aa = _.orderBy(r.data, 'Proportion', 'desc')
        res.push({
          data: aa,
          key: r.key,
          mainOrg: r.mainOrg,
          title: r.title
        })
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-table__top {
  padding: 0;
  display: inline-block;
}
/deep/thead tr {
  background-color: #f5f8fc;
}
/deep/thead tr th {
  position: sticky;
  z-index: 1;
}
/deep/thead tr:last-child th {
  top: 48px;
}
/deep/thead tr:first-child th {
  top: 0;
}
/deep/.q-table tbody td {
  font-size: 13px;
  font-weight: 400;
}
.border {
  border: 1px solid;
  border-color: $grey-3;
}
</style>
