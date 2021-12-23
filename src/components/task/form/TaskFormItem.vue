
<template>
  <q-card
    flat
    bordered
    v-if="inset"
  >
    <q-form
      autofocus
      @submit.prevent="onSubmit"
      @reset="onCancel"
    >
      <task-field
        :model="model"
        :category="category"
        :objectID="objectID"
      />
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
  <tw-form
    v-else
    @primary="onSubmit"
    action-align="left"
  >
    <task-field-like-detail
      :model="model"
      :focus="focus"
      :goIntoAction="goIntoAction"
    />
  </tw-form>
</template>

<script>
import { date, LocalStorage } from 'quasar'
import Task from '@/store/task/model'
import { mapActions } from 'vuex'
const { getDateDiff } = date
import getCategory from '@/mixins/mixins-get-category'
import { showWarningMessage } from '@/utils/show-message'
import { computedOrder } from '@/utils/computed-order'
export default {
  name: 'TaskFormItem',
  mixins: [getCategory],
  components: {
    TaskField: () => import('components/task/form/TaskField'),
    TaskFieldLikeDetail: () => import('components/task/form/TaskFieldLikeDetail'),
    TwForm: () => import('components/base/TwForm')
  },
  props: {
    // 任务id
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 根任务id
    rootId: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 父id
    parentId: {
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
    objectID: {
      type: [Number, String],
      default: '',
      required: false
    },
    // 排序字段
    orderNumber: {
      type: [String, Number],
      default: '1',
      required: false
    },
    // 下一任务的排序字段
    nextTaskOrderNumber: {
      type: [String, Number],
      default: '',
      required: false
    },
    // 操作类型 如add edit insert
    action: {
      type: String,
      default: 'add',
      required: false
    },
    // 是否嵌入页面
    inset: {
      type: Boolean,
      required: false,
      default: false
    },
    focus: {
      type: String,
      required: false,
      default: 'name'
    }
  },
  data () {
    return {
      goIntoAction: false,
      model: _.cloneDeep(new Task()),
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
      myinfo: LocalStorage.getItem('myself')
    }
  },
  computed: {
    setting () {
      return this.$store.getters['task/taskSetting'](this.categoryModel)
    }
  },
  mounted () {
    if (+this.id !== 0) {
      this.loadTreeTasks(+this.id).then(tasks => {
        this.model = _.cloneDeep(tasks.find(t => t.id === +this.id))
      })
    }
  },
  methods: {
    ...mapActions('task', ['loadTreeTasks', 'addTask', 'batchAddTasks', 'updateTask', 'insertTask']),
    onSubmit () {
      window.RichTextEditting = false
      this.goIntoAction = true
      // 处理 assignedTo 和 notifyTo 空值
      // 预计用时不能大于结束与开始之差
      if (this.setting.predictHour && this.model.dateType === 'range') {
        const start = this.model.startTime.replace(/T/g, ' ').replace(/-/g, '/')
        const end = date.formatDate(this.model.endTime, 'YYYY-MM-DD 23:59:59').replace(/T/g, ' ').replace(/-/g, '/')
        const time = getDateDiff(new Date(end), new Date(start), 'minutes')
        if (this.model.predictHour * 60 > time) {
          showWarningMessage(this.$t('task.item.predictHourDiff'))
          return
        }
      }
      // 新建
      if (this.action === 'add') {
        Object.assign(this.model,
          {
            rootId: +this.rootId,
            parentId: +this.parentId,
            objectType: this.category,
            objectId: +this.objectID,
            assignedByID: +this.myinfo.id,
            assignedTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
          })

        let list = this.$store.state.task.tasks.find(e => e.id === this.model.rootId)
        if (list && list.acl === 2) {
          this.model.acl = 2
          // 添加白名单
          let whiteList = []
          whiteList.push(LocalStorage.getItem('myself').id)
          whiteList.push(this.model.assignedTo)
          this.model.whiteList = whiteList.flat()
        }
        if (this.model.isSplitSingleTask && this.model.assignedTo.length > 1) {
          // 拆分为单人任务
          let modelList = []
          let assignedTos = _.chunk(this.model.assignedTo)
          _.forEach(assignedTos, (assignedTo) => {
            let cloneModel = _.cloneDeep(this.model)
            cloneModel.assignedTo = assignedTo
            cloneModel.orderNumber = 0
            modelList.push(cloneModel)
          })
          this.batchAddTasks({ modelList })
        } else {
          // 不拆分为单人任务
          this.addTask(this.model)
        }
        // 编辑
      } else if (this.action === 'edit') {
        // 拆分为单人任务
        if (this.model.isSplitSingleTask && this.model.assignedTo.length > 1) {
          let modelList = []
          let assignedTos = _.chunk(_.drop(this.model.assignedTo))
          _.forEach(assignedTos, (assignedTo) => {
            let cloneModel = _.cloneDeep(this.model)
            cloneModel.id = 0
            cloneModel.orderNumber = 0
            cloneModel.assignedTo = assignedTo
            modelList.push(cloneModel)
          })
          // 批量新增拆分任务
          this.batchAddTasks({ modelList })
          // 更新当前任务
          this.model.assignedTo = _.slice(this.model.assignedTo, 0, 1)
        }
        this.updateTask(this.model)
        if (!this.inset) {
          this.$router.push({
            name: 'taskDetail',
            params: {
              category: this.model.objectType,
              objectID: +this.model.objectId,
              id: +this.model.id
            }
          })
        }
        // 插入
      } else if (this.action === 'insert') {
        Object.assign(this.model,
          {
            rootId: +this.rootId,
            parentId: this.parentId,
            orderNumber: this.orderNumber,
            objectType: this.category,
            objectId: +this.objectID,
            assignedByID: +this.myinfo.id,
            assignedTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
          })
        let list = this.$store.state.task.tasks.find(e => e.id === this.model.rootId)
        if (list && list.acl === 2) {
          this.model.acl = 2
          // 添加白名单
          let whiteList = []
          whiteList.push(LocalStorage.getItem('myself').id)
          whiteList.push(this.model.assignedTo)
          this.model.whiteList = whiteList.flat()
        }
        // 拆分为单人任务
        if (this.model.isSplitSingleTask && this.model.assignedTo.length > 1) {
          let modelList = []
          let assignedTos = _.chunk(_.drop(this.model.assignedTo))
          let preTaskOrderNumber = this.model.orderNumber
          _.forEach(assignedTos, (assignedTo) => {
            let cloneModel = _.cloneDeep(this.model)
            cloneModel.id = 0
            cloneModel.orderNumber = computedOrder(preTaskOrderNumber, this.nextTaskOrderNumber)
            preTaskOrderNumber = cloneModel.orderNumber
            cloneModel.assignedTo = assignedTo
            modelList.push(cloneModel)
          })
          // 批量新增拆分任务
          this.batchAddTasks({ modelList })
          // 更新当前任务
          this.model.assignedTo = _.slice(this.model.assignedTo, 0, 1)
        }
        this.insertTask({ task: this.model })
      }
      this.model = new Task()
      this.$emit('ok')
    },
    // 取消
    onCancel () {
      this.model = new Task()
      this.$emit('cancel')
    }
  }
}
</script>

<style>
.task-add .color .q-avatar__content {
  border: solid 1px black;
}
</style>

<style lang="scss" scoped>
</style>
