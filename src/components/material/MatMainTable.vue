<template>
  <q-table
    v-if="matList.length > 0"
    wrap-cells
    hide-bottom
    :data="matList"
    :columns="matTable.columns"
    :row-key="matTable.rowKey"
    :rows-per-page-options="[0]"
    separator="cell"
    class="full-width"
  >
    <template v-slot:body-cell-BomType="props">
      <q-td :props="props">
        <q-badge
          :color="props.value === 1?'primary': 'secondary'"
          align="top"
        >
          {{props.row.BomTypeName}}
        </q-badge>
      </q-td>
    </template>

    <template v-slot:body-cell-Name="props">
      <q-td :props="props">
        <q-item-section>
          <q-item-label>{{props.value}}</q-item-label>
          <q-item-label
            v-if="props.row.MaterialType === 1"
            class="text-bold text-brown"
            caption
          > {{props.row.MatTypeName}}</q-item-label>
          <q-item-label
            v-else-if="props.row.MaterialType === 2"
            class="text-bold text-cyan"
            caption
          > {{props.row.MatTypeName}}</q-item-label>
          <q-item-label
            v-else-if="props.row.MaterialType === 3"
            class="text-bold text-blue"
            caption
          > {{props.row.MatTypeName}}</q-item-label>
          <q-item-label
            v-else-if="props.row.MaterialType === 4"
            class="text-bold text-teal"
            caption
          > {{props.row.MatTypeName}}</q-item-label>
        </q-item-section>
      </q-td>
    </template>

    <template v-slot:body-cell-Code="props">
      <q-td :props="props">
        <q-item-section>
          <q-item-label>{{props.value}}<br>{{props.row.DeployCode}}</q-item-label>
        </q-item-section>
      </q-td>
    </template>

    <template v-slot:body-cell-PrepareBy="props">
      <q-td :props="props">
        <q-item-section>
          <q-item-label>{{props.value}}</q-item-label>
          <q-item-label
            class="text-primary"
            caption
          > {{props.row.PrepareTime}}</q-item-label>
        </q-item-section>
      </q-td>
    </template>

    <template v-slot:body-cell-CheckBy="props">
      <q-td :props="props">
        <q-item-section>
          <q-item-label>{{props.value}}</q-item-label>
          <q-item-label
            class="text-primary"
            caption
          > {{props.row.CheckTime}}</q-item-label>
        </q-item-section>
      </q-td>
    </template>
    <template v-slot:body-cell-BuditBy="props">
      <q-td :props="props">
        <q-item-section>
          <q-item-label>{{props.value}}</q-item-label>
          <q-item-label
            class="text-primary"
            caption
          > {{props.row.BuditTime}}</q-item-label>
        </q-item-section>
      </q-td>
    </template>

    <template v-slot:body-cell-CreateByID="props">
      <q-td :props="props">
        <tw-avatar
          size="md"
          :id="props.value"
        />
        {{props.row.CreateBy}}
      </q-td>
    </template>

  </q-table>
</template>

<script>
export default {
  name: 'MatMainTable',
  props: {
    matList: {
      type: Array,
      required: false,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      matTable: {
        rowKey: 'ID',
        columns: [
          { name: 'BomType', label: '类型', field: 'BomType', align: 'left', sortable: true, headerStyle: 'font-weight:bold;font-size: 1em' },
          { name: 'Name', label: '详细信息', field: 'Name', align: 'left', headerStyle: 'font-weight:bold;font-size: 1em', sortable: true },
          { name: 'Code', label: '产品代码', field: 'Code', align: 'left', sortable: true, headerStyle: 'font-weight:bold;font-size: 1em', style: 'font-weight:bold;' },
          { name: 'PrepareBy', label: '编制人', field: 'PrepareBy', align: 'left', headerStyle: 'font-weight:bold;font-size: 1em', sortable: true },
          { name: 'CheckBy', label: '校验人', field: 'CheckBy', align: 'left', headerStyle: 'font-weight:bold;font-size: 1em', sortable: true },
          { name: 'BuditBy', label: '审核人', field: 'BuditBy', align: 'left', headerStyle: 'font-weight:bold;font-size: 1em', sortable: true },
          { name: 'CreateByID', label: '导入人', field: 'CreateBy', align: 'left', headerStyle: 'font-weight:bold;font-size: 1em', sortable: true }
        ]
      }
    }
  },
  components: {
    TwAvatar: () => import('components/base/TwAvatar')

  },
  methods: {
    getMatColor (val) {
      return this.matColor[val]
    }
  }
}
</script>
