<template>
  <q-card
    class="card-grow-in-page q-pb-md"
    :flat="$q.screen.lt.sm"
    :class="$q.screen.gt.xs?'q-px-xl':'q-px-md'"
  >
    <q-card-section class="q-pt-lg q-pb-none q-px-none">
      <div
        class="text-white q-pt-lg q-pl-md q-pb-sm"
        style="background: url(/icons/project/rankPc.png);background-size:100% 100%;height:137px;"
      >

        <div class="flex self-center">
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
                {{year.label}}
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div
          v-for="item in titleTips"
          :key="item.key"
          class="text-grey-4"
          style="font-size: 12px;"
        >{{titleTip(item)}}
        </div>
      </div>
    </q-card-section>
    <q-card-section
      class="q-py-none q-px-none"
      v-for="item in tableData"
      :key="item.key"
    >
      <div class="tableBorder">
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
            <q-tr
              :props="props"
              style="font-size:1em;"
            >
              <q-td
                key="OrgShortName"
                :props="props"
                style="width:16%;"
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
                style="width:15%;font-size:14px;"
              >
                {{ props.row.doingCount }}
              </q-td>
              <q-td
                key="delayCount"
                :props="props"
                style="width:8%;font-size:14px;"
              >
                {{ props.row.delayCount }}
              </q-td>
              <q-td
                key="suspendedCount"
                :props="props"
                style="width:8%;font-size:14px;"
              >
                {{ props.row.suspendedCount }}
              </q-td>
              <q-td
                key="doneCount"
                :props="props"
                style="width:8%;font-size:14px;"
              >
                {{ props.row.doneCount }}
              </q-td>
              <q-td
                key="Count"
                :props="props"
                style="width:8%;font-size:14px;"
              >
                {{ props.row.Count }}
              </q-td>
              <q-td
                key="InProjectCount"
                :props="props"
                style="width:13%;font-size:14px;"
              >
                {{ props.row.InProjectCount }}
              </q-td>
              <q-td
                key="PsonCount"
                :props="props"
                style="width:10%;font-size:14px;"
              >
                {{ props.row.PsonCount }}
              </q-td>
              <q-td
                key="Proportion"
                :props="props"
                style="width:13%;font-size:14px;"
              >
                {{ props.row.Proportion }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import projectRank from './mixins-project-rank'
export default {
  name: 'ProjectRank',
  mixins: [projectRank],
  data () {
    return {
      columns: [
        { name: 'OrgShortName', label: '机构', field: 'OrgShortName', align: 'left', sortable: false },
        { name: 'doingCount', label: '进行中(含延期)', field: 'doingCount', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'delayCount', label: '延期', field: 'delayCount', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'suspendedCount', label: '挂起', field: 'suspendedCount', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'doneCount', label: '结项', field: 'doneCount', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'Count', label: '总计', field: 'Count', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'InProjectCount', label: '在项目人数', field: 'InProjectCount', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'PsonCount', label: '总人数', field: 'PsonCount', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'Proportion', label: '人员占比(%)', field: 'Proportion', align: 'left', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.q-table__top {
  padding-top: 12px;
  padding-left: 16px;
  padding-right: 0;
  padding-bottom: 3;
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
/deep/.tableBorder {
  border-left: 0.3px solid rgba(0, 0, 0, 0.12);
  border-right: 0.3px solid rgba(0, 0, 0, 0.12);
  border-bottom: 0.3px solid rgba(0, 0, 0, 0.12);
}
.q-item {
  min-height: 25px;
  padding: 6px 16px;
}
</style>
