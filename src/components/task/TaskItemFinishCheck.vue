<template>
  <div>
    <q-checkbox
      v-if="!(inDetail||inEdit)"
      :value="model.finished"
      dense
      @input="mark"
      color="green-6"
    />
    <div v-else>
      <q-checkbox
        v-if="model.finished"
        size="xl"
        :value="model.finished"
        class="checkbox-mark q-pa-xs"
        color="green-6"
        @input.once="mark"
      />
      <div
        v-else
        class="flex mark-button q-pa-xs"
        :class="{'cursor-pointer':inDetail}"
        @click="mark"
      >
        <span
          v-if="inDetail"
          class="items-center mark-button-text text-center"
        >{{$t('task.detail.markdone')}}</span>
        <q-spinner
          class="loading"
          v-if="requesting"
          color="primary"
          size="3em"
          :thickness="3"
        />
      </div>
    </div>
    <task-form-work-hour
      :prompt="prompt"
      @close="closePrompt"
      :model="{ id: model.id,
      finished:model.finished, 
      predictHour: model.predictHour,
      workHour: model.workHour }"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { debounce } from 'quasar'
import getCategory from '@/mixins/mixins-get-category'
export default {
  name: 'TaskItemFinishCheck',
  mixins: [getCategory],
  props: {
    model: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: 0,
          objectType: 'project',
          objectId: 0,
          finished: false,
          predictHour: 0,
          workHour: 0
        }
      }
    },
    inEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    inDetail: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      requesting: false,
      prompt: false
    }
  },
  methods: {
    ...mapActions('task', ['finishTask', 'activateTask']),
    debounceCheckTask: debounce(function () {
      this.checkTask()
    }, 1000, true),
    checkTask () {
      // 编辑页面不可勾选完成
      if (this.inEdit) return
      // 激活
      if (this.model.finished) {
        this.activateTask({ id: this.model.id })
      }
      this.prompt = this.settingWorkHour // 弹出输入实际工时窗口
      if (!this.prompt) {
        // 直接完成
        this.requesting = this.inDetail
        this.finishTask({ id: this.model.id })
          .then(res => (this.requesting = false))
      }
    },
    mark () {
      if (this.inEdit) {
        return
      }
      if (this.settingWorkHour) {
        this.prompt = true
      } else {
        this.debounceCheckTask()
      }
    },
    closePrompt () {
      this.prompt = false
    }

  },
  components: {
    TaskFormWorkHour: () => import('components/task/form/TaskFormWorkHour')
  },
  computed: {
    settingWorkHour () {
      return this.$store.getters['task/taskSetting'](this.categoryModel).actualHour
    },
    category () {
      return this.model.objectType// mixins需要这个字段
    },
    objectID () {
      return this.model.objectId// mixins需要这个字段
    }
  }
}

</script>

<style lang="scss" scoped>
/deep/ .q-checkbox__bg {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
/deep/.checkbox-mark .q-checkbox__bg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  vertical-align: middle;
}

.mark-button {
  position: relative;
}
.mark-button {
  width: 60px;
  height: 60px;
  border: 2px solid lightgray;
  border-radius: 10px;
}
.mark-button-text {
  font-size: 12px;
  height: 30px;
  margin-top: 10px;
}
.mark-button .loading {
  position: absolute;
  top: 5px;
  left: 7px;
}
</style>
