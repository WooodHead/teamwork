<template>
  <q-page
    class="q-pa-sm column items-center"
    @click="cleanCtrlList()"
  >
    <!-- 面包屑区域 -->
    <tw-breadcrumbs></tw-breadcrumbs>
    <router-view></router-view>
    <tw-page-scroller />
  </q-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: {
    category: {
      type: String,
      required: false,
      default: 'person'
    },
    objectID: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('widget', ['widgets']),
    ...mapState('task', ['tasks']),
    resource () {
      const { category, objectID } = this
      return { category, objectID }
    },
    task () {
      const id = +this.$route.params.id || 0
      return this.tasks.find(t => t.id === id) || {}
    },
    routeTask () {
      return { route: this.$route, task: this.task }
    }
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        this.cleanCtrlList()
      }
    },
    resource: {
      handler (newVal, oldVal) {
        this.setModuleBreadcrumbs()
      },
      immediate: true,
      deep: true
    },
    routeTask: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        let newRoute = newVal.route,
          newTask = newVal.task,
          oldTask = oldVal ? oldVal.task : {}
        if (this.$q.platform.is.mobile) return
        // 设置任务主页面包屑
        this.setTaskIndexBreadcrumb(newRoute.name)
        if (!newTask) { return }
        // 设置任务实例的面包屑
        this.setTaskInstanceBreadcrumb(newTask, oldTask)
        if (newRoute.name === 'TasksIncludesTag') {
          this.pushWidgetBreadcrumb({
            id: `TaskTagCount`,
            title: this.$t('task.TaskTagCount'),
            to: {
              name: 'TaskTagCount',
              params: {
                category: this.category,
                objectID: +this.objectID
              }
            }
          })
        }
        // 最后判断如果是复制，转移，历史记录,归档区等，则把任务自身加进去
        if (['taskCopy', 'taskMove', 'taskHistory', 'archivedTasks'].includes(newRoute.name)) {
          this.pushWidgetBreadcrumb({
            id: newTask.id,
            title: newTask.name,
            to: {
              name: 'taskDetail',
              params: {
                category: this.category,
                objectID: +this.objectID,
                id: +newTask.id
              }
            }
          })
        } else {
          this.deleteWidgetBreadcrumb(newTask.id)
        }
      }
    }
  },
  components: {
    TwBreadcrumbs: () => import('components/base/TwBreadcrumbs'),
    TwPageScroller: () => import('components/base/TwPageScroller')
  },
  methods: {
    ...mapMutations('task', ['setObjectType', 'setObjectID', 'cleanCtrlList']),
    ...mapActions('breadcrumbs', ['setModuleBreadcrumbs']),
    ...mapMutations('breadcrumbs', [
      'pushWidgetBreadcrumb',
      'clearWidgetBreadcrumbs',
      'deleteAfterWidgetBreadcrumbs',
      'deleteWidgetBreadcrumb'
    ]),
    setTaskIndexBreadcrumb (routeName) {
      // 加入/去掉任务主页面包屑
      routeName !== 'task'
        ? this.pushWidgetBreadcrumb({
          id: `${this.category}${this.objectID}TaskIndex`,
          title: this.widgets.task.label,
          to: {
            name: 'task',
            params: { category: this.category, objectID: +this.objectID }
          }
        })
        : this.clearWidgetBreadcrumbs()
    },
    setTaskInstanceBreadcrumb (newTask, oldTask) {
      // 在任务主页面包屑已加入的前提下追加面包屑
      // 也就是说，如果是任务清单，并且该任务清单没有归档，则不再追加面包屑

      // 如果当前任务为空的话只保留业务模块的面包屑
      // 如果前后任务不一致，只在（id,parentId,title,archived）有变的情况下，
      // 在保留业务模块面包屑的基础上，重新添加任务的面包屑，否则不处理面包屑
      newTask = newTask || {}
      oldTask = oldTask || {}
      if (!newTask.id) {
        this.deleteAfterWidgetBreadcrumbs(`${this.category}${this.objectID}TaskIndex`)
      } else if (newTask.id === oldTask.id &&
        newTask.parentId === oldTask.parentId &&
        newTask.title === oldTask.title &&
        newTask.archived === oldTask.archived) {
      } else {
        this.deleteAfterWidgetBreadcrumbs(`${this.category}${this.objectID}TaskIndex`)
        // 如果是任务清单，并且该清单已经归档，则添加“归档的清单”面包屑
        if (newTask.type === 'list' && newTask.archived) {
          this.pushWidgetBreadcrumb({
            id: `archivedList`,
            title: this.$t('task.archivedList'),
            to: {
              name: 'archivedTaskLists',
              params: {
                category: this.category,
                objectID: +this.objectID
              }
            }
          })
        }

        // 如果是任务分组，首先判定其所在的任务清单是否归档，
        // 分组的任务清单已归档，加入“归档的任务清单”和所在清单的面包屑
        // 分组的任务清单未归档，只加入所在的清单面包屑
        // 自身如果归档，再插入父任务下的归档任务面包屑
        // 以上如果存在多个归档，只显示最后一个归档区
        if (newTask.type === 'group') {
          const taskList = this.tasks.find(a => a.id === +newTask.parentId) || {}
          this.pushTaskListBreadcrumb(taskList, newTask.archived)
          if (newTask.archived) {
            this.pushWidgetBreadcrumb({
              id: `archivedTasksIn${taskList.id}`,
              title: this.$t('task.archived'),
              to: {
                name: 'archivedTasks',
                params: {
                  category: this.category,
                  objectID: +this.objectID,
                  id: +taskList.id
                }
              }
            })
          }
        }

        // 如果是单个任务，有以下几种情况:
        // 在清单下：
        // （"归档的任务清单"）>任务清单
        // 在组下：
        // 清单和组都归档：（"归档的任务清单">）任务清单>"归档的任务组">任务组
        // 清单不归档和组归档：任务清单>"归档的任务清单">任务组
        // 清单归档和组不归档："归档的任务清单">任务清单>任务组
        // 清单和组都不归档：任务清单>任务组
        // 自身如果归档，再插入父任务下的归档任务面包屑
        // 以上如果存在多个归档，只显示最后一个归档区
        if (newTask.type === 'item') {
          const taskParent = this.tasks.find(a => a.id === +newTask.parentId) || {}
          if (taskParent.type === 'list') {
            const taskList = taskParent
            this.pushTaskListBreadcrumb(taskList)
          } else if (taskParent.type === 'group') {
            const taskGroup = taskParent,
              taskList = this.tasks.find(a => a.id === +taskGroup.parentId) || {}
            this.pushTaskListBreadcrumb(taskList, taskGroup.archived || newTask.archived)
            this.pushTaskGroupBreadcrumb(taskGroup, newTask.archived)
          }
          if (newTask.archived) {
            this.pushWidgetBreadcrumb({
              id: `archivedTasksIn${taskParent.id}`,
              title: this.$t('task.archived'),
              to: {
                name: 'archivedTasks',
                params: {
                  category: this.category,
                  objectID: +this.objectID,
                  id: +taskParent.id
                }
              }
            })
          }
        }
      }
    },
    /** 把任务清单加入面包屑 */
    pushTaskListBreadcrumb (taskList, ignoreArchived) {
      if (taskList.archived && !ignoreArchived) {
        this.pushWidgetBreadcrumb({
          id: 'archivedList',
          title: this.$t('task.archivedList'),
          to: {
            name: 'archivedTaskLists',
            params: {
              category: this.category,
              objectID: +this.objectID
            }
          }
        })
      }
      this.pushWidgetBreadcrumb({
        id: taskList.id,
        title: taskList.name,
        to: {
          name: 'taskDetail',
          params: {
            category: this.category,
            objectID: +this.objectID,
            id: +taskList.id
          }
        }
      })
    },
    /** 把任务分组加入面包屑 */
    pushTaskGroupBreadcrumb (taskGroup, ignoreArchived) {
      if (taskGroup.archived && !ignoreArchived) {
        this.pushWidgetBreadcrumb({
          id: `archivedTasksIn${taskGroup.id}`,
          title: this.$t('task.archived'),
          to: {
            name: 'archivedTasks',
            params: {
              category: this.category,
              objectID: +this.objectID,
              id: +taskGroup.id
            }
          }
        })
      }
      this.pushWidgetBreadcrumb({
        id: taskGroup.id,
        title: taskGroup.name,
        to: {
          name: 'taskDetail',
          params: {
            category: this.category,
            objectID: +this.objectID,
            id: +taskGroup.id
          }
        }
      })
    }
  },
  mounted () {
    this.setObjectType(this.objectType)
    this.setObjectID(+this.objectID)
  }
}
</script>

<style>
</style>
