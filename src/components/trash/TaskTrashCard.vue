<template>
  <div class="widget-card-section text-left full-height">
    <!-- 任务卡片 -->
    <div
      class="relative-position text-body2"
      :class="[{'secrecy-content': !!model.acl}]"
    >
      <template>
        <q-scroll-area style="height: 180px; max-width: 300px;">
          <q-card-section class="q-pb-sm toolsCardStyle">
            <!-- 清单名称 -->
            <div
              class="flex"
              v-if="model.type==='list'"
            >
              <!-- 完成度 -->
              <q-circular-progress
                class="q-mr-xs"
                :value="progress"
                :thickness="1"
                color="green-7"
                track-color="green-4"
                size="xs"
                :style="{minWith: '18px'}"
              />
              <div class="col text-primary text-weight-bold">{{model.name}}</div>
            </div>
            <!-- 分组 -->
            <div v-if="model.type==='group'">
              <div class="text-weight-bold">{{model.name}}</div>
            </div>
            <!-- 任务项 -->
            <div v-if="model.type==='item'">
              <!-- 是否完成 -->
              <q-checkbox
                :class="['q-mr-xs',model.finished?'finished':'']"
                :value="model.finished"
                color="green-6"
                dense
              />
              {{model.name}}
            </div>
            <div v-if="model.children&&model.children.length">
              <div
                v-for="item in model.children"
                :key="item.id"
              >
                <!-- 任务项 -->
                <div v-if="item.type==='item'">
                  <!-- 是否完成 -->
                  <q-checkbox
                    :class="['q-mr-xs',item.finished?'finished':'']"
                    :value="item.finished"
                    color="green-6"
                    dense
                  />
                  {{item.name}}
                </div>
                <!-- 任务分组 -->
                <div
                  v-if="item.type==='group'"
                  class="q-mt-xs"
                >
                  <div class="text-weight-bold">{{item.name}}</div>
                  <div v-if="item.children&&item.children.length">
                    <div
                      v-for="task in item.children"
                      :key="task.id"
                    >
                      <q-checkbox
                        :class="['q-mr-xs',task.finished?'finished':'']"
                        :value="task.finished"
                        color="green-6"
                        dense
                      />
                      {{task.name}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-scroll-area>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskTrashCard',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    // 任务进度
    progress () {
      if (this.model.overview) {
        if (this.model.overview.allCount && this.model.overview.allCount === 0) {
          return 0
        } else {
          return 100 * this.model.overview.finishedAllCount / this.model.overview.allCount
        }
      } else {
        return 0
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
/deep/ .q-checkbox__bg {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  vertical-align: middle;
}
.secrecy-content {
  background-size: 80%;
}
</style>
