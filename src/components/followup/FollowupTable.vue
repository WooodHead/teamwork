<!--
@Name：跟进表格
@Author：李建国
@date：2021/12/29
@Remark：
@Copyright：西安精雕软件科技有限公司
-->
<template>
  <div class="full-width">
    <q-table
      flat
      :data="list"
      :columns="columns"
      :row-key="rowKey"
      @row-click="rowClick"
      :pagination.sync="pagination"
      @request="onRequest"
      binary-state-sort
      hide-bottom
      class="my-sticky-header-table"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold text-subtitle2 table-header"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-contactForm="props">
        <q-td :props="props">
          <!-- <q-icon
            :name="iconName(props.value)"
            :color="iconColor(props.value)"
            size="sm"
          /> -->
          <span
            class="q-ml-none"
            :title="props.value"
          >{{props.value}}</span>
          <span v-if="['file','link'].includes(props.row.classify)">{{`${props.row.extension||props.row.classify}`}}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-size="props">
        <q-td :props="props">
          <span v-if="props.row.classify==='folder'"> - </span>
          <span v-else> {{props.value}}</span>

        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { date } from 'quasar'
import { mapMutations } from 'vuex'
export default {
  name: 'FollowupTable',
  props: {
    list: { type: Array, default: () => [] },
    id: {
      type: [Number, String],
      default: 0,
      required: false
    },
    category: {
      type: String,
      default: '',
      required: false,
      description: '模块类型'
    },
    objectID: {
      type: [Number, String],
      default: 0,
      required: false,
      description: '模块ID'
    }
  },
  data () {
    return {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 20
      },
      rowKey: 'id',
      columns: [
        { name: 'title', classes: 'text-grey-8', label: '标题', field: 'title', align: 'left', sortable: false },
        { name: 'contactForm', classes: 'text-grey-8', label: '跟进方式', field: 'contactForm', align: 'left', sortable: false },
        { name: 'createBy', classes: 'text-grey-8', label: '创建者', field: 'createBy', align: 'left', sortable: false },
        { name: 'modifyTime', classes: 'text-grey-8', label: '最近更新', field: 'modifyTime', align: 'left', sortable: false, format: (val, row) => date.formatDate(val, 'YYYY-MM-DD HH:mm') }
      ]
    }
  },
  computed: {
    currContactForm () {
      return (contactForm) => _.filter(this.$store.state.followup.contactForm, { 'val': contactForm })[0]
    },
    iconName () {
      return (contactForm) => this.currContactForm(contactForm).iconName || ''
    },
    iconColor () {
      return (contactForm) => this.currContactForm(contactForm).iconColor || 'green'
    }
  },
  methods: {
    ...mapMutations('followeup', ['setSort', 'setOrder']),
    onRequest (props) {
      const obj = {
        title: 'Title',
        authorName: 'AuthorName',
        modifyTime: 'ModifyTime',
        size: 'Size'
      }
      let sortName = props.pagination &&
        props.pagination.sortBy
      if (sortName) {
        this.pagination.descending = !this.pagination.descending
        let sortOrder = this.pagination.descending ? 'desc' : 'asc'
        this.pagination.sortBy = sortName
        this.setOrder(sortOrder)
        this.setSort(obj[sortName])
      }
      this.$emit('restart')
    },
    rowClick (evt, row, index) {
      this.openFollowupDetail(row.objectType, row.objectID, +row.id)
    },
    openFollowupDetail (category, objectID, id = 0) {
      this.$router.push({
        name: 'followupDetail',
        params: { category, objectID, id }
      })
    }
  },
  components: {

  }
}
</script>

<style lang="sass" scoped>
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    font-weight: 700
</style>
