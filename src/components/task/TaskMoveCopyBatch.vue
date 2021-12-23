<template>
  <resource-move-copy
    type='task'
    :ids="ids"
    :category="category"
    :objectID="+objectID"
    disableDefaultBtns
    cardStyle="torn"
    @selectItem="onSelectItem"
  >
    <!-- 子项的选择卡片 -->
    <q-card-section
      slot="subSelect"
      class="row q-gutter-md flex-center"
    >
      <task-list-card
        v-for="taskList in taskLists"
        :key="taskList.id"
        :id="+taskList.id"
        :category="category"
        :objectID="+objectID"
      >
        <div class="absolute-bottom text-center q-pb-md moveButton">
          <q-btn
            no-caps
            rounded
            size='sm'
            color="primary"
            @click.stop="action(+taskList.id, taskList.objectId, taskList.objectType)"
          >
            {{actionType==='move'? $t('task.moveCopy.moveTo'):$t('task.moveCopy.copyTo')}}
          </q-btn>
        </div>
      </task-list-card>
      <!-- 无子选项时的提示 -->
      <div v-if="hintLabel.length">
        {{hintLabel}}
      </div>
    </q-card-section>
  </resource-move-copy>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'TaskMoveCopyBatch',
  props: {
    ids: {
      type: String,
      required: true
    },
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
    // 操作类型：移动/复制
    actionType: {
      type: String,
      default: function () {
        return this.$route.path.split('/').slice(-1)[0]
      },
      required: false
    }
  },
  data () {
    return {
      currentObjectType: this.category,
      currentObjectID: this.objectID,
      isNotSpecific: false
    }
  },
  computed: {
    ...mapState('task', ['tasks']),
    ...mapGetters('task', ['allTaskLists']),
    taskLists () {
      return this.allTaskLists({ objectType: this.currentObjectType, objectID: +this.currentObjectID })
    },
    hintLabel () {
      if (this.isNotSpecific && !this.taskLists.length) {
        return this.$t('task.moveCopy.choose') + this.$t(`${this.currentObjectType}.module`)
      } else if (!this.taskLists.length) {
        return this.actionType === 'move' ? this.$t('task.moveCopy.nowhereMove', { type: this.$t(`${this.currentObjectType}.module`) }) : this.$t('task.moveCopy.nowhereCopy', { type: this.$t(`${this.currentObjectType}.module`) })
      } else {
        return ''
      }
    }
  },
  components: {
    ResourceMoveCopy: () => import('components/resource/ResourceMoveCopy'),
    TaskListCard: () => import('components/task/TaskListCard')
  },
  methods: {
    ...mapActions('task', ['loadTask', 'loadTaskLists', 'moveTasks', 'copyTasks']),
    action (targetId, objectID, objectType) {
      let query = {
        IDs: this.ids,
        To: {
          ObjectID: objectID,
          ObjectType: objectType,
          TargetID: targetId
        }
      }
      this.$store.dispatch(`task/${this.actionType}Tasks`, query).then(
        // 跳转详情页
        this.$router.push({
          name: 'taskDetail',
          params: {
            category: objectType,
            objectID: objectID,
            id: targetId
          }
        })
      )
    },
    // 切换资源：其他项目/其他团队下的项目
    onSelectItem (val) {
      this.isNotSpecific = val.isNotSpecific
      if (this.isNotSpecific) {
        this.currentObjectID = 0
      } else {
        this.currentObjectType = val.category
        this.currentObjectID = +val.objectID
        this.loadTaskLists({
          objectID: +val.objectID,
          objectType: val.category
        })
      }
    }
  },
  mounted () {
    this.loadTaskLists({
      objectID: +this.objectID,
      objectType: this.category
    })
  }
}
</script>

<style lang="scss" scoped>
.moveButton {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 1rem 0.5rem;
  background: linear-gradient(rgba(255, 255, 255, 0), #fff 30%);
  line-height: 2em;
}
</style>
