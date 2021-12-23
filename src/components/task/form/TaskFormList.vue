<template>
  <div>
    <q-card
      flat
      bordered
    >
      <q-form
        autofocus
        @submit.prevent="onSubmit"
        @reset="onCancel"
      >
        <!-- 表单内容 -->
        <q-card-section class="q-gutter-sm">
          <q-input
            filled
            :dense="false"
            stack-label
            v-model="model.name"
            :placeholder="$t('task.list.placeholder')"
            lazy-rules
            :rules="[ val =>val&&val.trim().length>0|| $t('rule.fieldIsRequired')]"
          >
            <template v-slot:append>
              <span
                v-if="model.startTime"
                class="text-body2"
              >
                {{model.startTime }} ~ {{model.endTime }}
              </span>
              <q-icon
                flat
                name="event"
                class="cursor-pointer text-dark"
                title="选择日期"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="date"
                    :mask="formatString"
                    minimal
                    range
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        v-close-popup
                        label="清空日期"
                        color="primary"
                        flat
                        @click="CleanDate"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-if="!showEditor"
            type="text"
            :placeholder="$t('task.list.description')"
            filled
            Readonly
            @click="showEditor=true"
          />
          <quasar-editor
            v-else
            focus
            :value="description"
            :placeholder="$t('task.list.description')"
            :folder="category"
            :applied="goIntoAction"
            @input="(val)=>{model.description=val}"
          ></quasar-editor>
          <div class="q-gutter-sm">
            <q-radio
              v-model="classify"
              v-for="cy in classifys"
              :key="cy"
              dense
              :val="cy"
              :label="cy"
            />
          </div>
        </q-card-section>
        <!-- 表单按钮 -->
        <q-card-actions
          align="left"
          class="q-px-md"
        >
          <q-btn
            rounded
            unelevated
            :label="$q.lang.label.ok"
            type="submit"
            color="primary"
            class="q-px-md"
          />
          <q-btn
            rounded
            outline
            :label="$q.lang.label.cancel"
            type="reset"
            color="primary"
            class="q-px-md"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Task from '@/store/task/model'
export default {
  name: 'TaskFormList',
  props: {
    // 新建编辑任务ID
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 资源类型
    category: {
      type: String,
      default: '',
      required: false
    },
    // 资源ID
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    }
  },
  data () {
    return {
      // 新建任务
      model: new Task({ type: 'list' }),
      formatString: 'YYYY-MM-DD',
      classify: '清单',
      classifys: ['清单', '缺陷', '里程碑'],
      goIntoAction: false,
      description: '',
      showEditor: false
    }
  },
  computed: {
    date: {
      get () {
        return {
          from: this.model.startTime,
          to: this.model.endTime
        }
      },
      set (val) {
        this.model.startTime = val.from
        this.model.endTime = val.to
      }
    }
  },
  watch: {
    'model.description' (newVal, oldVal) {
      if (!oldVal) {
        this.description = this.model.description
        this.showEditor = !!this.description
      }
    }
  },
  components: {
    QuasarEditor: () => import('components/base/q-editor/QuasarEditor')
  },
  methods: {
    ...mapActions('task', ['loadTask', 'addTask', 'updateTask']),
    // 提交
    onSubmit () {
      this.goIntoAction = true
      this.model.tags = [this.classify]
      if (!this.model.id) {
        Object.assign(this.model,
          {
            rootId: 0,
            parentId: 0,
            objectType: this.category,
            objectId: +this.objectID,
            type: 'list'
          })
        this.addTask(this.model)
      } else {
        this.updateTask(this.model)
      }
      this.description = ''
      this.$emit('ok', this.model)
    },
    // 取消
    onCancel () {
      this.$emit('cancel')
    },
    // 清除日期
    CleanDate () {
      this.date = { from: '', to: '' }
    }
  },
  mounted () {
    if (+this.id !== 0) {
      this.loadTask(+this.id).then(task => {
        this.model = _.cloneDeep(task)
        this.description = this.model.description
        this.showEditor = !!this.description
        if (task.tags.length > 0) {
          this.classify = task.tags.join('')
        }
      })
    }
  }
}
</script>

<style>
</style>
