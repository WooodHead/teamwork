<template>
  <q-card
    :flat="$q.screen.lt.sm"
    class="card-grow-in-page q-px-xxl"
  >
    <q-card-section />
    <q-card-section>
      <div class="row q-gutter-lg">
        <div
          v-if="$q.screen.gt.sm"
          class="col-shrink q-pt-md"
        >
          <q-card class="torn-card">
            <q-card-section>
              <task-intro-batch
                :ids="ids"
                :category="category"
                :objectID="objectID"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-grow column q-gutter-y-md">
          <div class="text-h5">
            {{$t('action.assignedTasks')}}
          </div>
          <div v-if="category">
            <div class="text-subtitle1">
              {{$t('action.chooseAssignedPerson')}}
            </div>
            <tw-select-person
              outlined
              stack-label
              v-model="assignedTo"
              multiple
              :label="$t('task.item.assignedTo')"
              placeholder=""
              emit-value
            />
            <q-checkbox
              v-if="assignedTo.length>0"
              v-model="isNotify"
              :label="$t('task.item.isnotify')"
            />
          </div>
          <div class="row q-gutter-md ">
            <q-btn
              color="primary"
              :label="$q.lang.label.ok"
              @click="save"
            />
            <q-btn
              color="primary"
              :label="$q.lang.label.cancel"
              @click="cancel"
              outline
            />
          </div>
          <div class="row  text-body1">
            <span>或</span>
            <a
              class="q-pl-sm text-primary"
              href="javascript:void(0);"
              @click="save"
            >移除所有指派人</a>
          </div>
        </div>
      </div>
    </q-card-section>

  </q-card>
</template>

<script>
import { mapActions } from 'vuex'
import { format } from 'quasar'
const { capitalize } = format
export default {
  name: 'TaskAssignBatch',
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
  components: {
    TaskIntroBatch: () => import('components/task/TaskIntroBatch'),
    TwSelectPerson: () => import('components/base/TwSelectPerson.vue')
  },
  data () {
    return {
      assignedTo: [],
      isNotify: false
    }
  },
  watch: {
    'assignedTo': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.isNotify = true
        }
      }
    }
  },
  methods: {
    capitalize,
    ...mapActions('task', ['assignTasks']),
    save () {
      this.assignTasks({
        IDs: this.ids,
        IsNotify: this.isNotify,
        AssignedTo: this.assignedTo.join(',')
      })
      this.$router.push({
        name: 'task',
        params: {
          category: this.category,
          objectID: +this.objectID
        }
      })
    },
    cancel () {
      this.$router.push({
        name: 'task',
        params: {
          category: this.category,
          objectID: +this.objectID
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
