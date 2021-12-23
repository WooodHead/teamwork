<template>
  <q-form
    autofocus
    @submit.prevent="onSubmit"
    @reset="onCancel"
  >
    <div class="form-group"></div>
    <q-card
      flat
      bordered
    >
      <!-- 表单 -->
      <q-card-section :class="model.color">
        <q-input
          autofocus
          filled
          stack-label
          v-model="model.name"
          :placeholder="$t('task.group.placeholder')"
          lazy-rules
          :rules="[ val => val&&val.trim().length>0 || $t('rule.fieldIsRequired')]"
        />
        <tw-color-picker :set-color.sync="model.color" />
      </q-card-section>
      <!-- 按钮 -->
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
          unelevated
          outline
          :label="$q.lang.label.cancel"
          type="reset"
          color="primary"
          class="q-px-md"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script>
import Task from '@/store/task/model'
import { mapActions } from 'vuex'
import { LocalStorage } from 'quasar'
// const { getScrollTarget, setVerticalScrollPosition } = scroll

// takes an element object
// function scrollToElement (el) {
//   const target = getScrollTarget(el)
//   const offset = el.offsetTop
//   const duration = 300
//   setVerticalScrollPosition(target, offset, duration)
// }
export default {
  name: 'TaskFormGroup',
  props: {
    // 新建编辑任务ID
    id: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 父节点ID
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
      model: new Task({ type: 'group', color: 'bg-white' })

    }
  },
  methods: {
    ...mapActions('task', ['loadTask', 'addTask', 'updateTask']),
    // 提交事件
    onSubmit () {
      if (!this.model.id) {
        Object.assign(this.model,
          {
            parentId: this.parentId,
            rootId: this.parentId,
            objectType: this.category,
            objectId: +this.objectID
          })
        let list = this.$store.state.task.tasks.find(e => e.id === this.model.rootId)
        if (list.acl === 2) {
          this.model.acl = 2
          // 添加白名单
          let whiteList = []
          whiteList.push(LocalStorage.getItem('myself').id)
          whiteList.push(this.model.assignedTo)
          this.model.whiteList = whiteList.flat()
        }
        this.addTask(this.model)
      } else {
        this.updateTask(this.model)
      }
      this.$emit('ok', this.model)
    },
    // 取消事件
    onCancel () {
      this.$emit('cancel')
    }
  },
  mounted () {
    if (+this.id !== 0) {
      this.loadTask(+this.id).then(task => {
        Object.assign(this.model, _.cloneDeep(task))
      })
    }
    // scrollToElement('.form-group')
  },
  components: {
    TwColorPicker: () => import('components/base/TwColorPicker')
  }
}
</script>

<style>
</style>
