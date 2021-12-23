<template>
  <q-page>
    <q-card
      :flat="$q.screen.lt.sm"
      class="card-grow-in-page"
    >
      <!-- 标题 -->
      <tw-header-card :title="$t('jd50Alarm.query')">
      </tw-header-card>

      <!--报警信息列表-->
      <q-card-section class="q-px-xxl">
        <div class="q-col-gutter-sm row no-wrap">
          <q-select
            dense
            outlined
            clearable
            v-model="selectedType"
            :options="allSelectOptions"
            :label="$t('jd50Alarm.type')"
            class="col-shrink"
            :style="{ minWidth: '6rem'}"
          />
          <q-input
            ref="filter"
            outlined
            dense
            debounce="500"
            v-model="filter"
            :label="$t('jd50Alarm.codeAndDescription')"
            class="col"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="filter !== ''"
                name="clear"
                class="cursor-pointer"
                @click="resetFilter"
              />
            </template>
          </q-input>
        </div>

        <q-infinite-scroll
          ref="qInfiniteScroll"
          @load="onLoad"
          :offset="250"
        >

          <template v-if="alarmsData.length">
            <q-list
              separator
              padding
            >
              <q-item
                v-for="alarm in alarmsData"
                :key="alarm.alarmId"
              >
                <q-item-section @click="showDialog(alarm)">

                  <div class="text-body2 items-center text-weight-medium text-primary">
                    <span>【{{alarm.alarmTypeName}}】</span>
                    <span v-html="$options.filters.searchHighLight(alarm.alarmCode,filter)"></span>
                  </div>
                  <div
                    class="q-pa-xs ellipsis-2-lines text-weight-regular"
                    v-html="$options.filters.searchHighLight(alarm.alarmDesc,filter)"
                  >
                  </div>
                </q-item-section>
                <q-item-section
                  side
                  @click="showDialog(alarm)"
                >
                  <q-icon
                    name="chevron_right"
                    color="grey-4"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div
              v-if="alarmsData.length>10 && alarmsData.length===alarmsFiltered.length"
              class='row justify-center q-ma-xl'
            >
              {{$t('jd50Alarm.hasReachedTheBottom')}}
            </div>
            <q-dialog
              v-model="showAlarmDetail"
              :position="position"
            >
              <alarm-detail :alarm="alarm"></alarm-detail>
            </q-dialog>
          </template>

          <template v-if="filter&& !alarmsData.length">
            <tw-banner-no-result
              class="q-mt-sm"
              :info="$t('jd50Alarm.noEligibleAlarm')"
            />
          </template>

          <template v-if="!filter&& !alarmsData.length">
            <tw-banner-no-result
              class="q-mt-sm"
              :info="$t('jd50Alarm.noAlarm')"
            />
          </template>
        </q-infinite-scroll>
      </q-card-section>

    </q-card>
  </q-page>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {

  data () {
    return {
      showAlarmDetail: false,
      alarm: '',
      alarmsData: [],
      limit: 10,
      position: 'bottom'
    }
  },

  filters: {
    searchHighLight (value, search) {
      if (search) {
        return _.replace(value, search, '<span class="bg-yellow-6">' + search + '</span>')
      }
      return value
    }
  },

  methods: {
    ...mapMutations('jd50Alarm', ['setSearch', ' setAllAlarmType', 'setSelectedType']),
    ...mapActions('jd50Alarm', ['loadAlarms']),
    showDialog (alarm) {
      this.showAlarmDetail = true
      this.alarm = alarm
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    onLoad (index, done) {
      if (index * this.limit < this.alarmsFiltered.length) {
        this.alarmsData.push(..._.slice(this.alarmsFiltered, (index - 1) * this.limit, index * this.limit))
        done()
      } else {
        this.alarmsData.push(..._.slice(this.alarmsFiltered, (index - 1) * this.limit, this.alarmsFiltered.length))
        done(true)
      }
    }

  },

  created () {
    this.loadAlarms()
  },

  computed: {
    ...mapGetters('jd50Alarm', ['alarmsFiltered']),
    filter: {
      get () {
        return this.$store.state.jd50Alarm.search
      },
      set (value) {
        this.alarmsData = []
        this.setSearch(value)
        // 只针对PC端重新调用onLoad的方法
        this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
        this.$refs.qInfiniteScroll.resume() // 重新开启加载
        this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      }
    },
    selectedType: {
      get () {
        return this.$store.state.jd50Alarm.selectedType
      },
      set (value) {
        this.alarmsData = []
        this.setSelectedType(value)
        // 只针对PC端重新调用onLoad的方法
        this.$refs.qInfiniteScroll.reset() // 设置滚动索引为0
        this.$refs.qInfiniteScroll.resume() // 重新开启加载
        this.$refs.qInfiniteScroll.trigger()// 不管滚动位置如何，重新调用onload
      }
    },
    allSelectOptions () {
      return this.$store.state.jd50Alarm.setAllAlarmType
    }
  },
  components: {
    TwHeaderCard: () => import('components/base/TwHeaderCard'),
    AlarmDetail: () => import('components/jd50-alarm/AlarmDetail'),
    TwBannerNoResult: () => import('components/base/TwBannerNoResult')
  }
}

</script>

<style lang="scss" scoped>
</style>
