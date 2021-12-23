<template>
  <q-table
    :data="postions"
    :columns="columns"
    row-key="recordNum"
    :rows-per-page-options="[15,30,50,100,0]"
    flat
  >
    <template v-slot:body="props">
      <q-tr
        :props="props"
        class="full-width"
      >
        <q-td
          key="psonName"
          :props="props"
        >
          <q-icon
            size="sm"
            name="perm_identity"
            style="color:#33ac37;"
          />
          {{ props.row.psonName }}
        </q-td>
        <q-td
          key="recordNum"
          :props="props"
        >
          {{ props.row.recordNum }}
        </q-td>
        <q-td
          key="organizeName"
          :props="props"
        >
          {{ props.row.organizeName }}
        </q-td>
        <q-td
          key="sendStatus"
          :props="props"
        >
          <q-badge
            v-if="props.row.sendStatus!==1"
            :color="sendStatusStyle[props.row.sendStatus]"
            :label="sendStatusStr[props.row.sendStatus]"
          />
          <q-badge
            v-else
            :color="props.row.isRead===1?'positive':'grey-6'"
            :label="$t('position.filterOptions.'+(props.row.isRead===1?'isRead':'unRead'))"
          />
        </q-td>
        <q-td
          key="operate"
          :props="props"
        >
          <q-btn
            flat
            dense
            :label="$t('position.showPosition')"
            @click="$emit('viewDetail',props.row.recordNum)"
            class="q-px-sm text-positive"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'PositionTable',
  props: {
    postions: {
      type: Array,
      require: false,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      sendStatusStr: [
        this.$t('position.filterOptions.unSend'),
        '',
        this.$t('position.filterOptions.mismatch'),
        this.$t('position.filterOptions.newData'),
        this.$t('position.filterOptions.error')
      ],
      sendStatusStyle: ['negative', '', 'orange', 'orange', 'negative'],
      showViewPosition: false,
      columns: [
        { name: 'psonName', align: 'center', label: '姓名', field: 'psonName', sortable: true },
        { name: 'recordNum', align: 'center', label: this.$t('auth.fields.jobNumber'), field: 'recordNum', sortable: true },
        { name: 'organizeName', align: 'center', label: '部门', field: 'organizeName', sortable: true },
        { name: 'sendStatus', align: 'center', label: '状态' },
        { name: 'operate', align: 'center', label: '操作' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  white-space: pre-wrap;
}
/deep/.q-table th {
  font-weight: 600;
}
</style>
