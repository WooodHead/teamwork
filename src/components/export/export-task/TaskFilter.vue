<template>
  <div>
    <div class="row items-center q-gutter-x-md">
      <!-- 只导出已完成的任务 -->
      <q-checkbox
        v-model="exportFinished"
        :label="$t('task.exportFinishedTask')"
      />
      <!-- 导出已归档的任务 -->
      <q-checkbox
        v-model="exportArchived"
        :label="$t('task.exportArchivedTask')"
      />
    </div>
    <div class="row items-center q-mt-xs q-gutter-x-sm">
      <tw-select-person
        class="col"
        v-model="person"
        @reset="resetPerson"
        mode="download"
        outlined
        rounded
        dense
        :placeholder="$t('task.selectTaskFinishBy')"
      >
      </tw-select-person>
      <q-input
        v-model="searchDateTitle"
        outlined
        rounded
        dense
        class="col"
        :placeholder="$t('task.selectTaskFinishDate')"
        @click="showDate"
      >
        <template v-slot:append>
          <q-icon
            v-if="fromToDate"
            size="xs"
            name="close"
            @click.capture="resetFromToDate"
            class="cursor-pointer"
          />
          <q-icon
            flat
            name="event"
            class="cursor-pointer text-dark"
            title="选择日期"
          >
            <q-popup-proxy
              ref="date"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="fromToDate" mask="YYYY-MM-DD" minimal range />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="row q-mt-md text-bold" style="margin-left: 35px">
      {{ $t('exportFile.exportResource') }}
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'TaskFilter',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    person: {
      get () {
        return (
          this.$store.state.task.person || {
            id: null,
            name: '',
            type: 'all'
          }
        )
      },
      set (value) {
        this.setPerson(value)
      }
    },
    searchDateTitle () {
      if (this.fromToDate) {
        return this.fromToDate.from + '~' + this.fromToDate.to
      } else {
        return ''
      }
    },
    // 搜索日期
    fromToDate: {
      get () {
        return this.$store.state.task.fromToDate
      },
      set (value) {
        let date = {
          from: '',
          to: ''
        }
        if (!value.from) {
          date.from = value
          date.to = value
        } else {
          date = value
        }
        this.setFromToDate(date)
      }
    },
    exportFinished: {
      get () {
        return this.$store.state.task.exportFinished
      },
      set (value) {
        this.setExportFinished(value)
      }
    },
    exportArchived: {
      get () {
        return this.$store.state.task.exportArchived
      },
      set (value) {
        this.setExportArchived(value)
      }
    }
  },
  mounted () {
    this.resetPerson()
    this.resetFromToDate()
    this.setExportFinished(false)
    this.setExportArchived(false)
  },
  methods: {
    ...mapMutations('task', ['setFromToDate', 'setPerson', 'setExportFinished', 'setExportArchived']),
    resetPerson () {
      let person = {
        id: null,
        name: '',
        type: 'all'
      }
      this.setPerson(person)
    },
    showDate () {
      this.$refs.date.show()
    },
    resetFromToDate () {
      this.setFromToDate(null)
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson')
  }
}
</script>

<style lang="scss" scoped></style>
