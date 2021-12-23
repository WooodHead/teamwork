<template>
  <q-list
    separator
    dense
    class="q-px-none"
  >
    <q-item class="items-start">
      <q-item-section
        side
        :style="checkStyle"
      >
        <!-- 已完成 -->
        <task-item-finish-check
          :model="model"
          inEdit
          class="self-end"
        />
      </q-item-section>
      <q-item-section>
        <textarea
          :autofocus="focus==='name'"
          v-model="model.name"
          class="text-h5 text-weight-bold title-area"
          style="border:none;width:100%;"
        ></textarea>
        <div
          v-show="!model.name"
          class="text-red"
        >
          {{$t('rule.fieldIsRequired')}}
        </div>
      </q-item-section>
    </q-item>
    <!-- 指派给 -->
    <q-item
      v-if="!categoryModel.isTemplate"
      :class="{ column: $q.screen.lt.sm }"
    >
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.assignedTo')}}
      </q-item-section>
      <q-item-section>
        <!-- 人员选择 -->
        <tw-select-person
          dense
          filled
          v-model="model.assignedTo"
          :autofocus="focus==='assignedTo'"
          borderless
          multiple
          emit-value
          :placeholder="$t('task.detail.assignHint')"
          by-group
        />
        <div class="q-mt-sm">
          <q-checkbox
            dense
            size="sm"
            v-if="model.assignedTo.length"
            v-model="model.notifyAssignedTo"
          >
            {{$t('task.item.isnotify')}}
          </q-checkbox>
          <q-checkbox
            dense
            size="sm"
            class="q-ml-md"
            v-if="model.assignedTo && model.assignedTo.length>1"
            v-model="model.isSplitSingleTask"
            :label="$t('task.item.isSplitSingleTask')"
          />
        </div>
      </q-item-section>
    </q-item>
    <!-- 通知 -->
    <q-item :class="{ column: $q.screen.lt.sm }">
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.notifyTo')}}
      </q-item-section>
      <q-item-section>
        <tw-select-person
          dense
          filled
          v-model="model.notifyTo"
          :autofocus="focus==='notifyTo'"
          borderless
          multiple
          emit-value
          by-group
          :placeholder="$t('task.detail.notifyHint')"
        />
      </q-item-section>
    </q-item>
    <!-- 选择日期 -->
    <q-item :class="{ column: $q.screen.lt.sm }">
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.dueOn')}}
      </q-item-section>
      <!-- 日期选择模块 -->
      <q-item-section class="col">
        <div class="row q-col-gutter-xs">
          <q-field
            class="col-12"
            dense
            filled
            stack-label
            color="grey-8"
          >
            <q-option-group
              :autofocus="focus==='dateType'"
              v-model="model.dateType"
              :options="optionsDate"
              color="primary"
              inline
              @input="(val)=>{val==='range'?$refs.popupStartDate.show():val==='day'?$refs.popupEndDate.show():undefined}"
            />
          </q-field>

          <q-input
            dense
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
            dense
            v-show="model.dateType==='range'||model.dateType==='day'"
            class="col-12 col-sm-6"
            :class="{'col-sm-12':model.dateType==='day'}"
            filled
            stack-label
            :label="$t('task.item.date.end')"
            v-model="model.endTime"
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

      </q-item-section>
    </q-item>
    <!-- 预计工作用时 -->
    <q-item
      v-if="setting.predictHour"
      :class="{ column: $q.screen.lt.sm }"
    >
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.predictHour')}}
      </q-item-section>
      <q-item-section>
        <q-input
          dense
          type="number"
          step="0.1"
          filled
          :suffix="$t('date.hour')"
          v-model.number="model.predictHour"
          :placeholder="$t('task.item.predictHour')"
        >
        </q-input>
      </q-item-section>
    </q-item>
    <!-- 实际工作用时 -->
    <q-item
      v-if="setting.actualHour&&model.workHour"
      :class="{ column: $q.screen.lt.sm }"
    >
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.workHour')}}
      </q-item-section>
      <q-item-section>
        <q-input
          dense
          type="number"
          step="0.1"
          filled
          :suffix="$t('date.hour')"
          v-model.number="model.workHour"
          :placeholder="$t('task.item.workHour')"
        >
        </q-input>
      </q-item-section>
    </q-item>
    <!-- 添加标签 -->
    <q-item :class="{ column: $q.screen.lt.sm }">
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.tag')}}
      </q-item-section>
      <q-item-section>
        <tw-select-tag
          dense
          filled
          :autofocus="focus==='tags'"
          borderless
          multiple
          v-model="model.tags"
          emit-value
          :placeholder="$t('task.detail.tagHint')"
        />
      </q-item-section>
    </q-item>
    <!-- 备注 -->
    <q-item
      :class="{ column: $q.screen.lt.sm }"
      v-if="!showEditor"
    >
      <q-item-section
        side
        :class="labelClass"
        :style="labelStyle"
      >
        {{$t('task.detail.notes')}}
      </q-item-section>
      <q-item-section>
        <q-input
          dense
          filled
          type="text"
          :placeholder="$t('task.item.description')"
          Readonly
          @click="showEditor=true"
        />
      </q-item-section>
    </q-item>
    <quasar-editor
      v-else
      :value="description"
      :autofocus="focus==='description'"
      @input="(val)=>{model.description=val}"
      :folder="model.objectType"
      :applied="goIntoAction"
      :placeholder="$t('task.detail.extraNotes')"
    ></quasar-editor>

  </q-list>
</template>

<script>
import Task from '@/store/task/model'
import getCategory from '@/mixins/mixins-get-category'
import { date } from 'quasar'
const { addToDate, formatDate } = date
export default {
  name: 'TaskFieldLikeDetail',
  mixins: [getCategory],
  props: {
    model: {
      type: Object,
      required: false,
      default: () => new Task()
    },
    focus: {
      type: String,
      required: false,
      default: 'name'
    },
    goIntoAction: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    TwSelectPerson: () => import('components/base/TwSelectPerson'),
    TwSelectTag: () => import('components/base/TwSelectTag'),
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor'),
    TaskItemFinishCheck: () => import('components/task/TaskItemFinishCheck')
  },
  data () {
    return {
      description: '',
      formatString: 'YYYY-MM-DD',
      showEditor: false,
      optionsDate: [
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
      ]
    }
  },
  computed: {
    labelStyle () {
      return this.$q.lang.getLocale().includes('zh') ? 'width:7.2rem' : 'width:10rem'
    },
    labelClass () {
      return 'text-dark text-weight-bold text-subtitle1  ' + (this.$q.screen.lt.sm ? 'text-start' : 'items-end')
    },
    checkStyle () {
      return this.$q.screen.lt.sm ? '' : (this.$q.lang.getLocale().includes('zh') ? 'width:7rem' : 'width:10rem')
    },
    setting () {
      return this.$store.getters['task/taskSetting'](this.categoryModel)
    },
    category () {
      return this.model.objectType
    },
    objectID () {
      return this.model.objectId
    }
  },
  mounted () {
  },
  watch: {
    'model.description': {
      immediate: true,
      handler (newVal, oldVal) {
        if (!oldVal) {
          this.description = this.model.description
          if (this.description || this.focus === 'notes') {
            this.showEditor = true
          }
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
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    outline: none;
    resize: none;
  }
  .q-select {
    flex: 0 0 0 !important;
  }
  /deep/.menubar__button {
    padding: 0.2rem 0.4rem;
  }
  /deep/.content img {
    transition: all 0.6s;
    -moz-transition: all 0.6s;
    -webkit-transition: all 0.6s;
    -ms-transition: all 0.6s;
  }
  /deep/.content img.scale {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
  }
</style>
