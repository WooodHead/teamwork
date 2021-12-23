<template>
  <div v-if="settingSource">
    <div
      v-if="editing"
      class="row items-center"
      :class="{'bg-grey-3':bgclass}"
    >
      <div class="row col-11">
        <div
          v-for="item in source"
          class="col-6"
          :key="item.id"
        >
          <q-radio
            v-model="sourceTag"
            :val="item.dictValue"
            :label="item.dictValue"
          />
        </div>
      </div>
      <q-space />
      <div
        v-if="$myinfo.auth.role.isSystemAdministrator"
        @click.stop="showSourceCard=true"
        class="q-mr-md"
      >
        <q-btn
          flat
          round
          dense
          icon="edit"
          color="grey-7"
          size="sm"
        />
      </div>
    </div>
    <div
      v-else
      class="cursor-pointer"
      @click="$emit('clickEvent')"
    >
      <div v-if="task.source"> {{task.source}}</div>
      <div
        v-else
        class="text-grey"
      >{{$t('task.detail.sourceHint')}}
      </div>
    </div>
    <q-dialog
      v-model="showSourceCard"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    >
      <options-edit
        :select-options="source"
        module="workRecord"
        field="source"
        :keys="['source']"
        @close="showSourceCard=false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TaskItemSource',
  props: {
    task: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    },
    editing: {
      type: Boolean,
      required: true
    },
    widgets: {
      type: Object,
      required: false,
      default () {
        return {}
      },
      description: '资源widget.用于判断工具包是否自定义'
    },
    bgclass: {
      type: Boolean,
      default: true
    },
    isSettingSource: {
      type: Boolean,
      default: false,
      description: '是否自定义了来源'
    }
  },
  components: {
    OptionsEdit: () => import('components/base/select-edit/OptionsEdit')
  },
  data () {
    return {
      showSourceCard: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState('dictionary', ['dictionary']),
    source () {
      return this.dictionary['workRecord'] ? this.dictionary['workRecord']['source'] : []
    },
    sourceTag: {
      get () {
        return this.task.source || (this.source.length && this.source[0].dictValue)
      },
      set (val) {
        this.task.source = val
      }
    },
    settingSource () {
      return this.isSettingSource ||
        (this.widgets.task &&
          this.widgets.task.taskForm &&
          this.widgets.task.taskForm.indexOf('source') >= 0)
    }
  },
  methods: {
    ...mapActions('dictionary', ['loadDictionarys']),
    init () {
      if (this.editing &&
        this.widgets.task &&
        this.widgets.task.taskForm &&
        this.widgets.task.taskForm.indexOf('source') >= 0) {
        this.loadDictionarys('workRecord')
      }
    }
  },
  watch: {
    'editing' () {
      this.init()
    }
  }
}
</script>
