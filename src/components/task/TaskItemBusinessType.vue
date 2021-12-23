<template>
  <div v-if="settingBusinessType">
    <div
      @click="onClick()"
      class="cursor-pointer"
      :style="borderless?'width: 30rem;':''"
    >
      <q-input
        v-if="editing"
        v-model="businessTypeValue"
        :filled="filled"
        :borderless="borderless"
      >
        <template v-slot:prepend>
          <q-btn
            v-if="businessTypeIcon==='sort_by_alpha'"
            icon="sort_by_alpha"
            color="grey-9"
            size="sm"
            round
            outline
          />
          <q-btn
            v-else
            :label="businessTypeIcon"
            color="grey-9"
            size="sm"
            round
            outline
          />
        </template>
      </q-input>
      <div v-else>
        <div v-if="task.businessType">
          <q-btn
            :label="businessTypeIcon"
            outline
            size="sm"
            round
          />
          <span class="q-ml-sm">{{businessTypeValue}}</span>
        </div>
        <div
          v-else
          class="text-grey"
        >{{$t('task.detail.businessTypeHint')}}
        </div>
      </div>
    </div>

    <!-- 类型选择弹窗 -->
    <q-dialog
      v-model="showTypeCard"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="$q.screen.lt.sm ? 'bottom' : 'standard'"
    >
      <q-card>
        <q-card-section class="row items-center justify-center relative-position q-pb-none">
          <span class="text-weight-bold text-subtitle1">{{$t('task.detail.businessTypeHint')}}</span>
          <div
            class="absolute-right q-mr-md"
            style="top:auto"
          >
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="grey-7"
              v-if="$myinfo.auth.role.isSystemAdministrator"
              @click.stop="editTypeCard=!editTypeCard"
            />
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              @click.stop="showTypeCard = false;editTypeCard = false"
            />
          </div>
        </q-card-section>
        <q-separator />
        <work-type-card
          @click="selectedType"
          :showEditBtn="editTypeCard"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'TaskItemBusinessType',
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
    filled: {
      type: Boolean,
      default: true
    },
    borderless: {
      type: Boolean,
      default: false
    },
    isSettingBusinessType: {
      type: Boolean,
      default: false,
      description: '是否自定义了任务类型'
    }
  },
  components: {
    WorkTypeCard: () => import('components/work-record/WorkTypeCard')
  },
  data () {
    return {
      showTypeCard: false,
      editTypeCard: false
    }
  },
  computed: {
    businessTypeIcon () {
      return this.task && this.task.businessType && this.task.businessType.split('—') ? this.task.businessType.split('—')[0].trim() : 'sort_by_alpha'
    },
    businessTypeValue () {
      return (this.task && this.task.businessType && this.task.businessType.split('—') && this.task.businessType.split('—')[1]) || this.$t('task.detail.businessTypeHint')
    },
    settingBusinessType () {
      return this.isSettingBusinessType || (this.widgets.task && this.widgets.task.taskForm && this.widgets.task.taskForm.indexOf('businessType') >= 0)
    }
  },
  methods: {
    onClick () {
      if (this.editing) {
        this.showTypeCard = true
      } else {
        this.$emit('clickEvent')
      }
    },
    selectedType (value) {
      this.showTypeCard = false
      this.task.businessType = `${value.dictKey} — ${value.dictValue}`
    }
  }
}
</script>
