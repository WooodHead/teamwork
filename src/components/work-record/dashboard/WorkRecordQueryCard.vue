<template>
  <q-card style="width: 600px; max-width: 90vw; max-height:80vh;">
    <q-card-section
      :class="{'q-pt-sm q-pr-none':$q.screen.lt.sm}"
      class="q-pb-none"
    >
      <q-virtual-scroll
        class="query-list"
        :items="Object.keys(workRecordQueryKeys)"
      >
        <template v-slot="{ item }">
          <!-- 分组标题 -->
          <div class="text-bold q-my-sm">
            {{workRecordQueryKeys[item]}}
          </div>
          <!-- 日期 -->
          <q-input
            v-if="item ==='date'"
            :style="$q.screen.lt.sm?'width:95%':'width:50%'"
            v-model="workRecordQuerys[item]"
            outlined
            type="month"
            :label="$t('workRecord.statisticMonth')"
          />
          <div
            class="flex q-gutter-sm btn-style"
            v-if="['hourType','source','workType', 'average'].includes(item)"
          >
            <q-btn
              v-for="value in workRecordQueryValues[item]"
              :key="value"
              flat
              align="left"
              style="max-width:100px"
              class="text-weight-regular text-caption"
              :padding="$q.platform.is.mobile ? '2px 8px' : ''"
              :class="(workRecordQuerys[item] && workRecordQuerys[item].includes(value.split('-')[0])) ? 'bg-primary' : 'bg-grey-2'"
              :text-color="(workRecordQuerys[item] && workRecordQuerys[item].includes(value.split('-')[0])) ? 'white' : 'black'"
              :title="['hourType', 'average'].includes(item) ? value.split('-')[1] : value"
              @click="addQuery(item, value.split('-')[0])"
            >
              <div class="ellipsis">{{['hourType', 'average'].includes(item) ? value.split('-')[1] : value}}</div>
            </q-btn>
          </div>
          <!-- 机构 -->
          <div
            v-if="item ==='organize'"
            class="q-px-xxl"
          >
            <div
              class="row"
              v-if="organizeQuerys && organizeQuerys.length"
            >
              <q-chip
                v-for="id in organizeQuerys"
                :key="`ticked-${id}`"
                dense
                removable
                @remove="removeOrganizeTick(id)"
              >
                {{mapOrganizes[id] && mapOrganizes[id].name}}
              </q-chip>
            </div>
            <q-tree
              selected-color="primary"
              class="col-12"
              node-key="id"
              label-key="name"
              :nodes="selectOrganizesTree"
              tick-strategy="strict"
              :ticked.sync="organizeQuerys"
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
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'WorkRecordQueryCard',
  props: {
    querys: {
      type: Object,
      required: true,
      default: () => { return { date: 0, source: [], workType: [], organize: [], hourType: [] } },
      description: '查询条件'
    }
  },
  data () {
    return {
      workRecordQueryKeys: {
        date: '统计月份',
        hourType: '工时类型',
        source: '来源',
        workType: '工作类别',
        average: '平均数'
      },
      workRecordQuerys: {},
      organizeQuerys: []
    }
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    ...mapGetters('organize', ['selectOrganizes', 'selectOrganizesTree']),
    mapOrganizes () {
      return _.keyBy(this.selectOrganizes, 'id')
    },
    workSource () {
      const sources = this.dictionary['workRecord'] ? this.dictionary['workRecord']['source'] : []
      return sources.map(r => { return r.dictValue })
    },
    workType () {
      const types = this.dictionary['workRecord'] ? this.dictionary['workRecord']['type'] : []
      return types.map(r => { return r.dictKey + '-' + r.dictValue })
    },
    // 多条件查询
    workRecordQueryValues () {
      return {
        date: this.querys.date,
        hourType: ['WorkHour-工作用时', 'OnRoadHour-路途用时'], // 工时类型
        source: this.workSource, // 来源
        workType: this.workType, // 工作类别,
        average: ['PsonAverage-人均数']
      }
    }
  },
  mounted () {
    this.workRecordQueryKeys = Object.assign({}, this.workRecordQueryKeys, { organize: '机构查询' })

    this.workRecordQuerys = _.cloneDeep(this.querys)
    if (this.querys['organize']) {
      this.organizeQuerys = _.cloneDeep(this.querys['organize'])
    }
    this.loadDictionarys('workRecord')
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    ...mapMutations('taskchart', ['setWorkRecordDashQueryCon']),
    addQuery (key, value) {
      if (this.workRecordQuerys[key]) {
        if (_.includes(this.workRecordQuerys[key], value)) {
          const index = _.indexOf(this.workRecordQuerys[key], value)
          index >= 0 && this.workRecordQuerys[key].splice(index, 1)
          if (this.workRecordQuerys[key].length === 0) {
            this.$delete(this.workRecordQuerys, key)
          }
        } else {
          this.workRecordQuerys[key].push(value)
        }
      } else {
        this.$set(this.workRecordQuerys, key, [])
        this.workRecordQuerys[key].push(value)
      }
    },
    onConfirm () {
      let key = 'organize'
      if (this.workRecordQuerys[key]) {
        if (this.organizeQuerys.length === 0) {
          this.$delete(this.workRecordQuerys, key)
        } else {
          this.workRecordQuerys[key] = [] // 重新添加勾选的机构
          this.organizeQuerys.map(r => {
            return this.workRecordQuerys[key].push(r)
          })
        }
      } else {
        if (this.organizeQuerys.length > 0) {
          this.$set(this.workRecordQuerys, key, [])
          this.organizeQuerys.map(r => {
            return this.workRecordQuerys[key].push(r)
          })
        }
      }
      this.setWorkRecordDashQueryCon(this.workRecordQuerys)
    },
    onReset () {
      this.setWorkRecordDashQueryCon({ reset: true })
    },
    removeOrganizeTick (tick) {
      this.organizeQuerys.splice(this.organizeQuerys.indexOf(tick), 1)
    }
  }
}
</script>

<style lang='scss' scoped>
  .query-list {
    height: calc(80vh - 60px - 32px);
    max-height: 560px;
    overflow: auto;
  }
  .btn-style /deep/.q-btn__wrapper {
    padding: 4px 10px;
  }
</style>
