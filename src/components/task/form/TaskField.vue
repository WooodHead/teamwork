
<template>
  <!-- 表单内容 -->
  <q-card-section class="q-gutter-xs">
    <q-input
      filled
      autofocus
      stack-label
      ref="title_input"
      v-model="model.name"
      :placeholder="$t('task.item.placeholder')"
      lazy-rules
      :rules="[ val => val&&val.trim().length>0 || $t('rule.fieldIsRequired')]"
    />
    <tw-select-person
      v-if="!categoryModel.isTemplate"
      filled
      stack-label
      v-model="model.assignedTo"
      multiple
      :label="$t('task.item.assignedTo')"
      placeholder=""
      emit-value
      by-group
    />
    <q-checkbox
      v-if="model.assignedTo && model.assignedTo.length"
      v-model="model.notifyAssignedTo"
      :label="$t('task.item.isnotify')"
    />
    <q-checkbox
      v-if="model.assignedTo && model.assignedTo.length>1"
      v-model="model.isSplitSingleTask"
      :label="$t('task.item.isSplitSingleTask')"
    />
    <tw-select-person
      v-if="!categoryModel.isTemplate"
      filled
      stack-label
      v-model="model.notifyTo"
      multiple
      :label="$t('task.item.notify')"
      placeholder=""
      emit-value
      by-group
    />
    <div>
      <div class="row q-col-gutter-xs">
        <q-field
          class="col-12"
          filled
          :label="$t('task.item.dueOn')"
          stack-label
          color="grey-8"
        >
          <q-option-group
            v-if="!categoryModel.isTemplate"
            v-model="model.dateType"
            :options="options"
            color="primary"
            inline
            @input="(val)=>{val==='range'?$refs.popupStartDate.show():val==='day'?$refs.popupEndDate.show():undefined}"
          />
        </q-field>

        <q-input
          v-show="model.dateType==='range'"
          class="col-12 col-sm-6"
          filled
          stack-label
          :label="$t('task.item.date.start')"
          v-model="model.startTime"
          mark="####/##/##"
          placeholder="####/##/##"
          @mousedown="$refs.popupStartDate.show()"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="popupStartDate"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="model.startTime"
                  :mask="formatString"
                  today-btn
                  no-unset
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-show="model.dateType==='range'||model.dateType==='day'"
          class="col-12 col-sm-6"
          :class="{'col-sm-12':model.dateType==='day'}"
          v-model="model.endTime"
          filled
          stack-label
          :label="$t('task.item.date.end')"
          mark="####/##/##"
          placeholder="####/##/##"
          @mousedown="$refs.popupEndDate.show()"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="popupEndDate"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="model.endTime"
                  :mask="formatString"
                  today-btn
                  no-unset
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

      </div>
    </div>
    <!-- 预计工作用时 -->
    <q-input
      v-if="setting.predictHour &&!categoryModel.isTemplate"
      type="number"
      step="0.1"
      filled
      v-model.number="model.predictHour"
      :label="$t('task.item.predictHour')"
    >
      <template v-slot:append>
        <span class="text-caption">{{$t('date.hour')}}</span>
      </template>
    </q-input>
    <!-- 实际工时 -->
    <q-input
      v-if="setting.actualHour&&model.workHour&&!categoryModel.isTemplate"
      type="number"
      step="0.1"
      filled
      v-model.number="model.workHour"
      :label="$t('task.item.workHour')"
    >
      <template v-slot:append>
        <span class="text-caption">{{$t('date.hour')}}</span>
      </template>
    </q-input>
    <tw-select-tag
      filled
      stack-label
      multiple
      v-model="model.tags"
      :label="$t('task.item.tag')"
      placeholder=""
      emit-value
    />
    <q-input
      v-if="!showEditor"
      class="q-mt-md"
      type="text"
      :placeholder="$t('task.item.description')"
      filled
      Readonly
      @click="showEditor=true"
    />
    <quasar-editor
      v-else
      focus
      :value="description"
      :placeholder="$t('task.item.description')"
      :folder="category"
      :applied="goIntoAction"
      @input="(val)=>{model.description=val}"
    ></quasar-editor>
  </q-card-section>
</template>

<script>
import { LocalStorage, date } from 'quasar'
import Task from '@/store/task/model'
import getCategory from '@/mixins/mixins-get-category'
const { addToDate, formatDate } = date
export default {
  name: 'TaskField',
  mixins: [getCategory],
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson'),
    TwSelectTag: () => import('components/base/TwSelectTag'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  },
  props: {
    // 任务
    model: {
      type: Object,
      required: false,
      default: () => _.cloneDeep(new Task())
    },
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    }
  },
  data () {
    return {
      remSTime: '',
      remETime: '',
      formatString: 'YYYY-MM-DD',
      showEditor: false,
      options: [
        {
          label: this.$t('task.item.date.none'),
          value: 'none'
        },
        {
          label: this.$t('task.item.date.day'),
          value: 'day'
        },
        {
          label: this.$t('task.item.date.range'),
          value: 'range'
        }
      ],
      validateTitle: false,
      // 初始化备注中提及的人员姓名
      mentionedPersons: [],
      // 备注中新提及的人员
      myinfo: LocalStorage.getItem('myself'),
      description: '',
      goIntoAction: false
    }
  },
  computed: {
    setting () {
      return this.$store.getters['task/taskSetting'](this.categoryModel)
    }
  },
  watch: {
    'model.description': {
      immediate: true,
      handler (newVal, oldVal) {
        if (!oldVal) {
          this.description = this.model.description
          this.showEditor = !!this.description
        }
      }
    },
    'model.startTime' (newVal, oldVal) {
      if (newVal > this.model.endTime) {
        this.model.endTime = formatDate(addToDate(new Date(newVal), { days: 1 }), this.formatString)
      }
    },
    'model.endTime' (newVal, oldVal) {
      if (newVal < this.model.startTime) {
        this.model.startTime = formatDate(addToDate(new Date(newVal), { days: -1 }), this.formatString)
      }
    }
  },
  mounted () {
    if (+this.id !== 0) {
      this.description = this.model.description
      this.showEditor = !!this.description
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .task-add .color .q-avatar__content {
    border: solid 1px black;
  }
</style>
