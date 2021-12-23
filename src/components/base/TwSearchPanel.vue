<template>
  <div class="row full-width">
    <q-input
      dense
      type="search"
      outlined
      clearable
      debounce="1000"
      class="col-12"
      :label="label"
      :value="search"
      @input="val=>$emit('update:search',val)"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template
        v-slot:append
        v-if="showPanelBtn"
      >
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
      class="q-mt-sm"
      v-show="query.length"
    >
      <q-chip
        v-for="(q,index) in query"
        :key="index"
        dense
        removable
        color="grey-3"
        text-color="grey-9"
        @remove="removeQuery(q)"
      >
        {{q.labelPrefix||''}}{{q.label}}{{chipValue(q)}}{{q.labelSuffix||''}}
      </q-chip>
    </div>
    <q-dialog v-model="showDialog">
      <q-card style="width: 500px; max-width: 90vw; max-height:80vh;">
        <q-card-section :class="{'q-pt-sm q-pr-none':$q.screen.lt.sm}">
          <q-virtual-scroll
            class="order-search-scroll"
            :items="querySelect"
            separator
          >
            <template v-slot="{ item }">
              <!-- 分组标题 -->
              <div
                class="text-bold q-my-sm"
                v-show="item.value.length"
              >
                {{item.label}}
              </div>
              <!-- 具体要求 -->
              <div
                class="flex q-gutter-sm"
                v-show="item.value.length"
              >
                <template v-for="(q, index) in item.value">
                  <q-btn
                    unelevated
                    :key="'btn'+index"
                    :label="q.label"
                    :color="q.color"
                    :text-color="q.textColor"
                    :padding="$q.platform.is.mobile ? '2px 8px' : ''"
                    :class="'text-weight-regular text-caption'"
                    @click="addQuery(q)"
                  />
                  <div
                    class="row full-width"
                    v-if="showCustomDate(q.name)&&index===(item.value.length-1)"
                    :key="'div'+index"
                  >
                    <q-input
                      dense
                      filled
                      class="full-width q-pr-md"
                      :value="customDateInput(q.value)"
                      placeholder="请选择时间区间"
                    >
                      <template v-slot:append>
                        <q-icon
                          v-if="q.value.from"
                          size="sm"
                          name="close"
                          @click.stop="q.value = {from:'',to:''}"
                          class="cursor-pointer"
                        />
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                        >
                          <q-popup-proxy
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              range
                              minimal
                              mask="YYYY-MM-DD"
                              v-model="q.value"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </template>
              </div>
            </template>
          </q-virtual-scroll>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            outline
            color="primary"
            :label="$t('label.reset')"
            @click="onReset"
          />
          <q-btn
            color="primary"
            :label="$t('action.confirm')"
            @click="onConfirm"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
export default {
  name: 'TwSearchPanel',
  props: {
    queryList: {
      type: Array,
      required: false,
      default: () => []
    },
    query: {
      type: Array,
      required: false,
      default: () => []
    },
    search: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      required: false,
      default: '筛选'
    },
    showPanelBtn: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      showDialog: false,
      querySelected: [],
      loading: false
    }
  },
  computed: {
    querySelect () {
      let queryList = _.forEach(this.queryList, ql => {
        return _.forEach(ql.value, q => {
          let query = _.find(this.querySelected,
            qs => (qs.name === q.name && qs.value === q.value))
          if (query) {
            q.color = 'primary'
            q.textColor = 'white'
          } else {
            q.color = 'grey-2'
            q.textColor = 'black'
          }
        })
      })
      return queryList
    },
    customDate () {
      return () => {
        return _.find(this.querySelected,
          qs => qs.custom && ['createTime', 'expectedDeliveryDate'].includes(qs.name))
      }
    },
    showCustomDate () {
      return name => {
        return _.some(this.querySelected,
          qs => qs.custom && qs.name === name && ['createTime', 'expectedDeliveryDate'].includes(qs.name))
      }
    },
    customDateInput () {
      return value => {
        return value && value.from && value.to ? `${value.from}~${value.to}` : ''
      }
    },
    chipValue () {
      return q => {
        if (q.custom && ['createTime', 'expectedDeliveryDate'].includes(q.name)) {
          if (!_.isEmpty(q.value.from)) {
            return `(${q.value.from}~${q.value.to})`
          } else {
            return '(全部)'
          }
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    addQuery (q) {
      if (['createTime', 'expectedDeliveryDate'].includes(q.name)) {
        if (!_.find(this.querySelected,
          qs => qs.name === q.name && JSON.stringify(qs.value) === JSON.stringify(q.value))) {
          this.querySelected = _.filter(this.querySelected, qs => qs.name !== q.name)
          this.querySelected.push(q)
        } else {
          this.querySelected = _.filter(this.querySelected, qs => qs.name !== q.name)
        }
      } else {
        let hasArr = _.filter(this.querySelected,
          qs => qs.name === q.name && JSON.stringify(qs.value) === JSON.stringify(q.value))
        if (!hasArr.length) {
          this.querySelected.push(q)
        } else {
          this.querySelected = _.filter(this.querySelected,
            qs => qs.name !== q.name ||
              (qs.name === q.name && JSON.stringify(qs.value) !== JSON.stringify(q.value)))
        }
      }
    },
    removeQuery (q) {
      this.querySelected = _.filter(this.querySelected,
        qs => qs.name !== q.name ||
          (qs.name === q.name && JSON.stringify(qs.value) !== JSON.stringify(q.value)))
      this.$emit('update:query', _.filter(this.query,
        qu => qu.name !== q.name ||
          (qu.name === q.name && JSON.stringify(qu.value) !== JSON.stringify(q.value))))
    },
    onReset () {
      this.querySelected = []
    },
    onConfirm () {
      this.querySelected = _.filter(this.querySelected,
        qs => !this.showCustomDate(qs.name) ||
          (this.showCustomDate(qs.name) && qs.value && qs.value.from && !_.isEmpty(qs.value.from)))
      this.$emit('update:query', _.cloneDeep(this.querySelected))
    }
  }
}
</script>

<style scoped lang="scss">
.order-search-scroll {
  height: calc(80vh - 60px - 32px);
  max-height: 420px;
  overflow: auto;
}
</style>
