<template>

  <div class="row full-width">

    <q-input
      dense
      outlined
      clearable
      debounce="500"
      class="col-12"
      :label="label"
      :value="search"
      @input="val=>$emit('update:search',val)"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-btn
          flat
          dense
          icon="filter_list"
          title="多选条件"
          @click.stop="showDialog=true"
        />
      </template>
    </q-input>

    <div
      v-show="queryFlat.length"
      class="q-mt-sm"
    >
      <q-chip
        v-for="query in queryFlat"
        :key="query.type + query.order"
        dense
        removable
        color="grey-3"
        text-color="grey-9"
        @remove="removeQuery(query)"
      >
        {{query.label}}
      </q-chip>
    </div>
    <q-dialog v-model="showDialog">
      <q-card style="width: 500px; max-width: 90vw; max-height:80vh;">
        <q-card-section :class="{'q-pt-sm q-pr-none':$q.screen.lt.sm}">
          <q-virtual-scroll
            class="order-search-scroll"
            :items="Object.keys(queryItem)"
            separator
          >
            <template v-slot="{ item, index }">
              <!-- 分组标题 -->
              <div
                class="text-bold q-my-sm"
                v-show="queryItem[item].length"
              >
                {{item}}
              </div>
              <!-- 具体要求 -->
              <div class="flex q-gutter-sm">
                <q-btn
                  unelevated
                  v-for="(query,index) in queryItem[item]"
                  :key="index"
                  :label="query.label"
                  :color="query.color"
                  :text-color="query.textColor"
                  :padding="$q.platform.is.mobile ? '2px 8px' : ''"
                  :class="'text-weight-regular text-caption'"
                  @click="addQuery(query)"
                />
              </div>
            </template>
          </q-virtual-scroll>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            :label="$t('action.confirm')"
            @click="onConfirm"
            v-close-popup
          />
          <q-btn
            outline
            color="primary"
            :label="$t('label.reset')"
            @click="onReset"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>

</template>

<script>
export default {
  name: '',
  props: {
    search: {
      type: String,
      required: true,
      default: ''
    },
    queryList: {
      type: Array,
      required: false,
      default: () => []
    },
    queryFlat: {
      type: Array,
      required: false,
      default: () => []
    },
    label: {
      type: String,
      required: false,
      default: '筛选'
    }
  },
  data () {
    return {
      showDialog: false,
      querySelected: []
    }
  },
  computed: {
    queryItem () {
      let queryList = _.forEach(_.cloneDeep(this.queryList), ql => {
        let query = _.find(this.querySelected, qs => (qs.type === ql.type && JSON.stringify(qs.value) === JSON.stringify(ql.value)))
        if (query) { ql.color = 'primary'; ql.textColor = 'white' } else { ql.color = 'grey-2'; ql.textColor = 'black' }
      })
      return _.groupBy(_.orderBy(queryList), 'type')
    }
  },
  methods: {
    addQuery (query) {
      let newQuery = _.differenceBy([query], this.querySelected, q => (q.type === query.type && JSON.stringify(q.value) === JSON.stringify(query.value)))
      newQuery.length ? this.querySelected.push(query)
        : _.remove(this.querySelected, q => (q.type === query.type && JSON.stringify(q.value) === JSON.stringify(query.value)))
      this.querySelected = _.cloneDeep(this.querySelected)
    },
    removeQuery (query) {
      _.remove(this.querySelected, q => q.type === query.type && JSON.stringify(q.value) === JSON.stringify(query.value))
      this.querySelected = _.cloneDeep(this.querySelected)
      _.remove(this.queryFlat, q => q.type === query.type && JSON.stringify(q.value) === JSON.stringify(query.value))
      this.$emit('update:queryFlat', _.cloneDeep(this.queryFlat))
    },
    onConfirm () {
      this.$emit('update:queryFlat', _.cloneDeep(this.querySelected))
    },
    onReset () {
      this.$emit('update:queryFlat', [])
      this.querySelected = []
    }
  }
}
</script>

<style scoped lang="scss">
.order-search-scroll {
  height: calc(80vh - 60px - 32px);
  max-height: 370px;
  overflow: auto;
}
</style>
